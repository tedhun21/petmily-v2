import { useState, useEffect, MouseEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAuthSWR, useAuthSWRMutation } from 'hooks/authSWR';

import { PiCatBold, PiDogBold } from 'react-icons/pi';

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
  TypeRadioLabel,
} from '../../register/page';

import { fetcher, updater, deleter } from 'api';
import Loading from '@components/Loading';
import { toast } from 'react-toastify';
import { TbGenderFemale, TbGenderMale } from 'react-icons/tb';
import BackHeader from '@components/headers/BackHeader';
import { FaXmark } from 'react-icons/fa6';
import EditableProfileImage from '@components/EditableProfileImage';
import { PetGender, PetSpecies } from 'types/pet.type';
import { Button } from '@components/buttons/Button';

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
  body: yup.string().max(1000, '소개는 최대 1000자를 초과할 수 없습니다.').nullable(),
});

type IEditPet = yup.InferType<typeof schema>;

export default function EditPetPage() {
  const navigate = useNavigate();

  const { id } = useParams();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [serverImageUrl, setServerImageUrl] = useState<string | null>(null);
  const [deletePhoto, setDeletePhoto] = useState<string | null>(null);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<IEditPet>({
    resolver: yupResolver(schema),
  });

  const { data: pet } = useAuthSWR(`/pets/${id}`, fetcher);

  const { trigger: updateTrigger, isMutating } = useAuthSWRMutation(`/pets/${id}`, updater, {
    onSuccess: () => {
      navigate('/me');
      toast.success('수정이 완료되었습니다!');
    },
    onError: () => {
      toast.error('수정 실패하였습니다. 다시 시도해 주세요.');
    },
  });

  const { trigger: deleteTrigger } = useAuthSWRMutation(`/pets/${id}`, deleter, {
    onSuccess: () => {
      navigate('/me');
      toast.success('펫 정보가 삭제되었습니다!');
    },
    onError: () => {
      toast.error('펫 정보 삭제에 실패했습니다. 다시 시도해주세요.');
    },
  });

  const handlePetSpecies = (e: MouseEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value as PetSpecies; // 타입 캐스팅
    setValue('species', value);
  };

  // 펫 수정
  const onSubmit = async (data: IEditPet) => {
    const formData = new FormData();

    const updatedData = {
      ...data,
      ...(deletePhoto ? { deletePhoto } : {}),
    };

    formData.append('data', JSON.stringify(updatedData));

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
      setServerImageUrl(pet?.photo);
    }
  }, [pet]);

  return (
    <Main>
      <BackHeader title="나의 펫밀리 수정" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="button" onClick={handleDeletePet} $variant="icon" $borderRadius="circle">
              <FaXmark size="28px" />
            </Button>
          </div>
          <EditableProfileImage
            setImageFile={setImageFile}
            serverImageUrl={serverImageUrl}
            setServerImageUrl={setServerImageUrl}
            setDeletePhoto={setDeletePhoto}
            defaultImage={watch('species') === PetSpecies.DOG ? '/imgs/DogProfile.png' : '/imgs/CatProfile.png'}
          />

          {/* 펫타입 */}
          <InputWrapper>
            <PetSpeciesButtonContainer>
              <TypeRadioLabel $isSelected={watch('species') === PetSpecies.DOG}>
                <input
                  id="dog"
                  type="radio"
                  value={PetSpecies.DOG}
                  {...register('species')}
                  onClick={handlePetSpecies}
                  hidden
                />
                <PiDogBold size="20px" color="white" />
              </TypeRadioLabel>
              <TypeRadioLabel $isSelected={watch('species') === PetSpecies.CAT}>
                <input
                  id="cat"
                  type="radio"
                  value={PetSpecies.CAT}
                  {...register('species')}
                  onClick={handlePetSpecies}
                  hidden
                />
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
                <input id="male" type="radio" value={PetGender.MALE} {...register('gender')} />
                <label htmlFor="male">
                  <TbGenderMale size="32px" />
                </label>
              </GenderWrapper>
              <GenderWrapper>
                <input id="female" type="radio" value={PetGender.FEMALE} {...register('gender')} />
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
          <Button type="submit" disabled={isMutating} $variant="primary" $size="lg" $fullWidth>
            {isMutating ? <Loading /> : <span>펫 수정</span>}
          </Button>
        </ButtonContainer>
      </Form>
    </Main>
  );
}
