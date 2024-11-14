import { ChangeEvent, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import styled from 'styled-components';

import { FaXmark } from 'react-icons/fa6';
import { toast } from 'react-toastify';

import Loading from '@components/Loading';
import { fetcherWithCookie, posterWithCookie, updaterWithCookie } from 'api';
import { CenterContainer, Texts14h21, Texts16h24, Title } from 'commonStyle';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import HoverRating from '@components/HoverRating';

const API_URL = process.env.REACT_APP_API_URL;

interface ReviewFormData {
  star: number;
  body: string;
  files: File[];
  photos: string[];
  deleteFiles: string[];
}

export default function Review() {
  const { id: reservationId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, setValue, watch, handleSubmit } = useForm<ReviewFormData>({
    defaultValues: { star: 5, body: '', files: [], photos: [], deleteFiles: [] },
  });
  // 선택한 사진
  const selectedFiles = watch('files');
  // 서버에서 가져온 사진
  const imageUrls = watch('photos');

  const { data: review } = useSWR(`${API_URL}/reservations/${reservationId}/review`, fetcherWithCookie);

  // 후기 등록
  const { trigger: createTrigger, isMutating: isCreateMutating } = useSWRMutation(
    `${API_URL}/reviews`,
    posterWithCookie,
    {
      onSuccess: () => {
        toast.success('후기 작성하였습니다!');
        navigate(`/cares/${reservationId}`);
      },
      onError: () => {
        toast.error('후기 작성에 실패했습니다. 다시 시도해 주세요');
      },
    },
  );

  // 후기 수정
  const { trigger: updateTrigger, isMutating: isUpdateMutating } = useSWRMutation(
    `${API_URL}/reviews/${review?.id}`,
    updaterWithCookie,
    {
      onSuccess: () => {
        toast.success('후기 수정하였습니다!');
        navigate(`/cares/${reservationId}`);
      },
      onError: () => {
        toast.error('후기 수정에 실패했습니다. 다시 시도해 주세요');
      },
    },
  );

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const totalFiles = selectedFiles.length + files.length;

      if (totalFiles <= 5) {
        setValue('files', [...selectedFiles, ...newFiles]);
      }
    }
  };

  // 선택한 이미지 제거
  const handleRemoveInputImage = (indexToRemove: number) => {
    setValue(
      'files',
      selectedFiles.filter((_: any, index: number) => index !== indexToRemove),
    );
  };

  // 서버에 저장된 이미지 remove
  const handleRemoveReviewImage = (indexToRemove: number) => {
    // 제거할 url
    const removedImageUrl = imageUrls[indexToRemove];

    // 서버에서 온 이미지 url 업데이트(프리뷰)
    setValue(
      'photos',
      imageUrls.filter((_: any, index: number) => index !== indexToRemove),
    );

    // 삭제할 이미지 url 업데이트
    setValue('deleteFiles', [...watch('deleteFiles'), removedImageUrl]);
  };

  const onSubmit = (data: any) => {
    const { star, body, files, deleteFiles } = data;

    if (review) {
      const formData = new FormData();
      const createData = {
        reservationId,
        star,
        body,
      };

      formData.append('data', JSON.stringify(createData));

      if (files && files.length > 0) {
        files.forEach((file: File) => formData.append('files', file));
      }

      // 후기 수정
      updateTrigger({ formData });
    } else {
      const formData = new FormData();

      const updateData = {
        reservationId,
        star,
        body,
        deleteFiles,
      };

      formData.append('data', JSON.stringify(updateData));

      if (files && files.length > 0) {
        files.forEach((file: File) => formData.append('files', file));
      }
      // 후기 등록
      createTrigger({ formData });
    }
  };

  useEffect(() => {
    if (review) {
      setValue('star', review?.star);
      setValue('body', review?.body);
      setValue('photos', review?.photos);
    }
  }, [review]);

  return (
    <Main>
      <CenterContainer>
        <Title>{review ? '후기 수정' : '후기 작성'}</Title>
      </CenterContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <StarSection>
          <SubTitle>별점</SubTitle>
          <HoverRating value={watch('star')} setValue={setValue} />
        </StarSection>

        <TextSection>
          <SubTitle>후기 내용</SubTitle>
          <TextArea placeholder="케어는 어떠셨나요?" {...register('body')} />
        </TextSection>

        <ImageSection>
          <SubTitle>사진 첨부</SubTitle>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            hidden
          />

          <ImageSelectWrapper>
            <ImageSelectButton type="button" onClick={openFileInput}>
              파일 선택
            </ImageSelectButton>
            <Texts14h21>최대 5개의 이미지를 선택할 수 있습니다.</Texts14h21>
          </ImageSelectWrapper>

          <ImagePreview>
            {selectedFiles &&
              Array.from(selectedFiles as File[]).map((file: File, index: number) => (
                <ImagePreviewItem key={index}>
                  <Img src={URL.createObjectURL(file)} alt={`selected_${index}`} />
                  <RemoveButton type="button" onClick={() => handleRemoveInputImage(index)}>
                    <FaXmark color="white" size="16px" />
                  </RemoveButton>
                </ImagePreviewItem>
              ))}
            {Array.isArray(imageUrls) &&
              imageUrls.length > 0 &&
              imageUrls.map((url: string, index: number) => (
                <ImagePreviewItem key={index}>
                  <Img src={`${url}`} alt={`review_server_image_${index}`} />
                  <RemoveButton onClick={() => handleRemoveReviewImage(index)}>
                    <FaXmark color="white" size="16px" />
                  </RemoveButton>
                </ImagePreviewItem>
              ))}
          </ImagePreview>
        </ImageSection>

        <SubmitButton type="submit" disabled={isCreateMutating || isUpdateMutating}>
          {isCreateMutating || isUpdateMutating ? (
            <CenterContainer>
              <Loading />
            </CenterContainer>
          ) : (
            <span>{review ? '후기 수정' : '후기 등록'}</span>
          )}
        </SubmitButton>
      </Form>
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const StarSection = styled.section`
  display: flex;
  flex-direction: column;
`;

const SubTitle = styled(Texts16h24)``;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TextSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 8px;
  border-radius: 8px;
  font-family: inherit;
  ${(props) => props.theme.fontSize.s14h21}
`;

const ImageSection = styled.section``;

const ImageSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  > div {
    ${({ theme }) => theme.fontSize.s12h18}
  }
`;

const ImageSelectButton = styled.button`
  background-color: ${(props) => props.theme.colors.mainBlue};
  border: none;
  ${(props) => props.theme.fontSize.s14h21}
  padding:4px 8px;
  border-radius: 4px;
  color: white;
  white-space: nowrap;

  &:hover {
    background-color: ${(props) => props.theme.colors.subBlue};
  }

  &:active {
    background-color: ${(props) => props.theme.colors.darkBlue};
    box-shadow: ${(props) => props.theme.shadow.inset};
  }
`;

const ImagePreview = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  margin: 2px;
  padding: 4px;
`;

const Img = styled.img`
  width: 100px;
  border-radius: 8px;
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  width: 24px;
  height: 24px;
  border: 1px solid ${(props) => props.theme.lineColors.coolGray80};
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.mainBlue};
`;

const SubmitButton = styled.button`
  margin-top: 20px;
  padding: 8px;
  width: 100%;
  border-radius: 8px;
  color: white;
  background-color: ${({ theme }) => theme.colors.mainBlue};
  ${({ theme }) => theme.fontSize.s16h24}

  &:hover {
    background-color: ${({ theme }) => theme.colors.subBlue};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;
