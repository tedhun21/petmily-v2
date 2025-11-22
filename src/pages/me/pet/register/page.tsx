import { MouseEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styled from '@emotion/styled';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { PiCatBold, PiDogBold } from 'react-icons/pi';

import useSWRMutation from 'swr/mutation';
import Loading from '@components/Loading';
import { toast } from 'react-toastify';

import { TbGenderFemale, TbGenderMale } from 'react-icons/tb';
import BackHeader from '@components/headers/BackHeader';
import EditableProfileImage from '@components/EditableProfileImage';
import { PetGender, PetSpecies } from '@/types/pet.type';
import { poster } from '@/api';
import { Button } from '@/components/styled/Button';
import { Input } from '@components/styled/Input';
import Flex from '@components/styled/Flex';

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

  const { trigger, isMutating } = useSWRMutation('/pets', poster, {
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

    await trigger(formData);
  };

  return (
    <>
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
            <Input type="text" placeholder="e.g. 도기" />
          </InputWrapper>

          {/* 성별 */}
          <InputWrapper>
            <InputLabel htmlFor="gender">성별</InputLabel>
            <RadioContainer>
              <Flex alignItems="center" gap="sm">
                <input type="radio" value={PetGender.MALE} {...register('gender')} />
                <TbGenderMale size="32px" />
              </Flex>
              <Flex alignItems="center" gap="sm">
                <input type="radio" value={PetGender.FEMALE} {...register('gender')} />
                <TbGenderFemale size="32px" />
              </Flex>
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
              <Input type="text" placeholder="e.g. 골든 리트리버, 샴" {...register('breed')} />
            </InputError>
          </InputWrapper>

          {/* 나이 */}
          <InputWrapper>
            <InputLabel htmlFor="age">나이</InputLabel>

            <Flex alignItems="center" gap="sm">
              <Input type="number" {...register('age')} />
              <span>살</span>
            </Flex>
          </InputWrapper>

          {/* 몸무게 */}
          <InputWrapper>
            <InputLabel htmlFor="weight">몸무게</InputLabel>
            <Flex alignItems="center" gap="sm">
              <Input type="number" {...register('weight')} />
              <span>kg</span>
            </Flex>
          </InputWrapper>

          {/* 펫소개 */}
          <InputWrapper>
            <InputLabel htmlFor="body">소개</InputLabel>
            <PetTextarea rows={5} {...register('body')} />
          </InputWrapper>
        </InputContainer>
        <ButtonContainer>
          <Button type="submit" disabled={isMutating} variant="primary" size="lg" fullWidth>
            {isMutating ? <Loading /> : <span>펫 등록하기</span>}
          </Button>
        </ButtonContainer>
      </Form>
    </>
  );
}

// TODO: all

export const Form = styled.form`
  display: flex;
  flex: auto;
  flex-direction: column;
  overflow: hidden;
  height: 100%;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;
  overflow-y: auto;
  height: 100%;
  padding: ${({ theme }) => theme.spacing.xl};
  gap: ${({ theme }) => theme.spacing.xl};
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const PetSpeciesButtonContainer = styled.div`
  display: flex;
  overflow: hidden;
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.md};
`;

export const TypeRadioLabel = styled.label<{ $isSelected?: boolean }>`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.background.highlight : theme.colors.text.inactive};

  /* Adding transition for smooth effect */
  transition:
    background-color 0.3s ease-in-out,
    transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme, $isSelected }) => ($isSelected ? '' : theme.colors.background.box.accent.hover)};
  }
`;

export const InputLabel = styled.label`
  width: 20%;
`;

const InputError = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const RadioContainer = styled.div`
  display: flex;
  flex: auto;
  justify-content: space-around;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const GenderRadioLabel = styled.label`
  ${({ theme }) => theme.typeScale.sm};
`;

export const PetTextarea = styled.textarea`
  flex: auto;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.input.primary};
  border: 1px solid ${({ theme }) => theme.colors.line.input.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  color: inherit;
`;

export const ButtonContainer = styled.div`
  flex: 1;
  background-color: transparent;
  padding: ${({ theme }) => theme.spacing.xl};
`;
