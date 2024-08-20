import { PulseLoader } from 'react-spinners';
import styled from 'styled-components';

export default function LoadingFallback() {
  return (
    <Container>
      <Loader loading={true} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const Loader = styled(PulseLoader)`
  display: flex;
  color: ${({ theme }) => theme.colors.mainBlue};
`;
