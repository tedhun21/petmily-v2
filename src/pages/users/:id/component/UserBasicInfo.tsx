import styled from 'styled-components';
import { ImageCentered, RoundedImageWrapper } from 'styles/commonStyle';
import { UserRole } from 'types/user.type';
import { PetsitterFeedback } from './PetsitterFeedback';
import { Text } from '@components/Text';
import Box from '@components/Box';
import { flex, Flex } from '@components/Flex';

interface IProps {
  role: UserRole;
  nickname: string | null;
  photo: string | null;
  body: string | null;
  star: number | null;
  reviewCount: number | null;
}

export default function UserBasicInfo({ role, nickname, photo, body, star, reviewCount }: IProps) {
  return (
    <Container>
      <Flex gap="lg">
        <UserImage>
          <ImageCentered src={photo ?? '/imgs/DefaultUserProfile.jpg'} alt="user_photo" />
        </UserImage>
        <Div>
          <Text size="base">{role === UserRole.PETSITTER ? `펫시터: ${nickname} 님` : `${nickname} 님`}</Text>
          <PetsitterFeedback star={star} reviewCount={reviewCount} />
        </Div>
      </Flex>
      <Body>{body}</Body>
    </Container>
  );
}

const Container = styled(Box).attrs(() => ({
  w: '100%',
}))`
  ${flex({ direction: 'column', gap: 'sm' })}
`;

const UserImage = styled(RoundedImageWrapper)`
  width: 80px;
  height: 80px;
`;

// TODO
const Div = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const Body = styled.p`
  ${({ theme }) => theme.typeScale.sm};
`;
