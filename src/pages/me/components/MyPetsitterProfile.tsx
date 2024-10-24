import styled from 'styled-components';

import { Texts18h27 } from 'commonStyle';
import MyPetsitterSettings from './MyPetistterSetting';
import MySchedule from './MySchedule';

export default function MyPetsitterProfile({ me }: any) {
  return (
    <PetsitterContainer>
      <article>
        <Texts18h27>나의 설정</Texts18h27>
        <MyPetsitterSettings me={me} />
      </article>

      <article>
        <Texts18h27>나의 스케쥴</Texts18h27>
        <MySchedule />
      </article>
    </PetsitterContainer>
  );
}

const PetsitterContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
