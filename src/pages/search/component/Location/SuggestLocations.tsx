import { HiOutlineLocationMarker } from 'react-icons/hi';
import Box from '@components/Box';
import { Button } from '@components/buttons/Button';
import { Text } from '@components/Text';
import { Flex } from '@components/Flex';

export default function SuggestLocations({ data, handleLocationClick }: any) {
  return (
    <Flex as="li" direction="column">
      {data?.map((location: string, index: number) => (
        // TODO
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
