import { Texts12h18 } from 'styles/commonStyle';
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
      <Title>예약 단계</Title>
      <PageNumber>{currentStep}/4</PageNumber>
    </Header>
  );
}

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: ${({ theme }) => theme.background.secondary};
`;

const Title = styled(Texts12h18)`
  font-weight: ${({ theme }) => theme.fontWeight.extrabold};
`;

const PageNumber = styled(Texts12h18)`
  font-weight: ${({ theme }) => theme.fontWeight.light};
`;

export const BackArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  cursor: pointer;
`;
