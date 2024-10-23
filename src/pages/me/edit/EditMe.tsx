import { MouseEvent, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import DaumPostcode from 'react-daum-postcode';

import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal } from '@mui/joy';

import { Column, ErrorMessage, Row, Texts14h21, Texts20h30 } from 'commonStyle';

import UploadProfileImg from '../../../components/UploadProfileImg';
import { deleteCookie } from 'utils/cookie';
import { ButtonContainer, TitleContainer, TypeRadioLabel } from '../register/CreatePet';

import { deleterWithCookie, fetcherWithCookie, updaterWithCookie } from 'api';
import Loading from '@components/Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoVerified } from 'react-icons/go';

import EmailCodeModalButton from './components/EmailCodeModal';
import { PiCatBold, PiDogBold } from 'react-icons/pi';
import { checkInDisableTime, weekdays } from 'utils/date';
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import dayjs from 'dayjs';
import { FaArrowUp, FaXmark } from 'react-icons/fa6';
import { Diversity1Outlined } from '@mui/icons-material';

const schema = yup.object().shape({
  nickname: yup
    .string()
    .min(3, '닉네임은 3자 이상이어야 합니다.')
    .matches(/^[a-zA-Z0-9\uac00-\ud7a3\s]+$/, '닉네임에는 한국어, 영어, 숫자, 공백만 허용됩니다.'),
  phone: yup
    .string()
    .nullable()
    .matches(/^010\d{8}$/, '연락처는 010으로 시작하는 11자리 숫자여야 합니다.'),
  address: yup.string().nullable(),
  detailAddress: yup.string().nullable(),
  body: yup.string().nullable(),
  possiblePetSpecies: yup.array().of(yup.string()).nullable(),
  possibleDays: yup.array().of(yup.string()).nullable(),
  possibleLocations: yup.array().of(yup.string()).nullable(),
  possibleStartTime: yup.mixed().nullable(),
  possibleEndTime: yup.mixed().nullable(),
});

type IEditUser = yup.InferType<typeof schema>;

const API_URL = process.env.REACT_APP_API_URL;

export default function EditMe() {
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newLocation, setNewLocation] = useState<string>('');

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
  });

  const onToggleModal = () => {
    setIsModalOpen(true);
  };

  const handleComplete = (data: any) => {
    if (data) {
      clearErrors('address');
    }

    const splitAddress = data.address.split(' ').splice(2).join(' ');

    setValue('address', `${data.zonecode} ${data.sido} ${data.sigungu} ${splitAddress}`);

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

    const formattedData = {
      ...data,
      possibleStartTime: formattedStartTime,
      possibleEndTime: formattedEndTime,
    };

    formData.append('data', JSON.stringify(formattedData));

    if (previewImage) {
      formData.append('file', previewImage);
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
      setValue('possiblePetSpecies', me?.possiblePetSpecies);
      setValue('possibleDays', me?.possibleDays);
      setValue('possibleLocations', me?.possibleLocations);
      setValue('possibleStartTime', dayjs(me.possibleStartTime, 'HH:mm'));
      setValue('possibleEndTime', dayjs(me.possibleEndTime, 'HH:mm'));
    }
  }, [isLoading, me]);

  console.log(watch());

  return (
    <main>
      <TitleContainer>
        <Texts20h30>회원 정보 수정</Texts20h30>
      </TitleContainer>
      <MainContainer>
        <UploadProfileImg
          serverImageUrl={me?.photo}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          defaultImage="/imgs/DefaultUserProfile.jpg"
        />

        <FormContainer onSubmit={handleSubmit(onSubmit)}>
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
              <Input {...register('nickname')} />
              <ErrorMessage>{errors.nickname && errors.nickname.message}</ErrorMessage>
            </InputError>
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="phone">연락처</InputLabel>
            <InputError>
              <Input {...register('phone')} />
              <ErrorMessage>{errors.phone && errors.phone.message}</ErrorMessage>
            </InputError>
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="address">주소</InputLabel>
            <InputError>
              <Input onClick={onToggleModal} onKeyDown={onToggleModal} {...register('address')} />
              {errors.address && <ErrorMessage>{errors.address.message}</ErrorMessage>}
            </InputError>

            <Modal
              open={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div style={{ width: '360px' }}>
                <DaumPostcode onComplete={handleComplete} />
              </div>
            </Modal>
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="detailAddress">상세 주소</InputLabel>
            <InputError>
              <Input {...register('detailAddress')} />
              {errors.detailAddress && <ErrorMessage>{errors.detailAddress.message}</ErrorMessage>}
            </InputError>
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="body">나의 소개</InputLabel>
            <TextArea {...register('body')} />
          </InputWrapper>
          {me?.role === 'Petsitter' && (
            <>
              <InputWrapper>
                <InputLabel>케어가능동물</InputLabel>
                <PetSpciesButtonContainer>
                  <TypeRadioLabel isSelected={watch('possiblePetSpecies')?.includes('Dog')}>
                    <input
                      hidden
                      type="checkbox"
                      value="Dog"
                      {...register('possiblePetSpecies')}
                      onClick={handlePetSpecies}
                    />
                    <PiDogBold size="20px" color="white" />
                  </TypeRadioLabel>
                  <TypeRadioLabel isSelected={watch('possiblePetSpecies')?.includes('Cat')}>
                    <input
                      hidden
                      type="checkbox"
                      value="Cat"
                      {...register('possiblePetSpecies')}
                      onClick={handlePetSpecies}
                    />
                    <PiCatBold size="20px" color="white" />
                  </TypeRadioLabel>
                </PetSpciesButtonContainer>
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

                  <InputContainer>
                    <LocationInput value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
                    <AddLocationButton type="button" onClick={handleAddLocation}>
                      <FaArrowUp size="16px" color="#279EFF" />
                    </AddLocationButton>
                  </InputContainer>
                </LocationInputWrapper>
              </InputWrapper>
              <InputWrapper>
                <InputLabel>케어가능요일</InputLabel>
                <WeekdaysWrapper>
                  {weekdays.map((day: any) => (
                    <DayLabel key={day.id} isSelected={watch('possibleDays')?.includes(day.value)}>
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
                      <StyledTimePicker>
                        <Controller
                          name="possibleStartTime"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <TimePicker
                              label="시작"
                              minutesStep={30}
                              skipDisabled={true}
                              minTime={dayjs(new Date(0, 0, 0, 8))}
                              maxTime={dayjs(new Date(0, 0, 0, 21))}
                              ampm={false}
                              value={value || null}
                              onChange={onChange}
                              // shouldDisableTime={(value, view) => checkInDisableTime(value, view, watch('date'))}
                              sx={{ width: '100%' }}
                            />
                          )}
                        />
                      </StyledTimePicker>
                    </DemoContainer>
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['TimePicker']} sx={{ flex: 1 }}>
                      <StyledTimePicker>
                        <Controller
                          name="possibleEndTime"
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <TimePicker
                              label="끝"
                              minutesStep={30}
                              skipDisabled={true}
                              minTime={dayjs(new Date(0, 0, 0, 8))}
                              maxTime={dayjs(new Date(0, 0, 0, 21))}
                              ampm={false}
                              value={value || null}
                              onChange={onChange}
                              // shouldDisableTime={(value, view) => checkInDisableTime(value, view, watch('date'))}
                              sx={{ width: '100%' }}
                            />
                          )}
                        />
                      </StyledTimePicker>
                    </DemoContainer>
                  </LocalizationProvider>
                </TimePickerContainer>
              </InputWrapper>
            </>
          )}
          <SubmitButton disabled={isMutating} type="submit">
            {isLoading ? <Loading /> : <span>수정하기</span>}
          </SubmitButton>
        </FormContainer>

        <LinkContainer>
          <StyledButton onClick={handleLogout}>로그아웃</StyledButton>
          <StyledButton onClick={deleteAccount}>회원 탈퇴</StyledButton>
        </LinkContainer>
      </MainContainer>
    </main>
  );
}

