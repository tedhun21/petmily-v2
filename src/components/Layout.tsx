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
  min-height: 100vh;
`;

const Wrapper = styled.div`
  width: 100%;
  min-width: 360px;
  max-width: 600px;
  background-color: ${({ theme }) => theme.colors.background.layer0};

  padding-bottom: var(--safe-area-bottom, 0px);
`;
