import { HiOutlineLocationMarker } from 'react-icons/hi';
import Box from '@/components/styled/Box';

import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import Button from '@/components/styled/Button';

interface IProps {
  data: string[];
  handleSetValue: (value: string, search: boolean) => void;
}

export default function SuggestLocations({ data, handleSetValue }: IProps) {
  return (
    <Flex as="li" direction="column">
      {data?.map((location: string, index: number) => (
        <Button key={index} onClick={() => handleSetValue(location, false)}>
          <Box p="sm" bgColor="box.default.primary" br="md">
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
