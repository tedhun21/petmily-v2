import MyPetsitterSettings from './MyPetsitterSetting';
import MySchedule from './MySchedule';
import { User } from '@/types/user.type';
import { Text } from '@components/styled/Text';

interface MyPetsitterProfileProps {
  me: User;
}

export default function MyPetsitterProfile({ me }: MyPetsitterProfileProps) {
  return (
    <>
      <article>
        <Text size="lg">나의 설정</Text>
        <MyPetsitterSettings petsitter={me} />
      </article>

      <article>
        <Text size="lg">나의 스케쥴</Text>
        <MySchedule />
      </article>
    </>
  );
}
