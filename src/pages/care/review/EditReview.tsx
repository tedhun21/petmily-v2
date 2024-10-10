import { ImageCentered, Texts14h21, Title } from 'commonStyle';
import {
  Img,
  ImgContainer,
  ImgPreview,
  ImgPreviewItem,
  ImgSelectButton,
  ImgSelectWrapper,
  ImgTitle,
  MainContainer,
  PetsitterCard,
  PetsitterImage,
  PetSitterInfo,
  Receipt,
  RemoveButton,
  ReservationContainer,
  ReservationInfo,
  StarContainer,
  StarTitle,
  SubmitButton,
  TextArea,
  TextContainer,
  TextTitle,
} from './CreateReview';
import { PiStarFill } from 'react-icons/pi';
import { timeRange } from 'utils/date';
import { FaXmark } from 'react-icons/fa6';
import useSWR from 'swr';
import { fetcherWithCookie, updaterWithCookie } from 'api';
import HoverRating from '../../../components/HoverRating';
import { formatProgress } from 'utils/misc';
import { useNavigate, useParams } from 'react-router-dom';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import useSWRMutation from 'swr/mutation';
import { Loading } from '@components/Loading';

interface UpdateReviewFormData {
  star: number;
  body: string;
  files: File[];
  photos: string[];
  deleteFiles: string[];
}

const API_URL = process.env.REACT_APP_API_URL;

