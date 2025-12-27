import { useEffect, useRef, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import { TbGenderFemale, TbGenderMale } from 'react-icons/tb';
import { FaXmark } from 'react-icons/fa6';

import { useAuthSWR, useAuthSWRMutation } from '@/hooks/authSWR';
import { PiCatBold, PiDogBold } from 'react-icons/pi';
import {
  Absolute,
  InputError,
  InputLabel,
  InputWrapper,
  NeuteringButton,
  PetImageWrapper,
  PetTextarea,
  TypeRadioLabel,
} from '../../register/page';

import { fetcher, deleter, multipartUpdater } from '@/api';
import { PetGender, PetSpecies, type PetSpeciesType } from '@/types/pet.type';
import { Input } from '@/components/styled/Input';
import Flex from '@/components/styled/Flex';
import { ImageCentered } from '@/styles/commonStyle';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import Box from '@/components/styled/Box';
import { colors } from '@/styles/colors';
import Text from '@/components/styled/Text';
import Button from '@/components/styled/Button';
import FixedBottom from '@/components/FixedBottom';
import Header from '@/components/headers/Header';
import BackButton from '@/components/buttons/BackButton';
import { FiTrash2 } from 'react-icons/fi';
import ConfirmModal from '@/components/ConfirmModal';

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
  photo: yup.mixed<File | string>().nullable(),
  deletePhoto: yup.string(),
});

