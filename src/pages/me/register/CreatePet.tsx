import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { PiCatBold, PiDogBold } from 'react-icons/pi';

import UploadProfileImg from '@components/UploadProfileImg';
import { Column, ErrorMessage, Row, Texts20h30 } from 'commonStyle';

import useSWRMutation from 'swr/mutation';
import { posterWithCookie } from 'api';
import Loading from '@components/Loading';
import { toast } from 'react-toastify';

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
  body: yup.string().max(1000, '소개는 최대 1000자를 초과할 수 없습니다.'),
});

type IRegisterPet = yup.InferType<typeof schema>;

const API_URL = process.env.REACT_APP_API_URL;

export default function CreatePet() {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<IRegisterPet>({
    resolver: yupResolver(schema),
    defaultValues: {
      species: 'Dog',
    },
  });

  const { trigger, isMutating } = useSWRMutation(`${API_URL}/pets`, posterWithCookie, {
    onSuccess: () => {
      navigate('/me');
      toast.success('펫밀리 등록이 완료되었습니다!');
    },
    onError: () => {
      toast.error('펫밀리 등록에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handlePetType = (e: MouseEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value as 'Dog' | 'Cat'; // 타입 캐스팅
    setValue('species', value);
  };

  // 제출 onSubmit
  const onSubmit = async (data: IRegisterPet) => {
    const formData = new FormData();

    formData.append('data', JSON.stringify(data));

    if (previewImage) {
      formData.append('file', previewImage);
    }

    await trigger({ formData });
  };

  return (
    <main>
      <TitleContainer>
        <Texts20h30>나의 Petmily 등록</Texts20h30>
      </TitleContainer>
      <SectionContainer>
        <UploadProfileImg
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          defaultImage={watch('species') === 'Dog' ? '/imgs/DogProfile.png' : '/imgs/CatProfile.png'}
        />
        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          {/* 타입 */}
          <ButtonContainer>
            <TypeRadioLabel isSelected={watch('species') === 'Dog'}>
              <input hidden type="radio" value="Dog" {...register('species')} onClick={handlePetType} />
              <PiDogBold size="20px" color="white" />
            </TypeRadioLabel>
            <TypeRadioLabel isSelected={watch('species') === 'Cat'}>
              <input hidden type="radio" value="Cat" {...register('species')} onClick={handlePetType} />
              <PiCatBold size="20px" color="white" />
            </TypeRadioLabel>
          </ButtonContainer>
          {errors.species && <ErrorMessage>{errors.species.message}</ErrorMessage>}

          {/* 이름 */}
          <InputContainer>
            <InputLabel htmlFor="name">이름</InputLabel>
            <InputWrapper>
              <Input type="text" placeholder="e.g. 도기" {...register('name')} />
              {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
            </InputWrapper>
          </InputContainer>

          {/* 성별 */}
          <InputContainer>
            <InputLabel>성별</InputLabel>
            <RadioContainer>
              <RadioWrapper>
                <input type="radio" value="Male" {...register('gender')} />
                <GenderRadioLabel htmlFor="Male">남자 아이</GenderRadioLabel>
              </RadioWrapper>
              <RadioWrapper>
                <input type="radio" value="Female" {...register('gender')} />
                <GenderRadioLabel htmlFor="Female">여자 아이</GenderRadioLabel>
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
              <Input type="text" placeholder="e.g. 골든 리트리버 or 샴" {...register('breed')} />
              {errors.breed && <ErrorMessage>{errors.breed.message}</ErrorMessage>}
            </InputWrapper>
          </InputContainer>

          <InputContainer>
            <InputLabel>나이</InputLabel>
            <InputWrapper>
              <Row>
                <Input type="number" min={0} placeholder="e.g. 5" {...register('age')} />
                <UnitText>살</UnitText>
              </Row>
              {errors.age && <ErrorMessage>{errors.age.message}</ErrorMessage>}
            </InputWrapper>
          </InputContainer>

          <InputContainer>
            <InputLabel>몸무게</InputLabel>
            <InputWrapper>
              <Row>
                <Input type="number" placeholder="e.g. 10" min={0} step={0.1} {...register('weight')} />
                <UnitText>kg</UnitText>
              </Row>
              {errors.weight && <ErrorMessage>{errors.weight.message}</ErrorMessage>}
            </InputWrapper>
          </InputContainer>

          <InputContainer>
            <InputLabel>펫 소개</InputLabel>
            <PetTextarea rows={5} {...register('body')} />
          </InputContainer>
          <SubmitButton type="submit" disabled={isMutating}>
            {isMutating ? <Loading /> : <span>펫 등록하기</span>}
          </SubmitButton>
        </FormContainer>
      </SectionContainer>
    </main>
  );
}
export const TitleContainer = styled.div`
  padding: 20px;
`;

export const SectionContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding: 20px;
  background-color: white;
`;

export const ButtonContainer = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  border-radius: 8px;
`;

export const TypeRadioLabel = styled.label<{ isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 8px;
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? props.theme.colors.mainBlue : props.theme.textColors.gray50)};

  /* Adding transition for smooth effect */
  transition:
    background-color 0.3s ease-in-out,
    transform 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.isSelected ? '' : props.theme.colors.skyBlue)};
  }
`;

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 24px;
`;

export const RegisterInputWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
`;

export const InputLabel = styled.label`
  width: 20%;
  ${(props) => props.theme.fontSize.s16h24};
  white-space: nowrap;
`;

export const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.textColors.gray60};
  border-radius: 8px;
`;

export const InputContainer = styled.div`
  display: flex;
  width: 100%;
`;

export const InputWrapper = styled(Column)`
  flex: auto;
  width: 100%;
`;

const RadioLabel = styled.label`
  ${(props) => props.theme.fontSize.s14h21};
  margin-left: 8px;
  color: ${({ theme }) => theme.textColors.gray60};

  input:checked + & {
    color: #279eff;
  }
`;

export const RadioContainer = styled(Row)`
  justify-content: space-around;
  flex: auto;
  gap: 4px;
`;

export const RadioWrapper = styled(Row)`
  gap: 8px;
`;

export const GenderRadioLabel = styled.label`
  ${(props) => props.theme.fontSize.s14h21}
`;

export const UnitText = styled.span`
  padding: 8px;
`;

export const PetTextarea = styled.textarea`
  flex: auto;
  width: 100%;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.textColors.gray60};
  border-radius: 8px;
`;

export const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.mainBlue};
  cursor: pointer;
  color: white;
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  ${(props) => props.theme.fontSize.s18h27};

  &:hover {
    background-color: ${({ theme }) => theme.colors.subBlue};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;