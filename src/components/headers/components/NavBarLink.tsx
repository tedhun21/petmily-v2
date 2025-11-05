import { useLocation, Link } from 'react-router-dom';

import styled from 'styled-components';
import { INavItem } from './NavBar';

interface IProps {
  item: INavItem;
}

export default function NavBarLink({ item }: IProps) {
  const { pathname } = useLocation();
  const isClickable = pathname !== item.link;

  return (
    <NavLi $isClickable={isClickable}>
      <CustomLink to={item.link} $isClickable={isClickable}>
        {item.label}
      </CustomLink>
    </NavLi>
  );
}

const NavLi = styled.li<{ $isClickable: boolean }>`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  border-bottom: ${({ $isClickable, theme }) => ($isClickable ? '' : `2px solid ${theme.colors.line.box.highlight}`)};
`;

const CustomLink = styled(Link)<{ $isClickable: boolean }>`
  padding: 6px 8px;
  border-radius: ${({ theme }) => theme.radius.md};
  color: ${({ $isClickable, theme }) => ($isClickable ? theme.colors.text.inactive : theme.colors.text.active)};
  cursor: ${({ $isClickable }) => ($isClickable ? 'pointer' : 'default')};
  pointer-events: ${({ $isClickable }) => ($isClickable ? 'auto' : 'none')};a
  ${({ theme }) => theme.typeScale.sm};

  &:hover {
    background-color: ${({ theme, $isClickable }) => $isClickable && theme.colors.background.box.default.hover};
  }

  &:visited {
    text-decoration: none;
  }
`;
