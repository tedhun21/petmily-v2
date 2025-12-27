import { useLocation } from 'react-router-dom';

import styled from '@emotion/styled';
import type { INavItem } from './NavigationBar';
import Link from '@/components/styled/Link';
import Flex from '@/components/styled/Flex';

interface IProps {
  item: INavItem;
}

export default function NavigationBarLink({ item }: IProps) {
  const { pathname } = useLocation();

  const isSelected = pathname === item.link;

  return (
    <Flex as="li" justifyContent="center" alignItems="center" css={{ flex: 1 }}>
      <CustomLink to={item.link} type="text" $selected={isSelected}>
        {item.label}
      </CustomLink>
    </Flex>
  );
}

const CustomLink = styled(Link)<{ $selected: boolean }>`
  cursor: ${({ $selected }) => ($selected ? 'default' : 'pointer')};

  color: ${({ $selected, theme }) => ($selected ? theme.colors.text.primary : theme.colors.text.secondary)};
  font-weight: ${({ $selected, theme }) => ($selected ? theme.fontWeight.medium : theme.fontWeight.normal)};

  &:hover:not(:disabled) {
    color: ${({ $selected, theme }) => ($selected ? theme.colors.text.primary : theme.colors.text.accent)};
  }
`;
