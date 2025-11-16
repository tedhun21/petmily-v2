import styled from 'styled-components';

import TopHeader from './TopHeader';
import NavigationBar from './components/NavigationBar';

export default function NavigationHeader() {
  return (
    <Header>
      <TopHeader />
      <NavigationBar />
    </Header>
  );
}

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  width: 100%;
  background-color: inherit;
`;
