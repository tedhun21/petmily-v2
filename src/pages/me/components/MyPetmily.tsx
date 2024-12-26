import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { LuBadgePlus } from 'react-icons/lu';

import { Row, Texts18h27 } from 'styles/commonStyle';
import MyPetContainer from './MyPetContainer';

export default function MyPetmily() {
  return (
    <PetmilyContainer>
      <TitleContainer>
        <Texts18h27>나의 Petmily</Texts18h27>
        <Link to="/me/register">
          <StyledPlusIcon size="32px" />
        </Link>
      </TitleContainer>

      <MyPetContainer />
    </PetmilyContainer>
  );
}

const PetmilyContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TitleContainer = styled(Row)`
  align-items: center;
  justify-content: space-between;
`;

const StyledPlusIcon = styled(LuBadgePlus)`
  color: ${({ theme }) => theme.background.highlight};

  &:hover {
    color: ${({ theme }) => theme.background.deepHighlight};
  }

  &:active {
    color: ${({ theme }) => theme.background.darkHighlight};
  }
`;