export default function EditPetPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  const {
    register,
    getValues,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const species = useWatch({ control, name: 'species', defaultValue: PetSpecies.DOG });
  const neutering = useWatch({ control, name: 'neutering', defaultValue: false });
  const photo = useWatch({ control, name: 'photo', defaultValue: null });
  const deletePhoto = useWatch({ control, name: 'deletePhoto' });

  const { data: pet } = useAuthSWR(`/pets/${id}`, fetcher);

  const { trigger: updateTrigger, isMutating } = useAuthSWRMutation(`/pets/${id}`, multipartUpdater, {
    onSuccess: () => {
      navigate('/me');
      toast.success('수정 완료했어요');
    },
    onError: () => {
      toast.error('수정 실패했어요. 다시 시도해 주세요.');
    },
  });

  const { trigger: deleteTrigger } = useAuthSWRMutation(`/pets/${id}`, deleter, {
    onSuccess: () => {
      navigate('/me');
      toast.success('펫 정보를 삭제 했어요');
    },
    onError: () => {
      toast.error('펫 정보 삭제에 실패했어요. 다시 시도해주세요.');
    },
  });

  const previewURL = useMemo(() => {
    if (deletePhoto) {
      return null;
    }

    if (photo instanceof File) {
      return URL.createObjectURL(photo);
    }

    return typeof photo === 'string' ? photo : null;
  }, [photo, deletePhoto]);

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setValue('deletePhoto', undefined);
      setValue('photo', file);
    }
  };

  const handleDeletePhoto = () => {
    const currentPhoto = getValues('photo');

    if (currentPhoto) {
      if (typeof currentPhoto === 'string') {
        setValue('deletePhoto', currentPhoto);
      } else if (currentPhoto instanceof File) {
        setValue('photo', null);
      }
    }
  };

  const handlePetSpecies = (e: React.MouseEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value as PetSpeciesType;
    setValue('species', value);
  };

  const onConfirmDelete = async () => {
    await deleteTrigger();
  };

  const onSubmit = async (data: any) => {
    const { photo, ...rest } = data;

    const formData = new FormData();

    formData.append('data', JSON.stringify(rest));

    if (photo && photo instanceof File) {
      formData.append('file', photo);
    }

    await updateTrigger(formData);
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
      setValue('photo', pet?.photo);
    }
  }, [pet]);

  return (
    <>
      <Header
        left={<BackButton />}
        center={<Text size="lg">나의 펫밀리 수정</Text>}
        right={
          <IconButton type="button" onClick={() => setDeleteModalOpen(true)}>
            <FiTrash2 size="20px" />
          </IconButton>
        }
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={onConfirmDelete}
        title="펫 삭제"
      >
        정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
      </ConfirmModal>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* 사진 선택 */}
        <Box p={40}>
          <Flex direction="column" alignItems="center" gap="md">
            <div css={{ position: 'relative' }}>
              <PetImageWrapper>
                <ImageCentered
                  src={
                    previewURL
                      ? previewURL
                      : species === PetSpecies.DOG
                        ? '/imgs/DogProfile.png'
                        : species === PetSpecies.CAT
                          ? '/imgs/CatProfile.png'
                          : undefined
                  }
                  alt="pet_photo"
                />
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  hidden
                />
              </PetImageWrapper>
              {previewURL && (
                <Absolute>
                  <IconButton type="button" onClick={handleDeletePhoto} variant="fill" bgColor={colors.red400}>
                    <FaXmark size="16px" color="white" />
                  </IconButton>
                </Absolute>
              )}
            </div>

            <Button type="button" onClick={handleUploadButtonClick}>
              프로필 사진 선택
            </Button>
          </Flex>
        </Box>

        <Box p="lg">
          <Flex direction="column" gap="xl">
            {/* 펫 타입 */}
            <Box w="100%" br="lg" css={{ overflow: 'hidden' }}>
              <Flex>
                <TypeRadioLabel $isSelected={species === PetSpecies.DOG}>
                  <input
                    hidden
                    type="radio"
                    value={PetSpecies.DOG}
                    {...register('species')}
                    onClick={handlePetSpecies}
                  />
                  <PiDogBold size="24px" color="white" />
                </TypeRadioLabel>
                <TypeRadioLabel $isSelected={species === PetSpecies.CAT}>
                  <input
                    hidden
                    type="radio"
                    value={PetSpecies.CAT}
                    {...register('species')}
                    onClick={handlePetSpecies}
                  />
                  <PiCatBold size="24px" color="white" />
                </TypeRadioLabel>
              </Flex>
            </Box>

            {/* 이름 */}
            <InputWrapper>
              <InputLabel htmlFor="name">이름</InputLabel>
              <InputError>
                <Input type="text" placeholder="e.g. 도기" {...register('name')} fullWidth />
                {errors.name && <Text color="error">{errors.name.message}</Text>}
              </InputError>
            </InputWrapper>

            {/* 품종 */}
            <InputWrapper>
              <InputLabel htmlFor="breed">품종</InputLabel>
              <InputError>
                <Input type="text" placeholder="e.g. 골든 리트리버, 샴" {...register('breed')} fullWidth />
                {errors.breed && <Text color="error">{errors.breed.message}</Text>}
              </InputError>
            </InputWrapper>

            {/* 성별 */}
            <InputWrapper>
              <InputLabel htmlFor="gender">성별</InputLabel>
              <InputError>
                <Flex justifyContent="space-around" alignItems="center">
                  <Flex alignItems="center" gap="sm">
                    <input type="radio" value={PetGender.MALE} {...register('gender')} />
                    <TbGenderMale size="32px" />
                  </Flex>
                  <Flex alignItems="center" gap="sm">
                    <input type="radio" value={PetGender.FEMALE} {...register('gender')} />
                    <TbGenderFemale size="32px" />
                  </Flex>

                  <NeuteringButton htmlFor="neutering-checkbox" $isSelected={neutering}>
                    <input id="neutering-checkbox" type="checkbox" {...register('neutering')} hidden />
                    {neutering ? '중성화 O' : '중성화 X'}
                  </NeuteringButton>
                </Flex>
                {errors.gender && <Text color="error">{errors.gender.message}</Text>}
                {errors.neutering && <Text color="error">{errors.neutering.message}</Text>}
              </InputError>
            </InputWrapper>

            {/* 나이 */}
            <InputWrapper>
              <InputLabel htmlFor="age">나이</InputLabel>
              <InputError>
                <Flex alignItems="center" gap="md">
                  <Input id="age" type="number" {...register('age')} fullWidth css={{ textAlign: 'right' }} />
                  <span>살</span>
                </Flex>
                {errors.age && <Text color="error">{errors.age.message}</Text>}
              </InputError>
            </InputWrapper>

            {/* 몸무게 */}
            <InputWrapper>
              <InputLabel htmlFor="weight">몸무게</InputLabel>
              <InputError>
                <Flex alignItems="center" gap="sm">
                  <Input id="weight" type="number" {...register('weight')} fullWidth css={{ textAlign: 'right' }} />
                  <span>kg</span>
                </Flex>
                {errors.weight && <Text color="error">{errors.weight.message}</Text>}
              </InputError>
            </InputWrapper>

            {/* 펫소개 */}
            <InputWrapper>
              <InputLabel htmlFor="body">소개</InputLabel>
              <PetTextarea rows={5} {...register('body')} />
            </InputWrapper>
          </Flex>
        </Box>

        <FixedBottom hasSafeAreaPadding={true}>
          <Button type="submit" loading={isMutating} disabled={isMutating} variant="primary" size="lg" fullWidth>
            펫 수정하기
          </Button>
        </FixedBottom>
      </form>
    </>
  );
}
