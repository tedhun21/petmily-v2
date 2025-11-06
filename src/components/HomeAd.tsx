import styled from 'styled-components';
import { Text } from 'styles/common/Text';
import { Column } from 'styles/commonStyle';

export default function HomeAd() {
  return (
    <AdContainer>
      <GifContainer src="/imgs/HomeAd.gif" alt="ad" />
      <TextContainer>
        <Image src="/imgs/CatsAndDogs.png" alt="Image" />
        <TextWrapper>
          <Text $size="sm" $weight="bold" $color="secondary">
            딩동~
          </Text>
          <Text $size="lg" $weight="bold">
            펫시터 방문 케어 서비스
          </Text>
        </TextWrapper>
        <Text $size="sm" $weight="bold">
          We&apos;re Petmily!
        </Text>
      </TextContainer>
    </AdContainer>
  );
}

const AdContainer = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  height: auto;
`;

const Image = styled.img`
  width: 80px;
`;

const TextWrapper = styled(Column)`
  gap: ${({ theme }) => theme.spacing.sm};
`;

const TextContainer = styled(Column)`
  justify-content: center;
  align-items: center;
  gap: ${({ theme }) => theme.spacing._2xl};
`;

const GifContainer = styled.img`
  width: 300px;
`;
