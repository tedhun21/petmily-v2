import styled from 'styled-components';
import { Column, Texts14h20, Texts18h28 } from 'styles/commonStyle';

export default function HomeAd() {
  return (
    <AdContainer>
      <GifContainer src="/imgs/HomeAd.gif" alt="ad" />
      <TextContainer>
        <Image src="/imgs/CatsAndDogs.png" alt="Image" />
        <TextWrapper>
          <InfoText>딩동~</InfoText>
          <AdText>펫시터 방문 케어 서비스</AdText>
        </TextWrapper>
        <AdText>We&apos;re Petmily!</AdText>
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

const AdText = styled(Texts18h28)`
  color: ${({ theme }) => theme.colors.text.active};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const InfoText = styled(Texts14h20)`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const GifContainer = styled.img`
  width: 300px;
`;
