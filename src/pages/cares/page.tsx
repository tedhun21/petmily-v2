import styled from 'styled-components';
import CareContainer from './component/CareContainer';
import NavHeader from '@components/headers/NavHeader';
import CareFilter from '@pages/cares/component/CareFilter';

export default function CaresPage() {
  return (
    <>
      <NavHeader />

      <Main>
        <CareFilter />
        <CareContainer />
      </Main>
    </>
  );
}

const Main = styled.main`
  height: 100%;
`;
