import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { LuBadgePlus } from 'react-icons/lu';

import { Column, Row } from 'styles/commonStyle';
import MyPetContainer from './MyPetContainer';
import { Button } from 'styles/common/Button';
import { Text } from 'styles/common/Text';

export default function MyPetmily() {
  return (
    <PetmilyContainer as="section">
      <TitleContainer>
        <Text $size="lg">나의 Petmily</Text>
        <Button as={Link} to="/me/pet/register" $variant="icon" $borderRadius="circle">
          <StyledPlusIcon size="28px" />
        </Button>
      </TitleContainer>

      <MyPetContainer />
    </PetmilyContainer>
  );
}

const PetmilyContainer = styled(Column)`
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TitleContainer = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

const StyledPlusIcon = styled(LuBadgePlus)`
  color: ${({ theme }) => theme.colors.text.highlight};
`;
