import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { BlueButton, Column, Row, Texts20h28 } from 'styles/commonStyle';

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

const Page = styled(Row)`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const Container = styled(Column)`
  justify-content: center;
  align-items: center;
`;

const IconContainer = styled(Row)`
  justify-content: flex-end;
  width: 100%;
`;

const Icon = styled.img`
  width: 60px;
`;

const Image = styled.img`
  width: 200px;
  margin-bottom: ${({ theme }) => theme.spacing._3xl};
`;

const Info = styled(Texts20h28)`
  color: ${({ theme }) => theme.colors.text.inactive};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const Logo = styled.img`
  width: 100px;
  margin-top: ${({ theme }) => theme.spacing._3xl};
  margin-bottom: ${({ theme }) => theme.spacing._3xl};
`;
