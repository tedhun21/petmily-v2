import { Title } from "@/styles/commonStyle";
import BackButton from "@/components/buttons/BackButton";
import Box from "@/components/styled/Box";
import Flex from "@/components/styled/Flex";

interface IProps {
  title?: string;
  link?: string;
}

export default function BackHeader({ title, link }: IProps) {
  return (
    <Box as="header" w="100%" p="xl">
      <Flex alignItems="center" gap="xl">
        <BackButton link={link} />
        <Title>{title}</Title>
      </Flex>
    </Box>
  );
}
