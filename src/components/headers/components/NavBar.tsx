import styled from 'styled-components';

import NavBarLink from '@components/headers/components/NavBarLink';

export interface INavItem {
  id: number;
  label: string;
  link: string;
}

const navItem: INavItem[] = [
  { id: 1, label: '홈', link: '/' },
  { id: 2, label: '검색하기', link: '/search' },
  { id: 3, label: '예약현황', link: '/cares' },
  { id: 4, label: '이용후기', link: '/reviews' },
];

export default function NavBar() {
  return (
    <Nav>
      <List>
        {navItem.map((item: INavItem) => (
          <NavBarLink key={item.id} item={item} />
        ))}
      </List>
    </Nav>
  );
}

const Nav = styled.nav`
  flex: auto;
  width: 100%;
  padding: 0 12px;
`;

const List = styled.ul`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  height: 100%;
`;
