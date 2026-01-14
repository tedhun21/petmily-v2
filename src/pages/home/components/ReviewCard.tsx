import Box from '@/components/styled/Box';
import styled from '@emotion/styled';
import { PiStarFill } from 'react-icons/pi';

import Flex from '@/components/styled/Flex';
import { dateAgo } from '@/utils/date';
import Text from '@/components/styled/Text';
import type { Review } from '@/types/review.type';
import { ImageCentered, RoundedImageWrapper } from '@/styles/commonStyle';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const {
    reservation: { client },
    body,
    star,
  } = review;

  return (
    <Box p="lg" bg="background.box.default.primary" br="lg">
      <Flex direction="column" gap="md">
        <Flex direction="row" justifyContent="space-between" alignItems="flex-start">
          <Flex alignItems="center" gap="xs">
            <ClientImage>
              <ImageCentered
                src={client?.photo ? `${client?.photo}` : '/imgs/DefaultUserProfile.jpg'}
                alt="user_photo"
              />
            </ClientImage>
            <Text size="sm">{client?.nickname.slice(0, 2) + '*****'}</Text>
          </Flex>
          <Flex alignItems="center" gap="xs">
            <PiStarFill size="20px" color="#279EFF" />
            <span>{star}</span>
          </Flex>
        </Flex>
        <Flex direction="column" gap="2xl">
          <ReviewText>{body}</ReviewText>
          <div style={{ textAlign: 'right' }}>
            <Text size="xs">{dateAgo(review.createdAt)}</Text>
          </div>
        </Flex>
      </Flex>
    </Box>
  );
}

const ClientImage = styled(RoundedImageWrapper)`
  width: 46px;
  height: 46px;
  border: 2px solid ${({ theme }) => theme.colors.line.box.active};
`;

const ReviewText = styled.p`
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;

  -webkit-line-clamp: 3; /* 3줄까지만 표시 */
  white-space: pre-wrap;
  word-wrap: break-word;
  ${({ theme }) => theme.typeScale.base}
`;
