import { useState, ChangeEvent, useRef } from 'react';

import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';

import styled from 'styled-components';

import { Column, ImageCentered, RoundedImageWrapper, Row, Texts14h21 } from 'commonStyle';

import { fetcherWithCookie, posterWithCookie } from 'api';
import { PiStarFill } from 'react-icons/pi';
import { timeRange } from 'utils/date';

import HoverRating from '../../../components/HoverRating';
import { formatProgress } from 'utils/misc';
import { useForm } from 'react-hook-form';
import { FaXmark } from 'react-icons/fa6';
import useSWRMutation from 'swr/mutation';
import { Loading } from '@components/Loading';

interface CreateReviewFormData {
  star: number;
  body: string;
  files: File[];
}

const API_URL = process.env.REACT_APP_API_URL;

export default function CreateReview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [reviewImages, setReviewImages] = useState([]);

  const { register, setValue, handleSubmit, watch } = useForm<CreateReviewFormData>({
    defaultValues: { star: 5, body: '', files: [] },
  });
  const selectedFiles = watch('files');

  const { data: reservation } = useSWR(`${API_URL}/reservations/${id}`, fetcherWithCookie);

  const { isMutating, trigger } = useSWRMutation(`${API_URL}/reviews`, posterWithCookie, {
    onSuccess: () => {
      window.alert('리뷰 수정하였습니다.');
      navigate('/cares');
    },
    onError: () => {
      window.alert('리뷰 작성에 실패했습니다. 다시 시도해 주세요.');
    },
  });

  // 파일 선택 Ref open
  const openFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      const totalFiles = selectedFiles.length + reviewImages.length + files.length;

      if (totalFiles <= 5) {
        console.log(newFiles);
        setValue('files', [...selectedFiles, ...newFiles]);
      } else {
        window.alert('최대 5개의 이미지를 선택할 수 있습니다.');
      }
    }
  };

  const handleRemoveInputImage = (indexToRemove: number) => {
    // 해당 인덱스의 이미지를 목록에서 제거
    setValue(
      'files',
      selectedFiles.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleRemoveReviewImage = (indexToRemove: number) => {
    setReviewImages(reviewImages.filter((_, index) => index !== indexToRemove));
  };

  const onSubmit = async (data: any) => {
    const { star, files, body } = data;

    const formData = new FormData();
    const createReviewData = {
      reservationId: reservation.id,
      star,
      body,
    };
    formData.append('data', JSON.stringify(createReviewData));

    if (files.length > 0) {
      files.forEach((file: File) => {
        formData.append('files', file);
      });
    }

    await trigger({ formData });
  };

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
            Array.from(selectedFiles as File[]).map((file, index) => (
              <ImgPreviewItem key={index}>
                <Img src={URL.createObjectURL(file)} alt={`Selected ${index}`} />
                <RemoveButton onClick={() => handleRemoveInputImage(index)}>
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

export const MainContainer = styled.main`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
  background-color: white;
  gap: 20px;
`;

export const Title = styled.h1`
  ${(props) => props.theme.fontSize.s18h27}
`;

export const Receipt = styled(Column)`
  padding: 20px;
  gap: 8px;
  border-radius: 20px;
  box-shadow: ${(props) => props.theme.shadow.dp03};
`;

export const PetsitterCard = styled(Row)`
  padding: 8px;
  border-radius: 16px;
  box-shadow: ${(props) => props.theme.shadow.dp03};
`;

export const PetsitterImage = styled(RoundedImageWrapper)`
  width: 60px;
  height: 60px;
`;

export const ReservationContainer = styled(Column)`
  gap: 8px;
`;

export const ReservationInfo = styled(Row)`
  justify-content: space-between;
`;

export const PetName = styled.div`
  display: flex;
  gap: 4px;
`;

export const PetSitterInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  div:nth-child(1) {
    ${(props) => props.theme.fontSize.s14h21}
    color:${(props) => props.theme.textColors.gray40}
  }

  dit:nth-child(2) {
    ${(props) => props.theme.fontSize.s16h24}
  }
`;

export const SecondLine = styled.div`
  display: flex;
  flex-direction: column;

  > div {
    text-align: right;
    color: ${(props) => props.theme.textColors.gray40};
    ${(props) => props.theme.fontSize.s14h21}
  }
`;

export const StarContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StarTitle = styled.div`
  ${(props) => props.theme.fontSize.s16h24}
`;

export const ImgContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const ImgPreview = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
`;

export const ImgPreviewItem = styled.div`
  position: relative;
  margin: 2px;
  padding: 4px;
`;

export const Img = styled.img`
  width: 100px;
  border-radius: 8px;
`;

export const ImgTitle = styled.div`
  ${(props) => props.theme.fontSize.s16h24}
`;

export const ImgSelectButton = styled.button`
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

export const ImgSelectWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  > div {
    ${({ theme }) => theme.fontSize.s12h18}
  }
`;

export const RemoveButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border: 1px solid ${(props) => props.theme.lineColors.coolGray80};
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.mainBlue};
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const TextTitle = styled.div`
  ${(props) => props.theme.fontSize.s16h24}
`;

export const TextArea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 8px;
  border-radius: 8px;
  font-family: inherit;
  ${(props) => props.theme.fontSize.s14h21}
`;

export const SubmitButton = styled.button`
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
