import { ChangeEvent, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useAuthSWR, useAuthSWRMutation } from 'hooks/authSWR';
import { FaXmark } from 'react-icons/fa6';

import Loading from '@components/Loading';
import { fetcher, poster, updater } from 'api';
import { BlueButton, CenterContainer, Texts14h21, Texts16h24, Title } from 'styles/commonStyle';

interface JournalFormValue {
  body: string;
  files: File[];
  photos: string[];
  deleteFiles: string[];
}

export default function JournalPage() {
  const { id: reservationId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, setValue, watch, handleSubmit } = useForm<JournalFormValue>({
    defaultValues: { body: '', files: [], photos: [], deleteFiles: [] },
  });

  const selectedFiles = watch('files') ?? [];
  const imageUrls = watch('photos') ?? [];

  // 케어일지 가져오기
  const { data: journal } = useAuthSWR(`/reservations/${reservationId}/journal`, fetcher);

  // 케어일지 등록
  const { trigger: createTrigger, isMutating: isCreateMutating } = useAuthSWRMutation(`/journals`, poster, {
    onSuccess: () => {
      toast.success('케어일지를 등록하였습니다!');
      navigate(`/cares/${reservationId}`);
    },
  });

  // 케어일지 수정
  const { trigger: updateTrigger, isMutating: isUpdateMutating } = useAuthSWRMutation(
    `/journals/${journal?.id}`,
    updater,
    {
      onSuccess: () => {
        toast.success('케어일지를 수정하였습니다!');
        navigate(`/cares/${reservationId}`);
      },
    },
  );

  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files ? Array.from(event.target.files) : [];
    const totalFiles = selectedFiles.length + newFiles.length;

    if (totalFiles <= 5) {
      setValue('files', [...selectedFiles, ...newFiles]);
    } else {
      toast.warning('최대 5개의 이미지를 선택할 수 있습니다!');
    }
  };

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
    setValue('deleteFiles', [...(watch('deleteFiles') ?? []), removedImageUrl]);
  };

  const onSubmit = (data: JournalFormValue) => {
    const { body, files, deleteFiles } = data;

    if (journal) {
      const formData = new FormData();
      const updateData = {
        reservationId,
        body,
        deleteFiles,
      };

      formData.append('data', JSON.stringify(updateData));

      if (files && files.length > 0) {
        files.forEach((file: File) => formData.append('files', file));
      }

      updateTrigger(formData);
    } else {
      const formData = new FormData();
      const createData = {
        reservationId,
        body,
      };

      formData.append('data', JSON.stringify(createData));

      if (files && files.length > 0) {
        files.forEach((file: File) => formData.append('files', file));
      }

      createTrigger(formData);
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify({ reservationId, body, ...(journal && { deleteFiles }) }));

    files?.forEach((file) => formData.append('files', file));

    journal ? updateTrigger(formData) : createTrigger(formData);
  };

  useEffect(() => {
    if (journal) {
      setValue('body', journal?.body);

      setValue('photos', journal?.photos);
    }
  }, [journal]);

  return (
    <Main>
      <CenterContainer>
        <Title>{journal ? '케어일지 수정' : '케어일지 작성'}</Title>
      </CenterContainer>

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextSection>
          <SubTitle>케어일지 내용</SubTitle>
          <TextArea placeholder="케어 중 무슨 일이 있으셨나요?" {...register('body')} />
        </TextSection>

        <ImageSection>
          <SubTitle>사진 첨부</SubTitle>
          <input
            type="file"
            accept="image/png, image/jpg, image/jpeg"
            multiple
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <ImageSelectWrapper>
            <ImageSelectButton type="button" onClick={openFileInput}>
              파일 선택
            </ImageSelectButton>
            <Texts14h21>최대 5개의 이미지를 선택할 수 있습니다.</Texts14h21>
          </ImageSelectWrapper>

          <ImagePreview>
            {selectedFiles &&
              selectedFiles.map((file: File, index: number) => (
                <ImagePreviewItem key={index}>
                  <Img src={URL.createObjectURL(file)} alt={`selected_${index}`} />
                  <RemoveButton type="button" onClick={() => handleRemoveInputImage(index)}>
                    <FaXmark color="white" size="16px" />
                  </RemoveButton>
                </ImagePreviewItem>
              ))}
            {imageUrls &&
              Array.isArray(imageUrls) &&
              imageUrls.length > 0 &&
              imageUrls.map((url: string, index: number) => (
                <ImagePreviewItem key={index}>
                  <Img src={`${url}`} alt={`review_server_image_${index}`} />
                  <RemoveButton type="button" onClick={() => handleRemoveReviewImage(index)}>
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
            <span>{journal ? '케어일지 수정' : '케어일지 등록'}</span>
          )}
        </SubmitButton>
      </form>
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const SubTitle = styled(Texts16h24)``;

const TextSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  font-family: inherit;
  ${({ theme }) => theme.fontSize.s14h21}
`;

const ImageSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const ImageSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  > div {
    ${({ theme }) => theme.fontSize.s12h18}
  }
`;

const ImageSelectButton = styled(BlueButton)`
  ${({ theme }) => theme.fontSize.s14h21}
  padding:4px 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
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
  border-radius: ${({ theme }) => theme.radius.normal};
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
  border-radius: 50%;
  background-color: ${({ theme }) => theme.background.box.blue.primary};
`;

const SubmitButton = styled(BlueButton)`
  padding: 8px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.normal};

  ${({ theme }) => theme.fontSize.s16h24}
`;
