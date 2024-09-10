import { useLocation, Link } from 'react-router-dom';

import styled from 'styled-components';

export default function NavBarLink({ item }: any) {
  const { pathname } = useLocation();
  const isActive = pathname === item.link;

  return (
    <NavLi isActive={isActive}>
      <CustomLink to={item.link} isActive={isActive}>
        <LinkLabel>{item.label}</LinkLabel>
      </CustomLink>
    </NavLi>
  );
}

const NavLi = styled.li<{ isActive: boolean }>`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: ${({ isActive, theme }) => (isActive ? `2px solid ${theme.colors.mainBlue}` : '')};
`;

const CustomLink = styled(Link)<{ isActive: boolean }>`
  color: ${({ isActive, theme }) => (isActive ? theme.colors.black : theme.textColors.gray30)};
  font-weight: ${({ isActive, theme }) => (isActive ? theme.fontWeights.extrabold : theme.fontWeights.bold)};

  &:visited {
    text-decoration: none;
  }
`;

const LinkLabel = styled.span`
  ${(props) => props.theme.fontSize.s14h21};
  padding: 4px 8px;

  border-radius: 8px;
  &:hover {
    background-color: ${(props) => props.theme.colors.gray};
  }
`;
