import styled from 'styled-components';

import { Texts18h28 } from 'styles/commonStyle';
import MyPetsitterSettings from './MyPetistterSetting';
import MySchedule from './MySchedule';
import { User } from 'types/user.type';

interface MyPetsitterProfileProps {
  me: User;
}

export default function MyPetsitterProfile({ me }: MyPetsitterProfileProps) {
  return (
    <PetsitterContainer>
      <article>
        <Texts18h28>나의 설정</Texts18h28>
        <MyPetsitterSettings petsitter={me} />
      </article>

      <article>
        <Texts18h28>나의 스케쥴</Texts18h28>
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
