import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import DaumPostcode from 'react-daum-postcode';

import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { Modal, Sheet } from '@mui/joy';

import { Column, ErrorMessage, Row, Texts20h30 } from 'commonStyle';

import UploadProfileImg from '../../components/UploadProfileImg';
import { deleteCookie } from 'utils/cookie';
import { TitleContainer } from './CreatePet';

import { deleterWithCookie, fetcherWithCookie, updaterWithCookie } from 'api';
import Loading from '@components/Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = yup.object().shape({
  nickname: yup
    .string()
    .min(4, '닉네임은 4자 이상이어야 합니다.')
    .matches(/^[a-zA-Z0-9\uac00-\ud7a3\s]+$/, '닉네임에는 한국어, 영어, 숫자, 공백만 허용됩니다.'),
  phone: yup
    .string()
    .nullable()
    .matches(/^010\d{8}$/, '연락처는 010으로 시작하는 11자리 숫자여야 합니다.'),
  address: yup.string().nullable(),
  detailAddress: yup.string().nullable(),
  body: yup.string().nullable(),
});

type IEditUser = yup.InferType<typeof schema>;

const API_URL = process.env.REACT_APP_API_URL;

export default function EditMe() {
  const navigate = useNavigate();

  const notify = () => {
    toast.success('Success Notification !', { position: 'top-center' });
  };

  const [previewImage, setPreviewImage] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      toast.error('회원을 삭제하였습니다!');
      deleteCookie('access_token');
      navigate('/');
    },
  });

  const {
    register,
    clearErrors,
    setValue,
    handleSubmit,
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

  // 회원 정보 수정
  const onSubmit = async (data: IEditUser) => {
    const { nickname, phone, address, detailAddress, body } = data;

    const dataToSend = {} as any;
    if (nickname !== undefined) {
      dataToSend.nickname = nickname;
    }
    if (phone !== undefined) {
      dataToSend.phone = phone;
    }
    if (address !== undefined) {
      dataToSend.address = address;
    }
    if (detailAddress !== undefined) {
      dataToSend.detailAddress = detailAddress;
    }
    if (body !== undefined) {
      dataToSend.body = body;
    }

    const formData = new FormData();

    formData.append('data', JSON.stringify(dataToSend));

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
    }
  }, [isLoading, me]);

  console.log(errors);

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
            <span id="email">{me?.email}</span>
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
            {isModalOpen && (
              <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Sheet sx={{ width: '360px;' }}>
                  <DaumPostcode onComplete={handleComplete} />
                </Sheet>
              </Modal>
            )}
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
  padding: 0 80px;
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

const TextArea = styled.textarea`
  width: 80%;
  border: 2px solid ${(props) => props.theme.colors.mainBlue};
  border-radius: 8px;
  padding: 8px;
  ${(props) => props.theme.fontSize.s16h24}
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
