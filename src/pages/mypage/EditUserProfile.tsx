import styled from 'styled-components';
import { PageTitle } from './RegisterPet';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';

import { useForm } from 'react-hook-form';

import UploadProfileImg from '../../components/UploadProfileImg';
import { useEffect, useState } from 'react';
import { IUser, deleteUser } from 'store/userSlice';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { TextField } from '@mui/material';
import DaumPostcode from 'react-daum-postcode';
import { Modal, Sheet } from '@mui/joy';

import { deleteCookie } from 'utils/cookie';
import { deleteMe, getMe, updateMe } from './api';
import { useCustomQuery } from 'hooks/useCustomQuery';
import { Row } from 'commonStyle';
import { useCustomMutation } from 'hooks/useCustomMutation';
import { Loading } from '@components/Loading';

const schema = yup.object().shape({
  nickname: yup
    .string()
    .min(4, '닉네임은 4자 이상이어야 합니다.')
    .matches(/^[a-zA-Z0-9\uac00-\ud7a3]+$/, '닉네임에는 한국어, 영어, 숫자만 허용됩니다.'),
  phone: yup.string().matches(/^010\d{8}$/, '연락처는 010으로 시작하는 11자리 숫자여야 합니다.'),
  address: yup.string(),
  detailAddress: yup.string(),
  body: yup.string(),
});

type IEditUser = yup.InferType<typeof schema>;

export default function EditUserProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [previewImage, setPreviewImage] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { isSuccess, data: me } = useCustomQuery({ queryFn: getMe });
  const { mutate: updateMeMutate, isLoading } = useCustomMutation({
    mutationFn: updateMe,
    onSuccess: () => {
      window.alert('회원 정보가 수정되었습니다.');
      navigate('/mypage');
    },
  });
  const { mutate: deleteMeMutate } = useCustomMutation({
    mutationFn: deleteMe,
    onSuccess: () => {
      window.alert('회원정보가 삭제되었습니다.');
      deleteCookie('access_token');
      navigate('/');
    },
  });

  // 프로필 사진 변경

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
    const splitAddress = data.address.split(' ').splice(2).join(' ');
    if (data) {
      clearErrors('address');
    }
    // Set value using react-hook-form's setValue
    setValue('address', `${data.zonecode} ${data.sido} ${data.sigungu} ${splitAddress}`);
    setIsModalOpen(false);
  };

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

    if (Object.keys(dataToSend).length === 0) {
      return;
    }

    formData.append('data', JSON.stringify(dataToSend));

    if (previewImage) {
      formData.append('file', previewImage);
    }

    updateMeMutate({ id: me.id, formData });
  };

  const handleLogout = () => {
    deleteCookie('access_token');
    // deleteCookie('refresh_token');
    dispatch(deleteUser());
    alert('로그아웃되었습니다.');
    navigate('/');
  };

  const deleteAccount = async () => {
    const isConfirmed = window.confirm('정말 탈퇴하시겠습니까?');
    if (!isConfirmed) return;

    deleteMeMutate({ id: me.id });
  };

  useEffect(() => {
    if (isSuccess && me) {
      setValue('nickname', me.nickname);
      setValue('phone', me.phone);
      setValue('address', me.address);
      setValue('detailAddress', me.detailAddress);
      setValue('body', me.body);
    }
  }, [isSuccess, me]);

  return (
    <main>
      <PageTitle>회원 정보 수정</PageTitle>
      <MainContainer>
        <UploadProfileImg
          serverImageUrl={me?.photo.url}
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
            <Input {...register('nickname')} />
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="phone">연락처</InputLabel>
            <Input {...register('phone')} />
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="address">주소</InputLabel>
            <Input onClick={onToggleModal} onKeyDown={onToggleModal} {...register('address')} />
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
            <Input {...register('detailAddress')} />
          </InputWrapper>
          <InputWrapper>
            <InputLabel htmlFor="body">나의 소개</InputLabel>
            <TextArea {...register('body')} />
          </InputWrapper>
          <SubmitButton disabled={isLoading} type="submit">
            {isLoading ? <Loading size="27px" /> : <span>수정하기</span>}
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

const Info = styled.div`
  ${(props) => props.theme.fontSize.s16h24};
  width: 60%;
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

const Input = styled.input`
  width: 80%;
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

// RegisterPet 같이 사용할 수 있게 수정
export const StyledTextField = styled(TextField)`
  ${(props) => props.theme.fontSize.s14h21}
  width: 60%;
`;

export const ErrorMsg = styled.div`
  color: red;
  display: bolck;
  margin-top: 5px;
  ${(props) => props.theme.fontSize.s14h21}
`;
