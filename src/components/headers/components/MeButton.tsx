import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useAuthSWRMutation } from '@/hooks/authSWR';
import styled from '@emotion/styled';

import { poster } from '@/api';
import type { User } from '@/types/user.type';
import { clearAccessToken } from '@/store/slices/authSlice';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import Button from '@/components/styled/Button';
import Link from '@/components/styled/Link';
import Popover from '@/components/Popover';
import Box from '@/components/styled/Box';

interface IProps {
  me?: User;
}

export default function MeButton({ me }: IProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { trigger } = useAuthSWRMutation('/auth/logout', poster, {
    onSuccess: () => {
      dispatch(clearAccessToken());
      toast.success('로그아웃 되었어요.');
      navigate('/');
    },
    onError: () => {
      toast.error('로그아웃에 실패했어요. 다시 시도해주세요.');
      dispatch(clearAccessToken());
      navigate('/');
    },
  });

  // 로그아웃 처리
  const handleLogout = async () => {
    await trigger();
  };

  return (
    <Popover placement="bottom-end" offset={8}>
      <Popover.Trigger>
        <UserImage>
          <ImageCentered src={me?.photo ? `${me?.photo}` : '/imgs/DefaultUserProfile.jpg'} alt="user_photo" />
        </UserImage>
      </Popover.Trigger>

      <Popover.Content>
        <Box as="nav" p="sm" bgColor="background.box.default.primary" br="md" shadow="dp03">
          <Link to="/me" variant="button" btnVariant="transparent" borderRadius="sm">
            내 정보
          </Link>
          <Button type="button" onClick={handleLogout} variant="transparent" borderRadius="sm">
            로그아웃
          </Button>
        </Box>
      </Popover.Content>
    </Popover>
  );
}

const UserImage = styled(RoundedImageWrapper)`
  width: 40px;
  height: 40px;

  padding: 2px;
  border: 2px solid ${({ theme }) => theme.colors.background.box.accent.primary};
  border-radius: ${({ theme }) => theme.radius.circle};
`;
