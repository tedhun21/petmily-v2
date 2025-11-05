import styled from 'styled-components';

import TopHeader from './TopHeader';
import NavBar from './components/NavBar';
import { Column } from 'styles/commonStyle';

export default function NavHeader() {
  return (
    <Header>
      <HeaderContatiner>
        <TopHeader />
        <NavBar />
      </HeaderContatiner>
    </Header>
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
