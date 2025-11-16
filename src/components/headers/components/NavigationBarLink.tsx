import { useLocation } from 'react-router-dom';

import styled from 'styled-components';
import { INavItem } from './NavigationBar';
import Link from '@components/Link';

interface IProps {
  item: INavItem;
}

export default function NavigationBarLink({ item }: IProps) {
  const { pathname } = useLocation();

  const isSelected = pathname === item.link;

  return (
    <NavLi>
      <CustomLink to={item.link} type="text" $isSelected={isSelected}>
        {item.label}
      </CustomLink>
    </NavLi>
  );
}

const NavLi = styled.li`
  flex: 1;
`;

const CustomLink = styled(Link)<{ $isSelected: boolean }>`
  cursor: ${({ $isSelected }) => ($isSelected ? 'default' : 'pointer')};

  span {
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.text.active : theme.colors.text.inactive)};
    font-weight: ${({ $isSelected, theme }) => ($isSelected ? theme.fontWeight.bold : theme.fontWeight.medium)};
  }

  &:hover span {
    color: ${({ $isSelected, theme }) => ($isSelected ? theme.colors.text.active : theme.colors.text.highlight)};
  }
`;
