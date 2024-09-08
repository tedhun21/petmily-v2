import { IoArrowBackOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface IStatusProps {
  currentStep: number;
  onPrevious: () => void;
}

export default function StatusHeader({ currentStep, onPrevious }: IStatusProps) {
  const navigate = useNavigate();
  const handleBackPage = () => {
    navigate(-1);
  };
  return (
    <Header>
      <BackArrowButton type="button" onClick={currentStep === 1 ? handleBackPage : onPrevious}>
        <IoArrowBackOutline size="16px" />
      </BackArrowButton>
      <Title>예약</Title>
      <PageNumber>{currentStep}/3</PageNumber>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) => props.theme.textColors.secondary};
  padding: 16px;
`;

const Title = styled.span`
  ${(props) => props.theme.fontSize.s12h18};
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
`;

const PageNumber = styled.span`
  ${(props) => props.theme.fontSize.s12h18};
  font-weight: ${(props) => props.theme.fontWeights.light};
`;

export const BackArrowButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
