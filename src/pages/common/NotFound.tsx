import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Text } from '@components/Text';
import { Flex } from '@components/Flex';

export default function NotFoundPage() {
  return (
    <Flex direction="column" justifyContent="center" alignItems="center">
      <Flex justifyContent="flex-end">
        <Icon src="/imgs/NotFound.svg" alt="sorry" />
      </Flex>
      <Image src="/imgs/404.svg" alt="Page not found" />
      <Text size="xl" color="inverse" weight="bold">
        요청하신 페이지를 찾을 수 없습니다.
      </Text>
      <Link to="/">
        <span>홈으로 이동</span>
      </Link>
      <Link to="/">
        <Logo src="/imgs/Petmily.svg" alt="Logo" />
      </Link>
    </Flex>
  );
}

const Icon = styled.img`
  width: 60px;
`;

const Image = styled.img`
  width: 200px;
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`;

const Logo = styled.img`
  width: 100px;
  margin-top: ${({ theme }) => theme.spacing['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing['3xl']};
`;
