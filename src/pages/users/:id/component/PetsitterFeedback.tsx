import { MdOutlineRateReview } from 'react-icons/md';

import ReadOnlyRating from '@/components/ReadOnlyRating';
import Flex from '@/components/styled/Flex';

interface IProps {
  totalStarSum: number | null;
  reviewCount: number | null;
}

export function PetsitterFeedback({ totalStarSum, reviewCount }: IProps) {
  const average =
    typeof totalStarSum === 'number' && typeof reviewCount === 'number' && reviewCount > 0
      ? Math.round((totalStarSum / reviewCount) * 10) / 10
      : null;
  return (
    <Flex alignItems="center" gap="4xl">
      <Flex direction="column" alignItems="center" gap="sm">
        <span>{average}</span>
        <ReadOnlyRating size="20px" value={average || 0} />
      </Flex>
      <Flex direction="column" alignItems="center" gap="sm">
        <span>{reviewCount}</span>
        <MdOutlineRateReview size="16px" />
      </Flex>
    </Flex>
  );
}
