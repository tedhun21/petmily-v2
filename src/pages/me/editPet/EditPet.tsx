import { useState, useEffect, MouseEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { PiCatBold, PiDogBold } from 'react-icons/pi';

import UploadProfileImg from '../../../components/UploadProfileImg';

import {
  ButtonContainer,
  GenderRadioLabel,
  PetInput,
  InputContainer,
  InputLabel,
  InputWrapper,
  PetTextarea,
  RadioContainer,
  RadioWrapper,
  Section,
  SubmitButton,
  TitleContainer,
  TypeRadioLabel,
  UnitText,
  Container,
  FloatButtonContainer,
  GenderWrapper,
  Form,
} from '../register/CreatePet';
import { BottomFixed, ErrorMessage, Row, Texts20h30 } from 'styles/commonStyle';

import { FaXmark } from 'react-icons/fa6';
import styled from 'styled-components';
import { deleterWithCookie, fetcher, updaterWithCookie } from 'api';
import Loading from '@components/Loading';
import { toast } from 'react-toastify';
import { TbGenderFemale, TbGenderMale } from 'react-icons/tb';

const schema = yup.object().shape({
  species: yup.string().oneOf(['Dog', 'Cat'], '강아지인가요 고양이인가요?').required('이 항목은 필수입니다.'),
  name: yup.string().max(50, '이름은 최대 50자를 초과할 수 없습니다.').required('이 항목은 필수입니다.'),
  age: yup
    .number()
    .required('이 항목은 필수입니다.')
    .typeError('이 항목은 필수입니다.(정수만 가능)')
    .integer('나이는 정수로 입력해 주세요.')
    .min(1, '나이는 1살 이상이어야 합니다.')
    .max(100, '나이는 100살 이하이어야 합니다.'),
  breed: yup.string().max(50, '품종은 최대 50자를 초과할 수 없습니다.').required('이 항목은 필수입니다.'),
  weight: yup
    .number()
    .typeError('몸무게는 숫자만 입력해 주세요.')
    .min(1, '몸무게는 1kg 이상이어야 합니다.')
    .max(100, '몸무게는 100kg 이하이어야 합니다.')
    .required('이 항목은 필수입니다.'),
  gender: yup.string().oneOf(['Male', 'Female'], '성별을 선택해주세요.').required('이 항목은 필수입니다.'),
  neutering: yup.boolean().required('이 항목은 필수입니다.'),
  body: yup.string().max(1000, '소개는 최대 1000자를 초과할 수 없습니다.').nullable(),
});

type IEditPet = yup.InferType<typeof schema>;

const API_URL = process.env.REACT_APP_API_URL;

export default function EditPet() {
  const navigate = useNavigate();

  const { petId } = useParams();
  const [previewImage, setPreviewImage] = useState<File | null>(null);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IEditPet>({
    resolver: yupResolver(schema),
  });

  const { data: pet } = useSWR(`${API_URL}/pets/${petId}`, fetcher);

  const { trigger: updateTrigger, isMutating } = useSWRMutation(`${API_URL}/pets/${petId}`, updaterWithCookie, {
    onSuccess: () => {
      navigate('/me');
      toast.success('수정이 완료되었습니다!');
    },
    onError: () => {
      toast.error('수정 실패하였습니다. 다시 시도해 주세요.');
    },
  });

  const { trigger: deleteTrigger } = useSWRMutation(`${API_URL}/pets/${petId}`, deleterWithCookie, {
    onSuccess: () => {
      navigate('/me');
      toast.success('펫 정보가 삭제되었습니다!');
    },
    onError: () => {
      toast.error('펫 정보 삭제에 실패했습니다. 다시 시도해주세요.');
    },
  });

  // handle pet type radio
  const handlePetType = (e: MouseEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value as 'Dog' | 'Cat'; // 타입 캐스팅
    setValue('species', value);
  };

  // 펫 수정
  const onSubmit = async (data: IEditPet) => {
    const formData = new FormData();

    formData.append('data', JSON.stringify(data));

    if (previewImage) {
      formData.append('file', previewImage);
    }

    await updateTrigger({ formData });
  };

  // 펫 삭제
  const handleDeletePet = async () => {
    const isConfirmed = window.confirm('정말 펫을 삭제하시겠습니까?');
    if (!isConfirmed) return;
    else {
      await deleteTrigger();
    }
  };

  // 펫 정보 가져와서 input 기본값 설정 (react hook form)
  useEffect(() => {
    if (pet) {
      setValue('species', pet.species);
      setValue('name', pet.name);
      setValue('age', pet.age);
      setValue('neutering', pet.neutering);
      setValue('breed', pet.breed);
      setValue('weight', pet.weight);
      setValue('gender', pet.gender);
      setValue('body', pet.body);
    }
  }, [pet]);

  return (
    <main>
      <EditTitleContainer>
        <Texts20h30>나의 Petmily 수정</Texts20h30>
        <button type="button" onClick={handleDeletePet}>
          <FaXmark size="28px" color="#279EFF" />
        </button>
      </EditTitleContainer>
      <Section>
        <UploadProfileImg
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          defaultImage={watch('species') === 'Dog' ? '/imgs/DogProfile.png' : '/imgs/CatProfile.png'}
        />
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Container>
            {/* 타입 */}
            <ButtonContainer>
              <TypeRadioLabel $isSelected={watch('species') === 'Dog'}>
                <input hidden type="radio" value="Dog" {...register('species')} onClick={handlePetType} />
                <PiDogBold size="20px" color="white" />
              </TypeRadioLabel>
              <TypeRadioLabel $isSelected={watch('species') === 'Cat'}>
                <input hidden type="radio" value="Cat" {...register('species')} onClick={handlePetType} />
                <PiCatBold size="20px" color="white" />
              </TypeRadioLabel>
            </ButtonContainer>
            {errors.species && <ErrorMessage>{errors.species.message}</ErrorMessage>}

            {/* 이름 */}
            <InputContainer>
              <InputLabel htmlFor="name">이름</InputLabel>
              <InputWrapper>
                <PetInput type="text" placeholder="e.g. 도기" {...register('name')} />
                {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
              </InputWrapper>
            </InputContainer>

            {/* 성별 */}
            <InputContainer>
              <InputLabel>성별</InputLabel>
              <RadioContainer>
                <RadioWrapper>
                  <input type="radio" value="Male" {...register('gender')} />
                  <GenderWrapper>
                    <TbGenderMale />
                    <GenderRadioLabel htmlFor="Male">남자 아이</GenderRadioLabel>
                  </GenderWrapper>
                </RadioWrapper>
                <RadioWrapper>
                  <input type="radio" value="Female" {...register('gender')} />
                  <GenderWrapper>
                    <TbGenderFemale />
                    <GenderRadioLabel htmlFor="Female">여자 아이</GenderRadioLabel>
                  </GenderWrapper>
                </RadioWrapper>
              </RadioContainer>
            </InputContainer>

            {/* 중성화 */}
            <InputContainer>
              <InputLabel>중성화</InputLabel>
              <input type="checkbox" {...register('neutering')} />
            </InputContainer>

            {/* 품종 */}
            <InputContainer>
              <InputLabel>품종</InputLabel>
              <InputWrapper>
                <PetInput type="text" placeholder="e.g. 골든 리트리버 or 샴" {...register('breed')} />
                {errors.breed && <ErrorMessage>{errors.breed.message}</ErrorMessage>}
              </InputWrapper>
            </InputContainer>

            <InputContainer>
              <InputLabel>나이</InputLabel>
              <InputWrapper>
                <Row>
                  <PetInput type="number" min={0} placeholder="e.g. 5" {...register('age')} />
                  <UnitText>살</UnitText>
                </Row>
                {errors.age && <ErrorMessage>{errors.age.message}</ErrorMessage>}
              </InputWrapper>
            </InputContainer>

            <InputContainer>
              <InputLabel>몸무게</InputLabel>
              <InputWrapper>
                <Row>
                  <PetInput type="number" placeholder="e.g. 10" min={0} step={0.1} {...register('weight')} />
                  <UnitText>kg</UnitText>
                </Row>
                {errors.weight && <ErrorMessage>{errors.weight.message}</ErrorMessage>}
              </InputWrapper>
            </InputContainer>

            <InputContainer>
              <InputLabel>펫 소개</InputLabel>
              <PetTextarea rows={5} {...register('body')} />
            </InputContainer>
          </Container>

          <BottomFixed>
            <FloatButtonContainer>
              <SubmitButton type="submit" disabled={isMutating}>
                {isMutating ? <Loading /> : <span>펫 수정하기</span>}
              </SubmitButton>
            </FloatButtonContainer>
          </BottomFixed>
        </Form>
      </Section>
    </main>
  );
}

const EditTitleContainer = styled(TitleContainer)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
