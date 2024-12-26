import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { Column } from 'styles/commonStyle';
import NavBar from './components/NavBar';
import MeButton from './components/MeButton';

export default function NavHeader() {
  return (
    <Header>
      <HeaderContatiner>
        <TopHeader>
          <Link to="/">
            <img src="/imgs/Logo.svg" alt="logo" />
          </Link>
          <MeButton />
        </TopHeader>
        <NavBar />
      </HeaderContatiner>
    </Header>
  );
}

const Header = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  z-index: 10;
  background-color: inherit;
`;

const HeaderContatiner = styled(Column)`
  justify-content: space-between;
  width: 100%;
  height: 100px;
  gap: 8px;
  padding: 12px 12px 0;
  max-width: 600px;
  box-shadow: ${({ theme }) => theme.shadow.onlyBottom};
`;

const TopHeader = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`;
