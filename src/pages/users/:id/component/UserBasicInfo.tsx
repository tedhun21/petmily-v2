import styled from '@emotion/styled';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';
import { UserRole } from '@/types/user.type';
import { PetsitterFeedback } from './PetsitterFeedback';
import { Text } from '@components/styled/Text';
import Box from '@components/styled/Box';
import Flex from '@components/styled/Flex';

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
    <Box w="100%">
      <Flex direction="column" gap="sm">
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
      </Flex>
    </Box>
  );
}

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
