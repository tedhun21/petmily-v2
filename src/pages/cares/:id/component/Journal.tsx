import { ChangeEvent, useEffect, useRef } from 'react';

import { useForm } from 'react-hook-form';
import styled from 'styled-components';
import { useAuthSWRMutation } from 'hooks/authSWR';
import { FaXmark } from 'react-icons/fa6';
import { toast } from 'react-toastify';

import Loading from '@components/Loading';
import { poster, updater } from 'api';
import { BlueButton, CenterContainer, Texts14h20, Texts16h24, Title } from 'styles/commonStyle';

export default function Journal({ journal, reservationId }: any) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, setValue, watch, handleSubmit } = useForm();

  const selectedFiles = watch('files');
  const imageUrls = watch('photos');

  // 케어일지 등록
  const { trigger: createTrigger, isMutating: isCreateMutating } = useAuthSWRMutation('/journals', poster);

  // 케어일지 수정
  const { trigger: updateTrigger, isMutating: isUpdateMutating } = useAuthSWRMutation(
    `/journals/${journal?.id}`,
    updater,
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
      const totalFiles = (selectedFiles?.length || 0) + files.length;

      if (totalFiles <= 5) {
        setValue('files', [...(selectedFiles || []), ...newFiles]);
      } else {
        toast.warning('최대 5개의 이미지를 선택할 수 있습니다!');
      }
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
    setValue('deleteFiles', [...watch('deleteFiles'), removedImageUrl]);
  };

  const onSubmit = (data: any) => {
    const { body, files, deleteFiles } = data;

    // 일지 등록
    if (journal) {
      const formData = new FormData();

      const updateData = {
        reservationId,
        body,
        deleteFiles,
      };

      formData.append('data', JSON.stringify(updateData));

      if (selectedFiles && selectedFiles.length > 0) {
        files.forEach((file: File) => formData.append('files', file));
      }

      updateTrigger(formData);
    } else {
      // 일지 수정
      const formData = new FormData();

      const createData = {
        reservationId,
        body,
      };

      formData.append('data', JSON.stringify(createData));

      if (selectedFiles && selectedFiles.legnth > 0) {
        files.forEach((file: File) => {
          formData.append('files', file);
        });
      }
      // 케어일지 등록
      createTrigger(formData);
    }
  };

  useEffect(() => {
    if (journal) {
      setValue('body', journal?.body);

      setValue('photos', journal?.photos);
    }
  }, [journal]);

  return (
    <Section>
      <Title>케어일지 작성</Title>

      <span>사진 첨부</span>
      <input
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <ImageSelectWrapper>
        <ImageSelectButton onClick={openFileInput}>파일 선택</ImageSelectButton>
        <Texts14h20>최대 5개의 이미지를 선택할 수 있습니다.</Texts14h20>
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <TextContainer>
          <TextTitle>케어일지 내용</TextTitle>
          <TextArea placeholder="케어 중 무슨 일이 있으셨나요?" {...register('body')} />
        </TextContainer>

        {/* 이미 저널이 있으면 수정 버튼 */}
        {/* 저널이 없으면 등록 버튼 */}
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
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  padding: 16px;
  border-radius: 16px;
`;

const ImageSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  > div {
    ${({ theme }) => theme.typeScale.xs};
  }
`;

const ImageSelectButton = styled(BlueButton)`
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.base};
  ${({ theme }) => theme.typeScale.sm};
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  margin: 2px;
  padding: 4px;
`;

const Img = styled.img`
  width: 100px;
  border-radius: ${({ theme }) => theme.radius.base};
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border-radius: 50%;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TextTitle = styled(Texts16h24)``;

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.base};

  ${({ theme }) => theme.typeScale.sm}
`;

const SubmitButton = styled(BlueButton)`
  padding: 8px;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.base};

  ${({ theme }) => theme.typeScale.base}
`;
