import { MouseEvent, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from '@mui/material';

import { BlueButton, Column, ErrorMessage, Input, Row, Texts14h21 } from 'styles/commonStyle';

import { deleteCookie } from 'utils/cookie';
import { TypeRadioLabel } from '../register/page';

import { deleterWithCookie, fetcherWithCookie, updaterWithCookie } from 'api';
import Loading from '@components/Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoVerified } from 'react-icons/go';

import EmailCodeModalButton from './components/EmailCodeModal';
import { PiCatBold, PiDogBold } from 'react-icons/pi';
import { weekdays } from 'utils/date';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { FaArrowUp, FaXmark } from 'react-icons/fa6';
import CustomDaumPostcode from '@components/CustomDaumPostcode';
import BackHeader from '@components/headers/BackHeader';
import EditableProfileImage from '../../../components/EditableProfileImage';
import { UserRole } from 'types/user.type';
import { PetSpecies } from 'types/pet.type';
import { API_URL } from 'config';

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

  const { data: me, isLoading } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);

  const { trigger: updateTrigger, isMutating } = useSWRMutation(`${API_URL}/users/${me?.id}`, updaterWithCookie, {
    onSuccess: () => {
      toast.success('회원 정보가 성공적으로 수정되었습니다!');
      navigate('/me');
    },
    onError: () => {
      toast.error('회원 정보 수정에 실패했습니다!');
    },
  });

  const { trigger: deleteTrigger } = useSWRMutation(`${API_URL}/users/${me?.id}`, deleterWithCookie, {
    onSuccess: () => {
      toast.success('회원을 삭제하였습니다!');
      deleteCookie('access_token');
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

    await updateTrigger({ formData });
  };

  const handleLogout = () => {
    deleteCookie('access_token');
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
    <Main>
      <BackHeader title="회원 정보 수정" />
      <Form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <EditableProfileImage
            setImageFile={setImageFile}
            serverImageUrl={serverImageUrl}
            setServerImageUrl={setServerImageUrl}
            setDeletePhoto={setDeletePhoto}
            defaultImage="/imgs/DefaultUserProfile.jpg"
          />
          <InputWrapper>
            <InputLabel htmlFor="username">이름</InputLabel>
            <span id="username">{me?.username}</span>
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="email">이메일</InputLabel>
            <EmailWrapper>
              <span id="email">{me?.email}</span>

              {me?.verified ? <GoVerified color="#279EFF" size="20px" /> : <EmailCodeModalButton email={me?.email} />}
            </EmailWrapper>
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="nickname">닉네임</InputLabel>
            <InputError>
              <MeInput id="nickname" {...register('nickname')} />
              {errors.nickname && <ErrorMessage>{errors.nickname.message}</ErrorMessage>}
            </InputError>
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="phone">연락처</InputLabel>
            <InputError>
              <MeInput id="phone" {...register('phone')} />
              {errors.phone && <ErrorMessage>{errors.phone.message}</ErrorMessage>}
            </InputError>
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="address">주소</InputLabel>
            <InputError>
              <MeInput id="address" onClick={onToggleModal} onKeyDown={onToggleModal} {...register('address')} />
              {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
            </InputError>

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
            <InputLabel htmlFor="detailAddress">상세 주소</InputLabel>
            <InputError>
              <MeInput id="detailAddress" {...register('detailAddress')} />
              {errors.detailAddress && <ErrorMessage>{errors.detailAddress.message}</ErrorMessage>}
            </InputError>
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="body">나의 소개</InputLabel>
            <TextArea id="body" {...register('body')} />
          </InputWrapper>

          {/* 펫시터 정보 */}
          {me?.role === UserRole.PETSITTER && (
            <>
              <InputWrapper>
                <InputLabel>케어가능동물</InputLabel>
                <PetSpeciesButtonContainer>
                  <TypeRadioLabel $isSelected={watch('possiblePetSpecies')?.includes(PetSpecies.DOG)}>
                    <input
                      hidden
                      type="checkbox"
                      value={PetSpecies.DOG}
                      {...register('possiblePetSpecies')}
                      onClick={handlePetSpecies}
                    />
                    <PiDogBold size="20px" color="white" />
                  </TypeRadioLabel>
                  <TypeRadioLabel $isSelected={watch('possiblePetSpecies')?.includes(PetSpecies.CAT)}>
                    <input
                      hidden
                      type="checkbox"
                      value={PetSpecies.CAT}
                      {...register('possiblePetSpecies')}
                      onClick={handlePetSpecies}
                    />
                    <PiCatBold size="20px" color="white" />
                  </TypeRadioLabel>
                </PetSpeciesButtonContainer>
              </InputWrapper>
              <InputWrapper>
                <InputLabel>케어가능지역</InputLabel>
                <LocationInputWrapper>
                  <LocationList>
                    {watch('possibleLocations')?.map((location: any) => (
                      <LocationItem key={location}>
                        <Texts14h21>{location}</Texts14h21>
                        <button
                          type="button"
                          onClick={() => handleDeleteLocation(location)}
                          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                        >
                          <FaXmark size="16px" color="red" />
                        </button>
                      </LocationItem>
                    ))}
                  </LocationList>

                  <LocationInputContainer>
                    <LocationInput
                      placeholder="예) 서울, 서울 용산구"
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                    />
                    <AddLocationButton type="button" onClick={handleAddLocation}>
                      <FaArrowUp size="16px" color="#279EFF" />
                    </AddLocationButton>
                  </LocationInputContainer>
                </LocationInputWrapper>
              </InputWrapper>
              <InputWrapper>
                <InputLabel>케어가능요일</InputLabel>
                <WeekdaysWrapper>
                  {weekdays.map((day: any) => (
                    <DayLabel key={day.id} $isSelected={watch('possibleDays')?.includes(day.value)}>
                      <input
                        hidden
                        type="checkbox"
                        value={day.value}
                        {...register('possibleDays')}
                        onClick={handlePossibleDays}
                      />
                      <span>{day.label}</span>
                    </DayLabel>
                  ))}
                </WeekdaysWrapper>
              </InputWrapper>
              <InputWrapper>
                <InputLabel>케어가능시간</InputLabel>
                <TimePickerContainer>
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
                          />
                        )}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </TimePickerContainer>
              </InputWrapper>
            </>
          )}
        </InputContainer>

        <ButtonContainer>
          <SubmitButton disabled={isMutating} type="submit">
            {isLoading ? <Loading /> : <span>수정하기</span>}
          </SubmitButton>
          <LinkContainer>
            <StyledButton type="button" onClick={handleLogout}>
              로그아웃
            </StyledButton>
            <StyledButton type="button" onClick={deleteAccount}>
              회원 탈퇴
            </StyledButton>
          </LinkContainer>
        </ButtonContainer>
      </Form>
    </Main>
  );
}

