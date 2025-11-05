import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { LuBadgePlus } from 'react-icons/lu';

import { Row, Texts18h28 } from 'styles/commonStyle';
import MyPetContainer from './MyPetContainer';
import { Button } from '@components/buttons/Button';

export default function MyPetmily() {
  return (
    <PetmilyContainer>
      <TitleContainer>
        <Texts18h28>나의 Petmily</Texts18h28>
        <Button as={Link} to="/me/pet/register" $variant="icon" $borderRadius="circle">
          <StyledPlusIcon size="28px" />
        </Button>
      </TitleContainer>

      <MyPetContainer />
    </PetmilyContainer>
  );
}

const PetmilyContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TitleContainer = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

const StyledPlusIcon = styled(LuBadgePlus)`
  color: ${({ theme }) => theme.colors.text.highlight};
`;
