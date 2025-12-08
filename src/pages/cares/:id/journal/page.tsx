import { ChangeEvent, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { toast } from 'react-toastify';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import { useAuthSWR, useAuthSWRMutation } from '@/hooks/authSWR';
import { FaXmark } from 'react-icons/fa6';

import Loading from '@/components/Loading';
import { fetcher, poster, updater } from '@/api';
import { BottomFixed, Float, Title } from '@/styles/commonStyle';
import { Button } from '@/components/styled/Button';
import { Text } from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';

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
      toast.success('케어일지를 등록했어요.');
      navigate(`/cares/${reservationId}`);
    },
  });

  // 케어일지 수정
  const { trigger: updateTrigger, isMutating: isUpdateMutating } = useAuthSWRMutation(
    `/journals/${journal?.id}`,
    updater,
    {
      onSuccess: () => {
        toast.success('케어일지를 수정했어요.');
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
      selectedFiles.filter((_: unknown, index: number) => index !== indexToRemove),
    );
  };

  // 서버에 저장된 이미지 remove
  const handleRemoveReviewImage = (indexToRemove: number) => {
    // 제거할 url
    const removedImageUrl = imageUrls[indexToRemove];

    // 서버에서 온 이미지 url 업데이트(프리뷰)
    setValue(
      'photos',
      imageUrls.filter((_: unknown, index: number) => index !== indexToRemove),
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
    <>
      <Flex justifyContent="center" alignItems="center">
        <Title>{journal ? '케어일지 수정' : '케어일지 작성'}</Title>
      </Flex>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Flex direction="column">
          <Flex direction="column" gap="sm">
            <Text size="base">케어일지 내용</Text>
            <TextArea placeholder="케어 중 무슨 일이 있으셨나요?" {...register('body')} />
          </Flex>

          <Flex direction="column" gap="sm">
            <Text size="base">사진 첨부</Text>
            <input
              type="file"
              accept="image/png, image/jpg, image/jpeg"
              multiple
              ref={fileInputRef}
              onChange={handleFileChange}
              hidden
            />
            <Flex alignItems="center" gap="xs">
              <Button type="button" onClick={openFileInput}>
                파일 선택
              </Button>
              <Text size="sm">최대 5개의 이미지를 선택할 수 있습니다.</Text>
            </Flex>

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
          </Flex>
        </Flex>

        <BottomFixed>
          <FloatButtonContainer>
            <Button type="submit" disabled={isCreateMutating || isUpdateMutating} size="lg" borderRadius="lg" fullWidth>
              {isCreateMutating || isUpdateMutating ? (
                <Flex justifyContent="center" alignItems="center">
                  <Loading />
                </Flex>
              ) : (
                <span>{journal ? '케어일지 수정' : '케어일지 등록'}</span>
              )}
            </Button>
          </FloatButtonContainer>
        </BottomFixed>
      </form>
    </>
  );
}

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: ${({ theme }) => theme.space.sm};
  background-color: ${({ theme }) => theme.colors.background.input.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text.active};
  ${({ theme }) => theme.typeScale.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.input.hover};
  }
`;

const ImagePreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
`;

const ImagePreviewItem = styled.div`
  position: relative;
  margin: 2px;
  padding: ${({ theme }) => theme.space.xs};
`;

const Img = styled.img`
  width: 100px;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ theme }) => theme.space['2xl']};
  height: ${({ theme }) => theme.space['2xl']};
  background-color: ${({ theme }) => theme.colors.background.box.accent.primary};
  border-radius: 50%;
`;

const FloatButtonContainer = styled(Float)`
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${({ theme }) => theme.space.xl};
  background-color: transparent;
`;
