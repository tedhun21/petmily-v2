import { MouseEvent, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { useAuthSWR, useAuthSWRMutation } from '@/hooks/authSWR';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from '@mui/material';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';

import { toast } from 'react-toastify';
import { FaArrowUp, FaXmark } from 'react-icons/fa6';
import { GoVerified } from 'react-icons/go';
import { PiCatBold, PiDogBold } from 'react-icons/pi';

import { removeCookie } from '@/utils/cookie';
import { TypeRadioLabel } from '../pet/register/page';

import Loading from '@components/Loading';
import 'react-toastify/dist/ReactToastify.css';

import { deleter, fetcher, updater } from '@/api';
import EmailCodeModalButton from './components/EmailCodeModal';
import { weekdays } from '@/utils/date';
import dayjs from 'dayjs';

import CustomDaumPostcode from '@components/CustomDaumPostcode';
import BackHeader from '@components/headers/BackHeader';
import EditableProfileImage from '../../../components/EditableProfileImage';
import { UserRole } from '@/types/user.type';
import { PetSpecies } from '@/types/pet.type';
import { Button } from '@/components/styled/Button';
import { Input } from '@components/styled/Input';
import { Text } from '@components/styled/Text';
import Box from '@components/styled/Box';
import Flex from '@components/styled/Flex';
import { css } from '@emotion/react';

const schema = yup.object().shape({
  nickname: yup
    .string()
    .min(3, '닉네임은 3자 이상이어야 합니다.')
    .matches(/^[a-zA-Z0-9\uac00-\ud7a3\s]+$/, '닉네임에는 한국어, 영어, 숫자, 공백만 허용됩니다.'),
  phone: yup
    .string()
    .matches(/^010\d{8}$/, '연락처는 010으로 시작하는 11자리 숫자여야 합니다.')
    .nullable(),
  address: yup.string().nullable(),
  detailAddress: yup.string().nullable(),
  zipcode: yup.string(),
  body: yup.string().nullable(),
  possiblePetSpecies: yup.array().of(yup.string()).nullable(),
  possibleDays: yup.array().of(yup.string()).nullable(),
  possibleLocations: yup.array().of(yup.string()).nullable(),
  possibleStartTime: yup.mixed().nullable(),
  possibleEndTime: yup.mixed().nullable(),
});

type IEditUser = yup.InferType<typeof schema>;

export default function EditMePage() {
  const navigate = useNavigate();

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [serverImageUrl, setServerImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newLocation, setNewLocation] = useState<string>('');
  const [deletePhoto, setDeletePhoto] = useState<string | null>(null);

  const { data: me, isLoading } = useAuthSWR('/users/me', fetcher);

  const { trigger: updateTrigger, isMutating } = useAuthSWRMutation(`/users/${me?.id}`, updater, {
    onSuccess: () => {
      toast.success('회원 정보가 성공적으로 수정되었습니다!');
      navigate('/me');
    },
    onError: () => {
      toast.error('회원 정보 수정에 실패했습니다!');
    },
  });

  const { trigger: deleteTrigger } = useAuthSWRMutation(`/users/${me?.id}`, deleter, {
    onSuccess: () => {
      toast.success('회원을 삭제하였습니다!');
      removeCookie('access_token');
      removeCookie('refresh_token');
      navigate('/');
    },
  });

  const {
    register,
    getValues,
    clearErrors,
    setValue,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<IEditUser>({
    resolver: yupResolver(schema),
    defaultValues: {
      possiblePetSpecies: [],
      possibleDays: [],
      possibleLocations: [],
    },
  });

  const onToggleModal = () => {
    setIsModalOpen(true);
  };

  const handleComplete = (data: any) => {
    const { address, zonecode } = data;

    if (data) {
      clearErrors('address');
    }

    setValue('address', address);
    setValue('zipcode', zonecode);

    setIsModalOpen(false);
  };

  const handlePetSpecies = (e: MouseEvent<HTMLInputElement>) => {
    const { value, checked } = e.target as HTMLInputElement;
    const currentValues = watch('possiblePetSpecies') || [];

    let updatedValues;

    if (checked) {
      updatedValues = [...currentValues, value];
    } else {
      updatedValues = currentValues.filter((species) => species !== value);
    }
    setValue('possiblePetSpecies', updatedValues);
  };

  const handlePossibleDays = (e: MouseEvent<HTMLInputElement>) => {
    const { value, checked } = e.target as HTMLInputElement;
    const currentValues = watch('possibleDays') || [];

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
      const currentLocations = watch('possibleLocations') || [];
      setValue('possibleLocations', [...currentLocations, newLocation.trim()]);
      setNewLocation('');
    }
  };
  const handleDeleteLocation = (locationToDelete: string) => {
    const currentLocations = watch('possibleLocations') || [];
    const updatedLocations = currentLocations.filter((location) => location !== locationToDelete);
    setValue('possibleLocations', updatedLocations);
  };

  // 회원 정보 수정
  const onSubmit = async (data: IEditUser) => {
    const { possibleStartTime, possibleEndTime } = data;

    let formattedStartTime;
    let formattedEndTime;

    if (possibleStartTime && possibleEndTime) {
      formattedStartTime = possibleStartTime ? (possibleStartTime as dayjs.Dayjs).format('HH:mm') : null;
      formattedEndTime = possibleEndTime ? (possibleEndTime as dayjs.Dayjs).format('HH:mm') : null;
    }

    const formData = new FormData();

    const updatedData = {
      ...data,
      ...(deletePhoto ? { deletePhoto } : {}),
      zipcode: getValues('zipcode'),
    };

    const formattedData = {
      ...updatedData,
      possibleStartTime: formattedStartTime,
      possibleEndTime: formattedEndTime,
    };

    formData.append('data', JSON.stringify(formattedData));

    if (imageFile) {
      formData.append('file', imageFile);
    }

    await updateTrigger(formData);
  };

  const handleLogout = () => {
    removeCookie('access_token');
    removeCookie('refresh_token');
    toast.success('로그아웃 되었습니다.');
    navigate('/');
  };

  const deleteAccount = async () => {
    const isConfirmed = window.confirm('정말 탈퇴하시겠습니까?');
    if (!isConfirmed) return;

    await deleteTrigger();
  };

  useEffect(() => {
    if (!isLoading && me) {
      setValue('nickname', me.nickname);
      setValue('phone', me.phone);
      setValue('address', me.address);
      setValue('detailAddress', me.detailAddress);
      setValue('body', me.body);

      if (me.possiblePetSpecies) setValue('possiblePetSpecies', me.possiblePetSpecies);
      if (me.possibleDays) setValue('possibleDays', me.possibleDays);
      if (me.possibleLocations) setValue('possibleLocations', me.possibleLocations);

      if (me.possibleStartTime) {
        setValue('possibleStartTime', dayjs(me.possibleStartTime, 'HH:mm'));
      }

      if (me.possibleEndTime) {
        setValue('possibleEndTime', dayjs(me.possibleEndTime, 'HH:mm'));
      }

      if (me.photo) setServerImageUrl(me.photo);
    }
  }, [isLoading, me]);

  return (
    <>
      <BackHeader title="회원 정보 수정" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box p="xl">
          <Flex direction="column" gap="xl">
            <EditableProfileImage
              setImageFile={setImageFile}
              serverImageUrl={serverImageUrl}
              setServerImageUrl={setServerImageUrl}
              setDeletePhoto={setDeletePhoto}
              defaultImage="/imgs/DefaultUserProfile.jpg"
            />
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
                <Input id="address" onClick={onToggleModal} onKeyDown={onToggleModal} {...register('address')} />
                {errors.address && (
                  <Text size="sm" color="error">
                    {errors.address.message}
                  </Text>
                )}
              </Flex>

              <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <div style={{ width: '360px' }}>
                  <CustomDaumPostcode onComplete={handleComplete} />
                </div>
              </Modal>
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
                    <TypeRadioLabel $isSelected={watch('possiblePetSpecies')?.includes(PetSpecies.DOG)}>
                      <input
                        id="possible_pets"
                        type="checkbox"
                        value={PetSpecies.DOG}
                        {...register('possiblePetSpecies')}
                        onClick={handlePetSpecies}
                        hidden
                      />
                      <PiDogBold size="20px" color="white" />
                    </TypeRadioLabel>
                    <TypeRadioLabel $isSelected={watch('possiblePetSpecies')?.includes(PetSpecies.CAT)}>
                      <input
                        id="possible_pets"
                        type="checkbox"
                        value={PetSpecies.CAT}
                        {...register('possiblePetSpecies')}
                        onClick={handlePetSpecies}
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
                      {watch('possibleLocations')?.map((location: any) => (
                        <Box as="li" key={location} p="xs" br="md" bg="background.highlight">
                          <Flex alignItems="center" gap="xs">
                            <Text size="sm" color="white">
                              {location}
                            </Text>
                            <Button type="button" onClick={() => handleDeleteLocation(location)} variant="icon">
                              <FaXmark size="16px" color="red" />
                            </Button>
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
                    {weekdays.map((day: any) => (
                      <DayLabel key={day.id} $isSelected={watch('possibleDays')?.includes(day.value)}>
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

        <Box p="xl">
          <Flex direction="column" gap="md">
            <Button disabled={isMutating} type="submit" variant="primary" size="lg" fullWidth>
              {isLoading ? <Loading /> : <span>수정하기</span>}
            </Button>
            <Flex justifyContent="space-between">
              <Button type="button" onClick={handleLogout} variant="secondary">
                로그아웃
              </Button>
              <Button type="button" onClick={deleteAccount} variant="secondary">
                회원 탈퇴
              </Button>
            </Flex>
          </Flex>
        </Box>
      </form>
    </>
  );
}

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
  right: ${({ theme }) => theme.spacing.md};
`;

const TextArea = styled.textarea`
  width: 80%;
  padding: ${({ theme }) => theme.spacing.sm};
  background-color: ${({ theme }) => theme.colors.background.input.primary};
  border: 1px solid ${({ theme }) => theme.colors.line.input.primary};
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ theme }) => theme.colors.text.active};
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
  padding: ${({ theme }) => theme.spacing.sm};
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
