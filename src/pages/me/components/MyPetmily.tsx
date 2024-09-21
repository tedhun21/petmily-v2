import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { LuBadgePlus } from 'react-icons/lu';

import { Row, Texts18h27 } from 'commonStyle';
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
  justify-content: space-between;
  align-items: center;
`;

const StyledPlusIcon = styled(LuBadgePlus)`
  color: ${(props) => props.theme.colors.mainBlue};

  &:hover {
    color: ${(props) => props.theme.colors.subBlue};
  }

  &:active {
    color: ${(props) => props.theme.colors.darkBlue};
  }
`;
