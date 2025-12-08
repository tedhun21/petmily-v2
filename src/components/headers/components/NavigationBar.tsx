import NavigationBarLink from '@/components/headers/components/NavigationBarLink';
import Flex from '@/components/styled/Flex';
import Box from '@/components/styled/Box';

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

export default function NavigationBar() {
  return (
    <Box as="nav" w="100%" px="lg" py="md" shadow="onlyBottom">
      <Flex as="ul" justifyContent="space-between" gap="xl">
        {navItem.map((item: INavItem) => (
          <NavigationBarLink key={item.id} item={item} />
        ))}
      </Flex>
    </Box>
  );
}
