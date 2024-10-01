import styled from 'styled-components';

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
        <AdText color="#279eff">We&apos;re Petmily!</AdText>
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

const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
`;

const AdText = styled.div`
  color: ${(props) => props.color || 'black'};
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
  font-size: 18px;
`;

const InfoText = styled.div`
  color: #a9a9a9;
  font-weight: ${(props) => props.theme.fontWeights.extrabold};
  font-size: 14px;
`;
const GifContainer = styled.img`
  width: 300px;
`;
