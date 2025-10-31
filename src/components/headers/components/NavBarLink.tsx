import { useLocation, Link } from 'react-router-dom';

import styled from 'styled-components';
import { INavItem } from './NavBar';
import { Texts12h16 } from 'styles/commonStyle';

interface NavBarLinkProps {
  item: INavItem;
}

export default function NavBarLink({ item }: NavBarLinkProps) {
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
  flex: 1;
  justify-content: center;
  align-items: center;
  border-bottom: ${({ $isActive, theme }) => ($isActive ? `2px solid ${theme.colors.line.box.highlight}` : '')};
`;

const CustomLink = styled(Link)<{ $isActive: boolean }>`
  font-weight: ${({ $isActive, theme }) => ($isActive ? theme.typeScale._2xl : theme.typeScale.xl)};

  &:visited {
    text-decoration: none;
  }
`;

const LinkLabel = styled(Texts12h16)<{ $isActive: boolean }>`
  padding: 6px 8px;
  border-radius: ${({ theme }) => theme.radius.base};
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.text.active : theme.colors.text.inactive)};

  &:hover {
    background-color: ${({ theme, $isActive }) => !$isActive && theme.colors.background.box.default.hover};
  }
`;
