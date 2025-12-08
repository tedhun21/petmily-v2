import { MdOutlineRateReview } from "react-icons/md";

import ReadOnlyRating from "@/components/ReadOnlyRating";
import Flex from "@/components/styled/Flex";

interface IProps {
  star: number | null;
  reviewCount: number | null;
}

export function PetsitterFeedback({ star, reviewCount }: IProps) {
  // 별점, 리뷰
  return (
    <Flex alignItems="center" gap="4xl">
      <Flex direction="column" alignItems="center" gap="sm">
        <span>{star}</span>
        <ReadOnlyRating size="20px" value={star || 0} />
      </Flex>
      <Flex direction="column" alignItems="center" gap="sm">
        <span>{reviewCount}</span>
        <MdOutlineRateReview size="16px" />
      </Flex>
    </Flex>
  );
}
