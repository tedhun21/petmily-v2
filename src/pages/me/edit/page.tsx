import { useEffect, useMemo, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuthSWR, useAuthSWRMutation } from '@/hooks/authSWR';

import { Controller, useForm, useWatch } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import { toast } from 'react-toastify';
import { FaArrowUp, FaXmark } from 'react-icons/fa6';
import { GoVerified } from 'react-icons/go';
import { PiCatBold, PiDogBold } from 'react-icons/pi';

import { removeCookie } from '@/utils/cookie';
import { TypeRadioLabel } from '../pets/register/page';

import Spinner from '@/components/Spinner';
import 'react-toastify/dist/ReactToastify.css';

import { deleter, fetcher, updater } from '@/api';
import EmailCodeModalButton from './components/EmailCodeModal';
import { weekdays } from '@/utils/date';
import dayjs, { Dayjs } from 'dayjs';

import CustomDaumPostcode, { type PostcodeData } from '@/components/CustomDaumPostcode';
import { UserRole } from '@/types/user.type';
import { PetSpecies } from '@/types/pet.type';
import Button from '@/components/styled/Button';
import { Input } from '@/components/styled/Input';
import Text from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';
import { ImageCentered } from '@/styles/commonStyle';
import CustomPortalModal from '@/components/CustomPortalModal';
import { IconButton } from '@/components/styled/IconButtonAndLink';
import { colors } from '@/styles/colors';
import FixedBottom from '@/components/FixedBottom';
import Header from '@/components/headers/Header';
import BackButton from '@/components/buttons/BackButton';
import { FiTrash2 } from 'react-icons/fi';
import ConfirmModal from '@/components/ConfirmModal';

const schema = yup.object({
  nickname: yup
    .string()
    .required('닉네임은 필수입니다.')
    .min(3, '닉네임은 3자 이상이어야 합니다.')
    .matches(/^[a-zA-Z0-9\uac00-\ud7a3\s]+$/, '닉네임에는 한국어, 영어, 숫자, 공백만 허용됩니다.'),
  phone: yup
    .string()
    .required('연락처는 필수입니다.')
    .matches(/^010\d{8}$/, '연락처는 010으로 시작하는 11자리 숫자여야 합니다.'),
  address: yup.string().required('주소는 필수입니다.'),
  detailAddress: yup.string().required('상세 주소는 필수입니다.'),
  zipcode: yup.string().required('우편번호는 필수입니다.'),
  body: yup.string().max(1000, '소개는 최대 1000자를 초과할 수 없습니다.'),
  photo: yup.mixed<File | string>().nullable(),
  possiblePetSpecies: yup.array(yup.string().required('이 항목은 필수입니다.')),
  possibleDays: yup.array(yup.string().required('이 항목은 필수입니다.')),
  possibleLocations: yup.array(yup.string().required('이 항목은 필수입니다.')),
  possibleStartTime: yup.mixed<Dayjs>(),
  possibleEndTime: yup.mixed<Dayjs>(),
  deletePhoto: yup.string(),
});

type FormValues = {
  nickname: string;
  phone: string;
  address: string;
  detailAddress: string;
  zipcode: string;
  body?: string;
  photo?: File | string | null;
  possiblePetSpecies?: string[];
  possibleDays?: string[];
  possibleLocations?: string[];
  possibleStartTime?: Dayjs;
  possibleEndTime?: Dayjs;
  deletePhoto?: string;
};

