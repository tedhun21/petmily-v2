import { Texts12h18 } from 'styles/commonStyle';
import { useLocation, Link } from 'react-router-dom';

import styled from 'styled-components';

export default function NavBarLink({ item }: any) {
  const { pathname } = useLocation();
  const isActive = pathname === item.link;

  return (
    <NavLi $isActive={isActive}>
      <CustomLink to={item.link} $isActive={isActive}>
        <LinkLabel $isActive={isActive}>{item.label}</LinkLabel>
      </CustomLink>
    </NavLi>
  );
}

const NavLi = styled.li<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  border-bottom: ${({ $isActive, theme }) => ($isActive ? `2px solid ${theme.line.box.highlight}` : '')};
`;

const CustomLink = styled(Link)<{ $isActive: boolean }>`
  font-weight: ${({ $isActive, theme }) => ($isActive ? theme.fontWeight.extrabold : theme.fontWeight.bold)};

  &:visited {
    text-decoration: none;
  }
`;

const LinkLabel = styled(Texts12h18)<{ $isActive: boolean }>`
  padding: 6px 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  color: ${({ $isActive, theme }) => ($isActive ? theme.text.active : theme.text.inactive)};

  &:hover {
    background-color: ${({ theme, $isActive }) => !$isActive && theme.background.box.default.hover};
  }
`;
