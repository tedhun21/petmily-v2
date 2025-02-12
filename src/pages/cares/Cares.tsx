import styled from 'styled-components';
import CareContainer from './component/CareContainer';
import NavHeader from '@components/headers/NavHeader';

export default function Cares() {
  return (
    <>
      <NavHeader />

      <Main>
        <CareContainer />
      </Main>
    </>
  );
}

const Main = styled.main`
  padding: 12px;
  height: 100%;
`;
