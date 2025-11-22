import { useLocation } from 'react-router-dom';

import styled from '@emotion/styled';
import { INavItem } from './NavigationBar';
import Link from '@components/styled/Link';
import Flex from '@components/styled/Flex';

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

  color: ${({ $selected, theme }) => ($selected ? theme.colors.text.active : theme.colors.text.inactive)};
  font-weight: ${({ $selected, theme }) => ($selected ? theme.fontWeight.bold : theme.fontWeight.medium)};

  &:hover:not(:disabled) {
    color: ${({ $selected, theme }) => ($selected ? theme.colors.text.active : theme.colors.text.highlight)};
  }
`;
