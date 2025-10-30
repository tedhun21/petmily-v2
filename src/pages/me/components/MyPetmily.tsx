import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { LuBadgePlus } from 'react-icons/lu';

import { Row, Texts18h28 } from 'styles/commonStyle';
import MyPetContainer from './MyPetContainer';

export default function MyPetmily() {
  return (
    <PetmilyContainer>
      <TitleContainer>
        <Texts18h28>나의 Petmily</Texts18h28>
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
  justify-content: space-between;
  align-items: center;
`;

const StyledPlusIcon = styled(LuBadgePlus)`
  color: ${({ theme }) => theme.colors.background.highlight};

  &:hover {
    color: ${({ theme }) => theme.colors.background.deepHighlight};
  }

  &:active {
    color: ${({ theme }) => theme.colors.background.darkHighlight};
  }
`;
