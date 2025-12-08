import { useState } from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import styled from '@emotion/styled';
import { PiStar, PiStarFill } from 'react-icons/pi';

interface IProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

const labels: { [index: string]: string } = {
  0.5: '0.5점',
  1: '1점',
  1.5: '1.5점',
  2: '2점',
  2.5: '2.5점',
  3: '3점',
  3.5: '3.5점',
  4: '4점',
  4.5: '4.5점',
  5: '5점',
};

function getLabelText(value: number) {
  return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
}

export default function HoverRating({ value, onChange }: IProps) {
  const [hover, setHover] = useState(-1);

  return (
    <Box
      sx={{
        width: 300,
        display: 'flex',
        alignItems: 'center',
        mt: 1,
      }}
    >
      <StyledRating
        name="customized-color"
        value={value}
        precision={1}
        getLabelText={getLabelText}
        onChange={(_, newValue) => onChange(newValue)}
        onChangeActive={(_, newHover) => {
          setHover(newHover);
        }}
        size="large"
        icon={<PiStarFill size="24px" />}
        emptyIcon={<StyledPiStar size="24px" />}
      />
      {value !== null && <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>}
    </Box>
  );
}

const StyledRating = styled(Rating)`
  & .MuiRating-iconFilled {
    color: ${({ theme }) => theme.colors.background.highlight};
  }

  & .MuiRating-iconHover {
    color: ${({ theme }) => theme.colors.background.deepHighlight};
  }
`;

const StyledPiStar = styled(PiStar)`
  color: ${({ theme }) => theme.colors.text.inactive};
`;