export default function EditMePage() {
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isPostCodeModalOpen, setPostCodeModalOpen] = useState<boolean>(false);
  const [newLocation, setNewLocation] = useState<string>('');

  const {
    register,
    getValues,
    clearErrors,
    setValue,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nickname: '',
      phone: '',
      address: '',
      detailAddress: '',
      zipcode: '',
      body: undefined,
      photo: undefined,
      possiblePetSpecies: undefined,
      possibleDays: undefined,
      possibleLocations: undefined,
      possibleStartTime: undefined,
      possibleEndTime: undefined,
      deletePhoto: undefined,
    },
  });

  const photo = useWatch({ control, name: 'photo' });
  const deletePhoto = useWatch({ control, name: 'deletePhoto' });

  const possibleLocations = useWatch({
    control,
    name: 'possibleLocations',
    defaultValue: [],
  });

  const possiblePetSpecies = useWatch({
    control,
    name: 'possiblePetSpecies',
    defaultValue: [],
  });

  const possibleDays = useWatch({
    control,
    name: 'possibleDays',
    defaultValue: [],
  });

  const { data: me, isLoading } = useAuthSWR('/users/me', fetcher);

  const { trigger: updateTrigger, isMutating } = useAuthSWRMutation(`/users/${me?.id}`, updater, {
    onSuccess: () => {
      toast.success('회원 정보를 수정했어요');
      navigate('/me');
    },
    onError: () => {
      toast.error('회원 정보 수정을 실패했어요');
    },
  });

  const { trigger: deleteTrigger } = useAuthSWRMutation(`/users/${me?.id}`, deleter, {
    onSuccess: () => {
      toast.success('회원을 삭제했어요');
      removeCookie('access_token');
      removeCookie('refresh_token');
      navigate('/');
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

  const onConfirmDelete = async () => {
    await deleteTrigger();
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // 새 파일을 선택하면, 삭제 의도를 취소하고 새 파일을 photo 필드에 설정
      setValue('deletePhoto', undefined);
      setValue('photo', file);
    }
  };

  const handleDeletePhoto = () => {
    const currentPhoto = getValues('photo');

    // Case 1: 기존 서버 사진(string)을 삭제할 때
    if (typeof currentPhoto === 'string' && currentPhoto) {
      setValue('deletePhoto', currentPhoto);
      setValue('photo', null);
      return;
    }

    // Case 2: 새로 올린 미리보기 사진(File)을 취소할 때
    if (currentPhoto instanceof File) {
      setValue('photo', me?.photo ?? null);
    }
  };

  const onToggleModal = () => {
    setPostCodeModalOpen(true);
  };

  const handleComplete = (data: PostcodeData) => {
    const { address, zonecode } = data;

    if (data) {
      clearErrors('address');
    }

    setValue('address', address);
    setValue('zipcode', zonecode);

    setPostCodeModalOpen(false);
  };

  const handlePetSpecies = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.currentTarget;
    const currentValues = getValues('possiblePetSpecies') || [];

    let updatedValues;

    if (checked) {
      updatedValues = [...currentValues, value];
    } else {
      updatedValues = currentValues.filter((species) => species !== value);
    }
    setValue('possiblePetSpecies', updatedValues);
  };

  const handlePossibleDays = (e: React.MouseEvent<HTMLInputElement>) => {
    const { value, checked } = e.target as HTMLInputElement;
    const currentValues = getValues('possibleDays') || [];

    let updatedValues;

    if (checked) {
      updatedValues = [...currentValues, value];
    } else {
      updatedValues = currentValues.filter((day) => day !== value);
    }

    setValue('possibleDays', updatedValues);
  };

  const handleAddLocation = () => {
    if (newLocation && newLocation.trim()) {
      const currentLocations = getValues('possibleLocations') || [];
      setValue('possibleLocations', [...currentLocations, newLocation.trim()]);
      setNewLocation('');
    }
  };
  const handleDeleteLocation = (locationToDelete: string) => {
    const currentLocations = getValues('possibleLocations') || [];
    const updatedLocations = currentLocations.filter((location) => location !== locationToDelete);
    setValue('possibleLocations', updatedLocations);
  };

  // 회원 정보 수정
  const onSubmit = async (data: FormValues) => {
    const { photo, possibleStartTime, possibleEndTime, ...restOfData } = data;

    let formattedStartTime;
    let formattedEndTime;

    if (possibleStartTime && possibleEndTime) {
      formattedStartTime = possibleStartTime ? (possibleStartTime as dayjs.Dayjs).format('HH:mm') : undefined;
      formattedEndTime = possibleEndTime ? (possibleEndTime as dayjs.Dayjs).format('HH:mm') : undefined;
    }

    const formData = new FormData();

    const updatedData = {
      ...restOfData,
    };

    const formattedData = {
      ...updatedData,
      possibleStartTime: formattedStartTime,
      possibleEndTime: formattedEndTime,
    };

    formData.append('data', JSON.stringify(formattedData));

    // photo (File 인스턴스)는 별도로 formData에 추가
    if (photo && photo instanceof File) {
      formData.append('file', photo);
    }

    await updateTrigger(formData);
  };

  useEffect(() => {
    if (!isLoading && me) {
      reset({
        nickname: me.nickname,
        phone: me.phone,
        address: me.address,
        detailAddress: me.detailAddress,
        zipcode: me.zipcode,
        body: me.body ?? undefined,
        photo: me.photo ?? undefined,

        // 펫시터인 경우에만 값 설정, 아니면 undefined
        possiblePetSpecies: me.role === UserRole.PETSITTER ? (me.possiblePetSpecies ?? undefined) : undefined,
        possibleDays: me.role === UserRole.PETSITTER ? (me.possibleDays ?? undefined) : undefined,
        possibleLocations: me.role === UserRole.PETSITTER ? (me.possibleLocations ?? undefined) : undefined,
        possibleStartTime:
          me.role === UserRole.PETSITTER && me.possibleStartTime ? dayjs(me.possibleStartTime, 'HH:mm') : undefined,
        possibleEndTime:
          me.role === UserRole.PETSITTER && me.possibleEndTime ? dayjs(me.possibleEndTime, 'HH:mm') : undefined,

        deletePhoto: undefined,
      });
    }
  }, [isLoading, me, reset]);

  return (
    <>
      <Header
        left={<BackButton />}
        center={<Text size="lg">회원 정보 수정</Text>}
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
        title="아이디 삭제"
      >
        정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
      </ConfirmModal>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Box p={40}>
          <Flex direction="column" alignItems="center" gap="lg">
            <div css={{ position: 'relative' }}>
              <UserImageWrapper>
                <ImageCentered src={previewURL || '/imgs/DefaultUserProfile.jpg'} alt="user_photo" />
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  hidden
                />
              </UserImageWrapper>
              {previewURL && (
                <Absolute>
                  <IconButton onClick={handleDeletePhoto} variant="fill" size="sm" bgColor={colors.red400}>
                    <FaXmark size="16px" />
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
            <InputWrapper>
              <label htmlFor="username">이름</label>
              <span id="username">{me?.username}</span>
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="email">이메일</label>
              <Flex justifyContent="space-between" alignItems="center">
                <span id="email">{me?.email}</span>

                {me?.verified ? <GoVerified color="#279EFF" size="20px" /> : <EmailCodeModalButton email={me?.email} />}
              </Flex>
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="nickname">닉네임</label>
              <Flex direction="column">
                <Input id="nickname" {...register('nickname')} />
                {errors.nickname && (
                  <Text size="sm" color="error">
                    {errors.nickname.message}
                  </Text>
                )}
              </Flex>
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="phone">연락처</label>
              <Flex direction="column">
                <Input id="phone" {...register('phone')} />
                {errors.phone && (
                  <Text size="sm" color="error">
                    {errors.phone.message}
                  </Text>
                )}
              </Flex>
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="address">주소</label>
              <Flex direction="column">
                <Input id="address" onClick={onToggleModal} {...register('address')} readOnly />
                {errors.address && (
                  <Text size="sm" color="error">
                    {errors.address.message}
                  </Text>
                )}
              </Flex>

              {isPostCodeModalOpen && (
                <CustomPortalModal onClose={() => setPostCodeModalOpen(false)} style={{ width: '400px' }}>
                  <CustomDaumPostcode width="100%" maxHeight={600} onComplete={handleComplete} />
                </CustomPortalModal>
              )}
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="detailAddress">상세 주소</label>
              <Flex direction="column">
                <Input id="detailAddress" {...register('detailAddress')} />
                {errors.detailAddress && (
                  <Text size="sm" color="error">
                    {errors.detailAddress.message}
                  </Text>
                )}
              </Flex>
            </InputWrapper>
            <InputWrapper>
              <label htmlFor="body">나의 소개</label>
              <TextArea id="body" {...register('body')} />
            </InputWrapper>
            {/* 펫시터 정보 */}
            {me?.role === UserRole.PETSITTER && (
              <>
                <InputWrapper>
                  <label htmlFor="possible_pets">케어가능동물</label>
                  <PetSpeciesButtonContainer>
                    <TypeRadioLabel $isSelected={possiblePetSpecies?.includes(PetSpecies.DOG)}>
                      <input
                        id="possible_pets"
                        type="checkbox"
                        value={PetSpecies.DOG}
                        {...register('possiblePetSpecies')}
                        onChange={handlePetSpecies}
                        hidden
                      />
                      <PiDogBold size="20px" color="white" />
                    </TypeRadioLabel>
                    <TypeRadioLabel $isSelected={possiblePetSpecies?.includes(PetSpecies.CAT)}>
                      <input
                        id="possible_pets"
                        type="checkbox"
                        value={PetSpecies.CAT}
                        {...register('possiblePetSpecies')}
                        onChange={handlePetSpecies}
                        hidden
                      />
                      <PiCatBold size="20px" color="white" />
                    </TypeRadioLabel>
                  </PetSpeciesButtonContainer>
                </InputWrapper>
                <InputWrapper>
                  <label htmlFor="newLocation">케어가능지역</label>
                  <Flex direction="column" gap="xs">
                    <Flex gap="xs">
                      {possibleLocations?.map((location: string) => (
                        <Box as="li" key={location} p="xs" br="md" bg="background.highlight">
                          <Flex alignItems="center" gap="xs">
                            <Text size="sm" color="white">
                              {location}
                            </Text>
                            <IconButton
                              type="button"
                              onClick={() => handleDeleteLocation(location)}
                              bgColor={colors.red500}
                              shape="circle"
                            >
                              <FaXmark size="16px" />
                            </IconButton>
                          </Flex>
                        </Box>
                      ))}
                    </Flex>

                    <Box css={{ position: 'relative' }}>
                      <Flex justifyContent="space-between">
                        <Input
                          id="newLocation"
                          placeholder="예) 서울, 서울 용산구"
                          value={newLocation}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLocation(e.target.value)}
                          css={{ width: '100%' }}
                        />
                        <AddLocationButton type="button" onClick={handleAddLocation}>
                          <FaArrowUp size="16px" color="#279EFF" />
                        </AddLocationButton>
                      </Flex>
                    </Box>
                  </Flex>
                </InputWrapper>
                <InputWrapper>
                  <label htmlFor="careable_days">케어가능요일</label>
                  <Flex justifyContent="space-between">
                    {weekdays.map((day: { id: number; value: string; label: string }) => (
                      <DayLabel key={day.id} $isSelected={possibleDays?.includes(day.value)}>
                        <input
                          id="carable_days"
                          hidden
                          type="checkbox"
                          value={day.value}
                          {...register('possibleDays')}
                          onClick={handlePossibleDays}
                        />
                        <span>{day.label}</span>
                      </DayLabel>
                    ))}
                  </Flex>
                </InputWrapper>
                <InputWrapper>
                  <label htmlFor="possible_time">케어가능시간</label>
                  <Flex gap="sm">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['TimePicker']} sx={{ flex: 1 }}>
                        <Controller
                          name="possibleStartTime"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <StyledTimePicker
                              label="시작"
                              minutesStep={30}
                              skipDisabled={true}
                              minTime={dayjs(new Date(0, 0, 0, 8))}
                              maxTime={dayjs(new Date(0, 0, 0, 21))}
                              ampm={false}
                              value={value || null}
                              onChange={onChange}
                              // shouldDisableTime={(value, view) => checkInDisableTime(value, view, watch('date'))}
                              sx={{ minWidth: 'none' }}
                              slotProps={{ textField: { id: 'possible_time' } }}
                            />
                          )}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['TimePicker']} sx={{ flex: 1 }}>
                        <Controller
                          name="possibleEndTime"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <StyledTimePicker
                              label="끝"
                              minutesStep={30}
                              skipDisabled={true}
                              minTime={dayjs(new Date(0, 0, 0, 8))}
                              maxTime={dayjs(new Date(0, 0, 0, 21))}
                              ampm={false}
                              value={value || null}
                              onChange={onChange}
                              // shouldDisableTime={(value, view) => checkInDisableTime(value, view, watch('date'))}
                              sx={{ minWidth: 'none' }}
                              slotProps={{ textField: { id: 'possible_time' } }}
                            />
                          )}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </Flex>
                </InputWrapper>
              </>
            )}
          </Flex>
        </Box>

        <FixedBottom hasSafeAreaPadding={true}>
          <Box p="xl">
            <Flex direction="column" gap="md">
              <Button disabled={isMutating} type="submit" variant="primary" size="lg" fullWidth>
                {isLoading ? <Spinner /> : <span>수정하기</span>}
              </Button>
            </Flex>
          </Box>
        </FixedBottom>
      </form>
    </>
  );
}

