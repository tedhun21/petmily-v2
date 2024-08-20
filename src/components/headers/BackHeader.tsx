import { useSelector } from 'react-redux';
import { IUser } from 'store/userSlice';

import BackButton from '@components/buttons/BackButton';
import styled from 'styled-components';

export default function BackHeader() {
  const { isLogin } = useSelector((state: IUser) => state.user);

  return (
    <Container>
      <BackButton></BackButton>
    </Container>
  );
}

const Container = styled.header`
  width: 100%;
  height: 64px;
  padding: 12px;
  background-color: white;
`;
