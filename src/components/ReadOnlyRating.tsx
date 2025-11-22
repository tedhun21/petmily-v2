import { Rating } from '@mui/material';
import { PiStar, PiStarFill } from 'react-icons/pi';
import styled from '@emotion/styled';

export default function ReadOnlyRating({ value, size }: { value: number; size: string }) {
  return (
    <StyledRating
      value={value}
      readOnly
      precision={0.1}
      icon={
        <div style={{ position: 'relative', width: size, height: size }}>
          <PiStarFill size={size} style={{ position: 'absolute', clipPath: 'inset(0 0 0 0)' }} />
        </div>
      }
      emptyIcon={<EmptyStarIcon size={size} />}
    />
  );
}

const StyledRating = styled(Rating)`
  & .MuiRating-iconFilled {
    color: ${({ theme }) => theme.colors.text.highlight};
  }

  & .MuiRating-decimal {
    position: relative;
    overflow: hidden;
  }
`;

const EmptyStarIcon = styled(PiStar)`
  color: ${({ theme }) => theme.colors.text.inactive};
`;
