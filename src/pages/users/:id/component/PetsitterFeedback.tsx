import ReadOnlyRating from '@components/ReadOnlyRating';
import { MdOutlineRateReview } from 'react-icons/md';
import styled from 'styled-components';
import { Row } from 'styles/commonStyle';

interface IProps {
  star: number | null;
  reviewCount: number | null;
}

export function PetsitterFeedback({ star, reviewCount }: IProps) {
  // 별점, 리뷰
  return (
    <Wrapper>
      <Item>
        <span>{star}</span>
        <ReadOnlyRating size="20px" value={star || 0} />
      </Item>
      <Item>
        <span>{reviewCount}</span>
        <MdOutlineRateReview size="16px" />
      </Item>
    </Wrapper>
  );
}

const Wrapper = styled(Row)`
  align-items: center;
  width: 100%;
  gap: 40px;
`;

const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;
