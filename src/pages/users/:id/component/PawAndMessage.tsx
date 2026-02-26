import { FaRegPaperPlane } from 'react-icons/fa6';

import PawButton from './PawButton';
import Text from '@/components/styled/Text';
import Flex from '@/components/styled/Flex';
import Link from '@/components/styled/Link';

interface IProps {
  userId: number | null;
}

export default function PawAndMessage({ userId }: IProps) {
  return (
    <Flex gap="lg">
      <PawButton userId={userId} />
      <Link to={`/chats/temp?opponentIds=${userId}`} variant="button" fullWidth>
        <Flex alignItems="center" gap="sm">
          <Text size="lg">message</Text>
          <FaRegPaperPlane size="20px" />
        </Flex>
      </Link>
    </Flex>
  );
}
