import styled from 'styled-components';

import BackButton from '@components/buttons/BackButton';

export default function BackHeader() {
  return (
    <Container>
      <BackButton />
    </Container>
  );
}

const Container = styled.header`
  display: flex;
  align-item: center;
  width: 100%;
  height: 64px;
  padding: 20px;
`;
