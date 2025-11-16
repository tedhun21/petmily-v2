import styled from 'styled-components';
import { Flex, flex } from '@components/Flex';
import { Text } from '@components/Text';
import Box from '@components/Box';

export default function HomeAd() {
  return (
    <section>
      <Flex gap="sm">
        <GifContainer src="/imgs/HomeAd.gif" alt="ad" />

        <Wrapper>
          <Image src="/imgs/CatsAndDogs.png" alt="Image" />

          <Text size="sm" weight="bold" color="secondary">
            딩동~
          </Text>
          <Text size="lg" weight="bold">
            펫시터 방문 케어 서비스
          </Text>
          <Text>We&apos;re Petmily!</Text>
        </Wrapper>
      </Flex>
    </section>
  );
}

const Wrapper = styled(Box).attrs(() => ({
  w: '100%',
}))`
  ${flex({
    direction: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  })}
`;

const Image = styled.img`
  width: 80px;
`;

const GifContainer = styled.img`
  width: 300px;
`;