export default function EditReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: reservation } = useSWR(`${API_URL}/reservations/${id}`, fetcherWithCookie);

  const { isMutating, trigger } = useSWRMutation(`${API_URL}/reviews/${reservation?.review.id}`, updaterWithCookie, {
    onSuccess: () => {
      window.alert('리뷰 작성하였습니다.');
      navigate('/cares');
    },
    onError: () => {
      window.alert('리뷰 작성에 실패했습니다. 다시 시도해 주세요.');
    },
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [reviewImages, setReviewImages] = useState([]);

  const { register, setValue, handleSubmit, watch } = useForm<UpdateReviewFormData>({
    defaultValues: { star: 0, body: '', files: [], photos: [], deleteFiles: [] },
  });
  const selectedFiles = watch('files');
  const imageUrls = watch('photos');

  // 파일 선택 Ref open
  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 파일 이미지 선택 onChange
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const totalFiles = selectedFiles.length + reviewImages.length + files.length;

      if (totalFiles <= 5) {
        setValue('files', [...selectedFiles, ...newFiles]);
      } else {
        window.alert('최대 5개의 이미지를 선택할 수 있습니다.');
      }
    }
  };

  // 파일 이미지 remove
  const handleRemoveInputImage = (indexToRemove: number) => {
    // 해당 인덱스의 이미지를 목록에서 제거
    setValue(
      'files',
      selectedFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  // 서버에 저장된 이미지 remove
  const handleRemoveReviewImage = (indexToRemove: number) => {
    // 제거할 url
    const removedImageUrl = imageUrls[indexToRemove];

    // 서버에서 온 이미지 url 업데이트(프리뷰)
    setValue(
      'photos',
      imageUrls.filter((_, index) => index !== indexToRemove),
    );

    // 삭제할 이미지 url 업데이트
    setValue('deleteFiles', [...watch('deleteFiles'), removedImageUrl]);
  };

  const onSubmit = async (data: any) => {
    const { star, files, body, deleteFiles } = data;

    const formData = new FormData();
    const updateReviewData = {
      reservationId: reservation.id,
      body,
      star,
      deleteFiles,
    };

    formData.append('data', JSON.stringify(updateReviewData));

    if (files.length > 0) {
      files.forEach((file: File) => {
        formData.append('files', file);
      });
    }

    await trigger({ formData });
  };

  // 서버에서 온 리뷰 데이터 기본값 세팅(통신 완료 후)
  useEffect(() => {
    if (reservation?.review) {
      setValue('star', reservation.review.star);
      setValue('body', reservation.review.body);
      setValue('photos', reservation.review.photos);
    }
  }, [reservation?.review]);

  return (
    <MainContainer>
      <Title>후기 작성</Title>
      {/* 예약 정보 (펫시터 정보, 예약 주소, 예약 날짜, 예약 시간, 펫시터가 작성한 케어일지 보기) */}
      <Receipt>
        <PetSitterInfo>
          <span>예약번호: {reservation?.id}</span>
        </PetSitterInfo>
        <PetsitterCard>
          <PetsitterImage>
            <ImageCentered
              src={reservation?.petsitter?.photo ? `${reservation?.petsitter?.photo}` : '/imgs/DefaultUserProfile.jpg'}
              alt="petsitter_photo"
            />
          </PetsitterImage>
          <div>
            <span>{reservation?.petsitter?.nickname} 펫시터님</span>
            <div>
              <PiStarFill size="20px" color="279EFF" />
              <span>{reservation?.petstter?.star}</span>
            </div>
          </div>
        </PetsitterCard>
        <ReservationContainer>
          <ReservationInfo>
            <span>예약 일자</span>
            <Texts14h21>{reservation?.date}</Texts14h21>
          </ReservationInfo>
          <ReservationInfo>
            <span>예약 시간</span>
            <Texts14h21>{timeRange(reservation?.startTime, reservation?.endTime)}</Texts14h21>
          </ReservationInfo>
          <ReservationInfo>
            <span>주소</span>
            <Texts14h21>{`${reservation?.address} ${reservation?.detailAddress}`}</Texts14h21>
          </ReservationInfo>
          <ReservationInfo>
            <span>펫</span>
            <div>{reservation?.pets.map((pet: any) => <Texts14h21 key={pet.id}>{pet.name}</Texts14h21>)}</div>
          </ReservationInfo>
          <ReservationInfo>
            <span>상태</span>
            <Texts14h21>{formatProgress(reservation?.status)}</Texts14h21>
          </ReservationInfo>
        </ReservationContainer>
      </Receipt>

      <StarContainer>
        <StarTitle>별점</StarTitle>
        <HoverRating value={watch('star')} setValue={setValue} />
      </StarContainer>

      <ImgContainer>
        <ImgTitle>사진 첨부</ImgTitle>
        <input
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <ImgSelectWrapper>
          <ImgSelectButton onClick={openFileInput}>파일 선택</ImgSelectButton>
          <Texts14h21>최대 5개의 이미지를 선택할 수 있습니다.</Texts14h21>
        </ImgSelectWrapper>
        <ImgPreview>
          {/* files가 존재할 때 미리보기를 렌더링 */}
          {selectedFiles &&
            Array.from(selectedFiles as File[]).length > 0 &&
            Array.from(selectedFiles as File[]).map((file, index) => (
              <ImgPreviewItem key={index}>
                <Img src={URL.createObjectURL(file)} alt={`Selected ${index}`} />
                <RemoveButton onClick={() => handleRemoveInputImage(index)}>
                  <FaXmark color="white" size="16px" />
                </RemoveButton>
              </ImgPreviewItem>
            ))}
          {Array.isArray(imageUrls) &&
            imageUrls.length > 0 &&
            imageUrls.map((url: string, index: number) => (
              <ImgPreviewItem key={index}>
                <Img src={`${url}`} alt={`Review Server Image ${index}`} />
                <RemoveButton onClick={() => handleRemoveReviewImage(index)}>
                  <FaXmark color="white" size="16px" />
                </RemoveButton>
              </ImgPreviewItem>
            ))}
        </ImgPreview>
      </ImgContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextContainer>
          <TextTitle>후기 내용</TextTitle>
          <TextArea placeholder="케어는 어떠셨나요?" {...register('body')} />
        </TextContainer>

        <SubmitButton type="submit" disabled={isMutating}>
          {isMutating ? <Loading /> : <span>후기 등록</span>}
        </SubmitButton>
      </form>
    </MainContainer>
  );
}

{
  /* <ImgContainer>
        <ImgTitle>사진 첨부</ImgTitle>
        <input
          type="file"
          accept="image/png, image/jpeg"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          style={{ display: 'none' }}
        />
        <ImgSelectWrapper>
          <ImgSelectButton onClick={openFileInput}>파일 선택</ImgSelectButton>
          <div>최대 5개의 이미지를 선택할 수 있습니다.</div>
        </ImgSelectWrapper>
        <ImgPreview>
          {selectedFiles.map((file, index) => (
            <ImgPrevieItem key={index} className="image-preview-item">
              <Img src={URL.createObjectURL(file)} alt={`Selected ${index}`} />
              <RemoveButton onClick={() => handleRemoveInputImage(index)}>
                <img src="/icons/X.png" alt="x" width="10"></img>
              </RemoveButton>
            </ImgPrevieItem>
          ))}
          {reviewImages.map((imageUrl, index) => (
            <ImgPrevieItem key={index} className="image-preview-item">
              <Img src={imageUrl} alt={`Review Image ${index}`} />
              <RemoveButton onClick={() => handleRemoveReviewImage(index)}>
                <img src="/icons/X.png" alt="x" width="10"></img>
              </RemoveButton>
            </ImgPrevieItem>
          ))}
        </ImgPreview>
      </ImgContainer> */
}
