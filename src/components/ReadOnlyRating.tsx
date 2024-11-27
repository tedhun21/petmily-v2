import { Rating } from '@mui/material';
import { PiStar, PiStarFill } from 'react-icons/pi';
import styled from 'styled-components';

export default function CustomRating({ value }: { value: number }) {
  return (
    <StyledRating
      value={value}
      readOnly
      precision={0.1}
      icon={
        <div style={{ position: 'relative', width: '20px', height: '20px' }}>
          <PiStarFill size="20px" style={{ position: 'absolute', clipPath: 'inset(0 0 0 0)' }} />
        </div>
      }
      emptyIcon={<StyledPiStar size="20px" />}
    />
  );
}

const StyledRating = styled(Rating)`
  & .MuiRating-iconFilled {
    color: ${({ theme }) => theme.text.highlight};
  }


  & .MuiRating-decimal {
    position: 'relative',
    overflow: 'hidden',
  },
`;

const StyledPiStar = styled(PiStar)`
  color: ${({ theme }) => theme.text.inactive};
`;
