import styled from "@emotion/styled";
import { Text } from "@/components/styled/Text";
import Box from "@/components/styled/Box";
import Flex from "@/components/styled/Flex";

export default function HomeAd() {
  return (
    <section>
      <Flex gap="sm">
        <GifContainer src="/imgs/HomeAd.gif" alt="ad" />

        <Box w="100%">
          <Flex
            direction="column"
            justifyContent="space-around"
            alignItems="center"
          >
            <Image src="/imgs/CatsAndDogs.png" alt="Image" />

            <Text size="sm" weight="bold" color="secondary">
              딩동~
            </Text>
            <Text size="lg" weight="bold">
              펫시터 방문 케어 서비스
            </Text>
            <Text>We&apos;re Petmily!</Text>
          </Flex>
        </Box>
      </Flex>
    </section>
  );
}

const Image = styled.img`
  width: 80px;
`;

const GifContainer = styled.img`
  width: 300px;
`;