const MainContainer = styled.section`
  display: flex;
  flex-direction: column;
  padding: 40px;
`;

export const InfoText = styled.div`
  ${(props) => props.theme.fontSize.s16h24};
  font-weight: 800;
  margin-top: 20px;
  color: #2792ff;
`;

const FormContainer = styled.form`
  display: flex;
  gap: 20px;
  flex-direction: column;
  width: 100%;
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

const Input = styled.input`
  width: 100%;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  border-radius: 8px;
  padding: 8px;
  ${(props) => props.theme.fontSize.s16h24}
`;

const LocationInputWrapper = styled(Column)`
  width: 80%;
  gap: 4px;
`;

const InputDiv = styled.div`
  display: flex;
  width: 80%;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  border-radius: 8px;
  padding: 8px;
  ${(props) => props.theme.fontSize.s16h24};
`;

const LocationList = styled.ul`
  display: flex;
  gap: 4px;
`;

const LocationItem = styled.li`
  display: flex;
  align-items: center;
  border-radius: 8px;
  gap: 4px;
  padding: 4px;
  color: white;
  background-color: ${(props) => props.theme.colors.mainBlue};
`;

const InputContainer = styled(Row)`
  position: relative;
  flex: auto;
  justify-content: space-between;
`;

const LocationInput = styled.input`
  width: 100%;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  border-radius: 8px;
  padding: 8px;
  ${(props) => props.theme.fontSize.s16h24};
`;

const AddLocationButton = styled.button`
  position: absolute;
  right: 12px;
  top: 14px;
`;

const TextArea = styled.textarea`
  width: 80%;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  border-radius: 8px;
  padding: 8px;
  ${(props) => props.theme.fontSize.s16h24}
`;

const PetSpciesButtonContainer = styled(ButtonContainer)`
  width: 80%;
`;

const WeekdaysWrapper = styled.div`
  width: 80%;
  display: flex;
  justify-content: space-between;
`;

const DayLabel = styled.label<{ isSelected?: boolean }>`
  padding: 8px;
  color: white;
  background-color: ${(props) => (props.isSelected ? props.theme.colors.mainBlue : props.theme.textColors.gray50)};
  cursor: pointer;
  border-radius: 8px;

  /* Adding transition for smooth effect */
  transition:
    background-color 0.3s ease-in-out,
    transform 0.3s ease-in-out;

  &:hover {
    background-color: ${(props) => props.theme.colors.skyBlue};
  }
`;

const TimePickerContainer = styled(Row)`
  width: 80%;
  gap: 8px;
`;

const StyledTimePicker = styled.div`
  // TimePicker 컴포넌트의 스타일을 수정하기 위한
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SubmitButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.mainBlue};
  color: white;
  border-radius: 8px;
  padding: 8px;
  ${(props) => props.theme.fontSize.s18h27};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.subBlue};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.darkBlue};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

export const LinkContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 36px;
`;

export const StyledButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;

  ${(props) => props.theme.fontSize.s14h21}
  &:hover {
    color: ${(props) => props.theme.colors.mainBlue};
  }
`;
