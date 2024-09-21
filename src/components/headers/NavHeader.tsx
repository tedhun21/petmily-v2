import { Link } from 'react-router-dom';

import styled from 'styled-components';

import { Column } from 'commonStyle';
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
  display: flex;
  position: sticky;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
`;

const HeaderContatiner = styled(Column)`
  justify-content: space-between;
  width: 100%;
  height: 100px;
  gap: 8px;
  padding: 12px 12px 0;
  background-color: white;
  max-width: 600px;
  box-shadow: ${(props) => props.theme.shadow.onlyBottom};
`;

const TopHeader = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;
