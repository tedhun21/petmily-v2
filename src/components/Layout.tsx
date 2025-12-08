import styled from '@emotion/styled';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <Container>
      <Wrapper>
        <Outlet />
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
`;

const Wrapper = styled.div`
  flex: auto;
  width: 100%;
  max-width: 600px;
  background-color: ${({ theme }) => theme.colors.background.primary};
`;
