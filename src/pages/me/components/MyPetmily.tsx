import styled from 'styled-components';

import { LuBadgePlus } from 'react-icons/lu';

import MyPetContainer from './MyPetContainer';
import { Text } from '@components/Text';
import { Flex } from '@components/Flex';
import Link from '@components/Link';

export default function MyPetmily() {
  return (
    <section>
      <Flex justifyContent="space-between" alignItems="center">
        <Text size="lg">나의 Petmily</Text>
        <Link to="/me/pet/register" type="icon">
          <StyledPlusIcon size="28px" />
        </Link>
      </Flex>

      <MyPetContainer />
    </section>
  );
}

const StyledPlusIcon = styled(LuBadgePlus)`
  color: ${({ theme }) => theme.colors.text.highlight};
`;
