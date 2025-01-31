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
  Form,
  GenderWrapper,
  InputContainer,
  InputLabel,
  InputWrapper,
  Main,
  PetInput,
  PetSpeciesButtonContainer,
  PetTextarea,
  RadioContainer,
  RowWrapper,
  SubmitButton,
  TypeRadioLabel,
} from '../register/CreatePet';

import { deleterWithCookie, fetcher, updaterWithCookie } from 'api';
import Loading from '@components/Loading';
import { toast } from 'react-toastify';
import { TbGenderFemale, TbGenderMale } from 'react-icons/tb';
import BackHeader from '@components/headers/BackHeader';
import { FaXmark } from 'react-icons/fa6';

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [serverImageUrl, setServerImageUrl] = useState<string | null>(null);

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

  const handlePetSpecies = (e: MouseEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value as 'Dog' | 'Cat'; // 타입 캐스팅
    setValue('species', value);
  };

  // 펫 수정
  const onSubmit = async (data: IEditPet) => {
    console.log(data);
    const formData = new FormData();

    formData.append('data', JSON.stringify(data));

    if (imageFile) {
      formData.append('file', imageFile);
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
      setServerImageUrl(pet.photo);
    }
  }, [pet]);

  return (
    <Main>
      <BackHeader title="나의 펫밀리 수정" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="button" onClick={handleDeletePet}>
              <FaXmark size="24px" />
            </button>
          </div>
          <UploadProfileImg
            setImageFile={setImageFile}
            defaultImage={watch('species') === 'Dog' ? '/imgs/DogProfile.png' : '/imgs/CatProfile.png'}
            serverImageUrl={serverImageUrl}
            setServerImageUrl={setServerImageUrl}
          />

          {/* 펫타입 */}
          <InputWrapper>
            <PetSpeciesButtonContainer>
              <TypeRadioLabel $isSelected={watch('species') === 'Dog'}>
                <input id="dog" type="radio" value="Dog" {...register('species')} onClick={handlePetSpecies} hidden />
                <PiDogBold size="20px" color="white" />
              </TypeRadioLabel>
              <TypeRadioLabel $isSelected={watch('species') === 'Cat'}>
                <input id="cat" type="radio" value="Cat" {...register('species')} onClick={handlePetSpecies} hidden />
                <PiCatBold size="20px" color="white" />
              </TypeRadioLabel>
            </PetSpeciesButtonContainer>
          </InputWrapper>

          {/* 이름 */}
          <InputWrapper>
            <InputLabel htmlFor="name">이름</InputLabel>
            <PetInput id="name" type="text" placeholder="e.g. 도기" {...register('name')} />
          </InputWrapper>

          {/* 성별 */}
          <InputWrapper>
            <InputLabel>성별</InputLabel>
            <RadioContainer>
              <GenderWrapper>
                <input id="male" type="radio" value="Male" {...register('gender')} />
                <label htmlFor="male">
                  <TbGenderMale size="32px" />
                </label>
              </GenderWrapper>
              <GenderWrapper>
                <input id="female" type="radio" value="Female" {...register('gender')} />
                <label htmlFor="female">
                  <TbGenderFemale size="32px" />
                </label>
              </GenderWrapper>
            </RadioContainer>
          </InputWrapper>

          {/* 중성화 */}
          <InputWrapper>
            <InputLabel htmlFor="neutering">중성화</InputLabel>
            <input id="neutering" type="checkbox" {...register('neutering')} />
          </InputWrapper>

          {/* 품종 */}
          <InputWrapper>
            <InputLabel htmlFor="breed">품종</InputLabel>
            <PetInput id="breed" type="text" placeholder="e.g. 골든 리트리버, 샴" {...register('breed')} />
          </InputWrapper>

          {/* 나이 */}
          <InputWrapper>
            <InputLabel htmlFor="age">나이</InputLabel>
            <RowWrapper>
              <PetInput id="age" type="number" {...register('age')} />
              <span>살</span>
            </RowWrapper>
          </InputWrapper>

          {/* 몸무게 */}
          <InputWrapper>
            <InputLabel htmlFor="weight">몸무게</InputLabel>
            <RowWrapper>
              <PetInput id="weight" type="number" {...register('weight')} />
              <span>kg</span>
            </RowWrapper>
          </InputWrapper>

          {/* 펫소개 */}
          <InputWrapper>
            <InputLabel htmlFor="body">소개</InputLabel>
            <PetTextarea id="body" rows={5} {...register('body')} />
          </InputWrapper>
        </InputContainer>

        <ButtonContainer>
          <SubmitButton type="submit" disabled={isMutating}>
            {isMutating ? <Loading /> : <span>펫 수정하기</span>}
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </Main>
  );
}
