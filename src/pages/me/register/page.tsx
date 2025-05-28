import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from 'styled-components';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { PiCatBold, PiDogBold } from 'react-icons/pi';

import { BlueButton, Column, Input, Row } from 'styles/commonStyle';

import useSWRMutation from 'swr/mutation';
import { posterWithCookie } from 'api';
import Loading from '@components/Loading';
import { toast } from 'react-toastify';

import { TbGenderFemale, TbGenderMale } from 'react-icons/tb';
import BackHeader from '@components/headers/BackHeader';
import EditableProfileImage from '@components/EditableProfileImage';
import { PetGender, PetSpecies } from 'types/pet.type';
import { API_URL } from 'config';

const schema = yup.object().shape({
  species: yup.string().oneOf(['dog', 'cat'], '강아지인가요 고양이인가요?').required('이 항목은 필수입니다.'),
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
  gender: yup.string().oneOf(['male', 'female'], '성별을 선택해주세요.').required('이 항목은 필수입니다.'),
  neutering: yup.boolean().required('이 항목은 필수입니다.'),
  body: yup.string().max(1000, '소개는 최대 1000자를 초과할 수 없습니다.'),
});

type IRegisterPet = yup.InferType<typeof schema>;

export default function CreatePetPage() {
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<IRegisterPet>({
    resolver: yupResolver(schema),
    defaultValues: {
      species: PetSpecies.DOG, // 기본값을 강아지로 설정
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

  const handlePetSpecies = (e: MouseEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value as PetSpecies; // 타입 캐스팅
    setValue('species', value);
  };

  // 제출 onSubmit
  const onSubmit = async (data: IRegisterPet) => {
    const formData = new FormData();

    formData.append('data', JSON.stringify(data));

    if (imageFile) {
      formData.append('file', imageFile);
    }

    await trigger({ formData });
  };

  return (
    <Main>
      <BackHeader title="나의 펫밀리 등록" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <EditableProfileImage
            setImageFile={setImageFile}
            defaultImage={watch('species') === PetSpecies.DOG ? '/imgs/DogProfile.png' : '/imgs/CatProfile.png'}
          />
          {/* 펫 타입 */}
          <InputWrapper>
            <PetSpeciesButtonContainer>
              <TypeRadioLabel $isSelected={watch('species') === PetSpecies.DOG}>
                <input hidden type="radio" value={PetSpecies.DOG} {...register('species')} onClick={handlePetSpecies} />
                <PiDogBold size="20px" color="white" />
              </TypeRadioLabel>
              <TypeRadioLabel $isSelected={watch('species') === PetSpecies.CAT}>
                <input hidden type="radio" value={PetSpecies.CAT} {...register('species')} onClick={handlePetSpecies} />
                <PiCatBold size="20px" color="white" />
              </TypeRadioLabel>
            </PetSpeciesButtonContainer>
          </InputWrapper>

          {/* 이름 */}
          <InputWrapper>
            <InputLabel htmlFor="name">이름</InputLabel>
            <PetInput type="text" placeholder="e.g. 도기" />
          </InputWrapper>

          {/* 성별 */}
          <InputWrapper>
            <InputLabel htmlFor="gender">성별</InputLabel>
            <RadioContainer>
              <GenderWrapper>
                <input type="radio" value={PetGender.MALE} {...register('gender')} />
                <TbGenderMale size="32px" />
              </GenderWrapper>
              <GenderWrapper>
                <input type="radio" value={PetGender.FEMALE} {...register('gender')} />
                <TbGenderFemale size="32px" />
              </GenderWrapper>
            </RadioContainer>
          </InputWrapper>

          {/* 중성화 */}
          <InputWrapper>
            <InputLabel htmlFor="neutering">중성화</InputLabel>
            <input type="checkbox" {...register('neutering')} />
          </InputWrapper>

          {/* 품종 */}
          <InputWrapper>
            <InputLabel htmlFor="breed">품종</InputLabel>
            <InputError>
              <PetInput type="text" placeholder="e.g. 골든 리트리버, 샴" {...register('breed')} />
            </InputError>
          </InputWrapper>

          {/* 나이 */}
          <InputWrapper>
            <InputLabel htmlFor="age">나이</InputLabel>

            <RowWrapper>
              <PetInput type="number" {...register('age')} />
              <span>살</span>
            </RowWrapper>
          </InputWrapper>

          {/* 몸무게 */}
          <InputWrapper>
            <InputLabel htmlFor="weight">몸무게</InputLabel>
            <RowWrapper>
              <PetInput type="number" {...register('weight')} />
              <span>kg</span>
            </RowWrapper>
          </InputWrapper>

          {/* 펫소개 */}
          <InputWrapper>
            <InputLabel htmlFor="body">소개</InputLabel>
            <PetTextarea rows={5} {...register('body')} />
          </InputWrapper>
        </InputContainer>
        <ButtonContainer>
          <SubmitButton type="submit" disabled={isMutating}>
            {isMutating ? <Loading /> : <span>펫 등록하기</span>}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </Main>
  );
}

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

export const Form = styled.form`
  flex: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const InputContainer = styled(Column)`
  flex: auto;
  overflow-y: auto;
  padding: 20px;
  gap: 20px;
  height: 100%;
`;

export const InputWrapper = styled(Row)`
  align-items: center;
  width: 100%;
`;

export const PetSpeciesButtonContainer = styled.div`
  display: flex;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.normal};
  overflow: hidden;
`;

export const TypeRadioLabel = styled.label<{ $isSelected?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 8px;
  cursor: pointer;
  background-color: ${({ theme, $isSelected }) => ($isSelected ? theme.background.highlight : theme.text.inactive)};

  /* Adding transition for smooth effect */
  transition:
    background-color 0.3s ease-in-out,
    transform 0.3s ease-in-out;

  &:hover {
    background-color: ${({ theme, $isSelected }) => ($isSelected ? '' : theme.background.box.blue.hover)};
  }
`;

export const InputLabel = styled.label`
  width: 20%;
`;

const InputError = styled(Column)`
  width: 100%;
`;

export const PetInput = styled(Input)`
  width: 100%;
  padding: 8px;
  ${({ theme }) => theme.fontSize.s16h24};
  border-radius: ${({ theme }) => theme.radius.normal};
`;

export const RadioContainer = styled(Row)`
  justify-content: space-around;
  flex: auto;
  gap: 4px;
`;

export const GenderRadioLabel = styled.label`
  ${({ theme }) => theme.fontSize.s14h21}
`;

export const GenderWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PetTextarea = styled.textarea`
  flex: auto;
  width: 100%;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.line.input.primary};
  border-radius: ${({ theme }) => theme.radius.normal};
  color: inherit;
  background-color: ${({ theme }) => theme.background.input.primary};
`;

export const RowWrapper = styled(Row)`
  width: 100%;
  align-items: center;
  gap: 8px;
`;

export const ButtonContainer = styled.div`
  flex: 1;
  padding: 20px;
`;

export const SubmitButton = styled(BlueButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  ${({ theme }) => theme.fontSize.s18h27};
`;
