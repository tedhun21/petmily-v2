import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BlueButton } from 'styles/commonStyle';

export default function NotFoundPage() {
  return (
    <Page>
      <Container>
        <IconContainer>
          <Icon src="/imgs/NotFound.svg" alt="sorry" />
        </IconContainer>
        <Image src="/imgs/404.svg" alt="Page not found" />
        <Info>요청하신 페이지를 찾을 수 없습니다.</Info>
        <Link to="/">
          <BlueButton>홈으로 이동</BlueButton>
        </Link>
        <Link to="/">
          <Logo src="/imgs/Petmily.svg" alt="Logo" />
        </Link>
      </Container>
    </Page>
  );
}

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
`;

const Icon = styled.img`
  width: 60px;
`;

const Image = styled.img`
  width: 200px;
  margin-bottom: 36px;
`;

const Info = styled.div`
  color: #949494;
  font-weight: 800;
  font-size: 20px;
`;

const Logo = styled.img`
  width: 100px;
  margin-top: 36px;
  margin-bottom: 36px;
`;
