import { HiOutlineLocationMarker } from 'react-icons/hi';
import Box from '@/components/styled/Box';

import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import Button from '@/components/styled/Button';

export default function SuggestLocations({ data, handleLocationClick }: any) {
  return (
    <Flex as="li" direction="column">
      {data?.map((location: string, index: number) => (
        <Button key={index} onClick={(e) => handleLocationClick(e, location)}>
          <Box p="sm" bg="box.default.primary" br="md">
            <HiOutlineLocationMarker size="20px" />
          </Box>
          <Text size="sm" color="white">
            {location}
          </Text>
        </Button>
      ))}
    </Flex>
  );
}
