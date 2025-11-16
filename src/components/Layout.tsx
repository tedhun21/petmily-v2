import { Outlet } from 'react-router-dom';
import { styled } from 'styled-components';

const Layout = () => {
  return (
    <Container>
      <Wrapper>
        <Outlet />
      </Wrapper>
    </Container>
  );
};

export default Layout;

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 600px;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.active};
`;