const UserImageWrapper = styled.div`
  position: relative;
  width: 200px;
  height: 200px;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Absolute = styled.div`
  position: absolute;
  top: -12px;
  right: -12px;
`;

export const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  > label {
    width: 20%;
  }

  > div {
    width: 80%;
  }
`;

const AddLocationButton = styled.button`
  position: absolute;
  top: 14px;
  right: ${({ theme }) => theme.space.md};
`;

const TextArea = styled.textarea`
  width: 80%;
  padding: ${({ theme }) => theme.space.sm};
  background-color: ${({ theme }) => theme.colors.background.input.primary};
  border: 1px solid ${({ theme }) => theme.colors.line.input.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  ${({ theme }) => theme.typeScale.base};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.input.hover};
  }

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.line.input.focus};
  }
`;

const PetSpeciesButtonContainer = styled.div`
  display: flex;
  overflow: hidden;
  width: 80%;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const DayLabel = styled.label<{ $isSelected?: boolean }>`
  padding: ${({ theme }) => theme.space.sm};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.background.box.accent.primary : theme.colors.background.box.accent.disabled};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text.white};

  /* Adding transition for smooth effect */
  transition:
    background-color 0.3s ease-in-out,
    transform 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.accent.hover};
  }
`;

const StyledTimePicker = styled(TimePicker)`
  .MuiInputBase-root {
    background-color: ${({ theme }) => theme.colors.background.input.primary};
    border-radius: ${({ theme }) => theme.radius.md};

    &:hover {
      background-color: ${({ theme }) => theme.colors.background.input.hover};
    }
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.colors.line.input.primary};

    &:hover {
      border-color: ${({ theme }) => theme.colors.line.input.error};
    }
  }
`;
