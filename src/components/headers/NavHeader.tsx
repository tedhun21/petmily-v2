import { useLocation } from 'react-router-dom';

import styled from 'styled-components';

import { Column } from 'styles/commonStyle';
import NavBar from './components/NavBar';
import SearchBox from './SearchBox';
import Filter from './Filter';
import TopHeader from './components/TopHeader';

export default function NavHeader() {
  const { pathname } = useLocation();

  return (
    <>
      <Header>
        <HeaderContatiner>
          <TopHeader />
          <NavBar />
        </HeaderContatiner>
      </Header>
      {pathname === '/search' && <SearchBox />}
      {pathname === '/cares' && <Filter />}
    </>
  );
}

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  background-color: inherit;
`;

const HeaderContatiner = styled(Column)`
  justify-content: space-between;
  width: 100%;
  height: 112px;
  box-shadow: ${({ theme }) => theme.shadow.onlyBottom};
`;
