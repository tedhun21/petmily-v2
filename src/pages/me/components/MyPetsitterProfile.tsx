import styled from 'styled-components';

import MyPetsitterSettings from './MyPetistterSetting';
import MySchedule from './MySchedule';
import { User } from 'types/user.type';
import { Text } from 'styles/common/Text';

interface MyPetsitterProfileProps {
  me: User;
}

export default function MyPetsitterProfile({ me }: MyPetsitterProfileProps) {
  return (
    <PetsitterContainer>
      <article>
        <Text $size="lg">나의 설정</Text>
        <MyPetsitterSettings petsitter={me} />
      </article>

      <article>
        <Text $size="lg">나의 스케쥴</Text>
        <MySchedule />
      </article>
    </PetsitterContainer>
  );
}

const PetsitterContainer = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;
