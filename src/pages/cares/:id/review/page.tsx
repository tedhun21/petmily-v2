import { ChangeEvent, useEffect, useRef } from 'react';

import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthSWR, useAuthSWRMutation } from 'hooks/authSWR';

import { toast } from 'react-toastify';
import { FaXmark } from 'react-icons/fa6';

import Loading from '@components/Loading';
import { BottomFixed, Float, Title } from 'styles/commonStyle';
import { fetcher, poster, updater } from 'api';
import HoverRating from '@components/HoverRating';
import { Button } from '@components/buttons/Button';
import XButton from '@components/buttons/XButton';
import { Text } from '@components/Text';
import { Flex } from '@components/Flex';

interface ReviewFormValues {
  star: number;
  body: string;
  files: File[];
  photos: string[];
  deleteFiles: string[];
}

export default function ReviewPage() {
  const { id: reservationId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { register, setValue, watch, handleSubmit } = useForm<ReviewFormValues>({
    defaultValues: { star: 5, body: '', files: [], photos: [], deleteFiles: [] },
  });
  // 선택한 사진
  const selectedFiles = watch('files') ?? [];
  // 서버에서 가져온 사진
  const imageUrls = watch('photos') ?? [];

  const { data: review } = useAuthSWR(`/reservations/${reservationId}/review`, fetcher);

  // 후기 등록
  const { trigger: createTrigger, isMutating: isCreateMutating } = useAuthSWRMutation('/reviews', poster, {
    onSuccess: () => {
      toast.success('후기 작성하였습니다!');
      navigate(`/cares/${reservationId}`);
    },
    onError: () => {
      toast.error('후기 작성에 실패했습니다. 다시 시도해 주세요');
    },
  });

  // 후기 수정
  const { trigger: updateTrigger, isMutating: isUpdateMutating } = useAuthSWRMutation(
    `/reviews/${review?.id}`,
    updater,
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
    setValue('deleteFiles', [...(watch('deleteFiles') ?? []), removedImageUrl]);
  };

  const onSubmit = (data: ReviewFormValues) => {
    const { star, body, files, deleteFiles } = data;

    if (review) {
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

      // 후기 수정
      updateTrigger(formData);
    } else {
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
      // 후기 등록
      createTrigger(formData);
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
    <main>
      <Flex direction="column">
        <Flex justifyContent="center" alignItems="center">
          <Title>{review ? '후기 수정' : '후기 작성'}</Title>
        </Flex>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Flex direction="column" gap="xl">
            <Flex direction="column">
              <Text size="base">별점</Text>
              <HoverRating value={watch('star')} setValue={setValue} />
            </Flex>

            <Flex direction="column" gap="sm">
              <Text size="base">후기 내용</Text>
              <TextArea placeholder="케어는 어떠셨나요?" {...register('body')} />
            </Flex>

            <Flex direction="column" gap="lg">
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
                  Array.from(selectedFiles as File[]).map((file: File, index: number) => (
                    <ImagePreviewItem key={index}>
                      <Img src={URL.createObjectURL(file)} alt={`selected_${index}`} />
                      <Absolute>
                        <XButton onClick={() => handleRemoveInputImage(index)} />
                      </Absolute>
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
            </Flex>
          </Flex>

          <BottomFixed>
            <FloatButtonContainer>
              <Button type="submit" disabled={isCreateMutating || isUpdateMutating} size="lg" fullWidth>
                {isCreateMutating || isUpdateMutating ? (
                  <Flex justifyContent="center" alignItems="center">
                    <Loading />
                  </Flex>
                ) : (
                  <span>{review ? '후기 수정' : '후기 등록'}</span>
                )}
              </Button>
            </FloatButtonContainer>
          </BottomFixed>
        </form>
      </Flex>
    </main>
  );
}

const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: ${({ theme }) => theme.spacing.sm};
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
  padding: ${({ theme }) => theme.spacing.xs};
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
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.colors.background.highlight};
  border: 1px solid ${({ theme }) => theme.colors.line.box.primary};
  border-radius: ${({ theme }) => theme.radius.circle};
`;

const Absolute = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const FloatButtonContainer = styled(Float)`
  bottom: 0;
  left: 0;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.background.primary};
`;