const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Form = styled.form`
  flex: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const InputContainer = styled(Column)`
  flex: auto;
  overflow-y: auto;
  padding: 20px;
  gap: 20px;
  height: 100%;
`;

const EmailWrapper = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const InputWrapper = styled(Row)`
  align-items: center;
  width: 100%;
`;

const InputLabel = styled.label`
  width: 20%;
`;

const InputError = styled(Column)`
  width: 80%;
`;

const MeInput = styled(Input)`
  width: 100%;
  border-radius: ${({ theme }) => theme.radius.normal};
  padding: 8px;
  ${({ theme }) => theme.fontSize.s16h24}
`;

const LocationInputWrapper = styled(Column)`
  width: 80%;
  gap: 4px;
`;

const LocationList = styled.ul`
  display: flex;
  gap: 4px;
`;

const LocationItem = styled.li`
  display: flex;
  align-items: center;
  border-radius: ${({ theme }) => theme.radius.normal};
  gap: 4px;
  padding: 4px;
  color: white;
  background-color: ${({ theme }) => theme.background.highlight};
`;

const LocationInputContainer = styled(Row)`
  position: relative;
  flex: auto;
  justify-content: space-between;
`;

const LocationInput = styled(Input)`
  width: 100%;

  border-radius: ${({ theme }) => theme.radius.normal};
  padding: 8px;
  ${({ theme }) => theme.fontSize.s16h24};
  background-color: ${({ theme }) => theme.background.input.primary};

  &:hover {
    background-color: ${({ theme }) => theme.background.input.hover};
  }

  &:focus {
    border: 1px solid ${({ theme }) => theme.line.input.highlight};
  }
`;

const AddLocationButton = styled.button`
  position: absolute;
  right: 12px;
  top: 14px;
`;

const TextArea = styled.textarea`
  width: 80%;

  border-radius: ${({ theme }) => theme.radius.normal};
  padding: 8px;
  color: ${({ theme }) => theme.text.active};
  border: 1px solid ${({ theme }) => theme.line.input.primary};
  background-color: ${({ theme }) => theme.background.input.primary};
  ${({ theme }) => theme.fontSize.s16h24};

  &:hover {
    background-color: ${({ theme }) => theme.background.input.hover};
  }
  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.line.input.highlight};
  }
`;

const PetSpeciesButtonContainer = styled.div`
  display: flex;
  width: 80%;
  border-radius: ${({ theme }) => theme.radius.normal};
  overflow: hidden;
`;

const WeekdaysWrapper = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
`;

const DayLabel = styled.label<{ $isSelected?: boolean }>`
  padding: 8px;
  color: white;
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.background.box.blue.primary : theme.background.box.blue.disabled};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radius.normal};

  /* Adding transition for smooth effect */
  transition:
    background-color 0.3s ease-in-out,
    transform 0.3s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.background.box.blue.hover};
  }
`;

const TimePickerContainer = styled(Row)`
  width: 80%;
  gap: 8px;
`;

const StyledTimePicker = styled(TimePicker)`
  .MuiInputBase-root {
    border-radius: ${({ theme }) => theme.radius.normal};
    background-color: ${({ theme }) => theme.background.input.primary};
    &:hover {
      background-color: ${({ theme }) => theme.background.input.hover};
    }
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: ${({ theme }) => theme.line.input.primary};
    &:hover {
      border-color: red;
    }
  }
`;

const ButtonContainer = styled(Column)`
  flex: 1;
  gap: 12px;
  padding: 20px;
`;

const SubmitButton = styled(BlueButton)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: ${({ theme }) => theme.radius.normal};
  padding: 8px;
  ${({ theme }) => theme.fontSize.s18h27};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const LinkContainer = styled(Row)`
  justify-content: space-between;
  width: 100%;
`;

const StyledButton = styled.button`
  background: none;

  ${({ theme }) => theme.fontSize.s14h21};

  &:hover {
    color: ${({ theme }) => theme.text.highlight};
  }
`;
