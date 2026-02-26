import BackButton from '@/components/buttons/BackButton';
import Header from '@/components/headers/Header';
import SelectedPetsitter from '../component/SelectedPetsitter';
import { useState } from 'react';
import Flex from '@/components/styled/Flex';
import Text from '@/components/styled/Text';
import { timeRange } from '@/utils/date';
import Confirm from '../component/Confirm';

export default function ConfirmPage() {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <>
      <Header left={<BackButton />} />

      {/* <SelectedPetsitter petsitter={petsitter} />

      <Reservation>
        <SubTitle>예약 정보</SubTitle>

        <Flex direction="column">
          <Flex justifyContent="space-between" alignItems="center">
            <Text size="base" weight="bold">
              예약 날짜
            </Text>
            <Text size="sm">{date}</Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center">
            <Text size="base" weight="bold">
              예약 시간
            </Text>
            <Text size="sm">{timeRange(startTime, endTime)}</Text>
          </Flex>
        </Flex>

        <span></span>
      </Reservation>

      <Confirm isChecked={isChecked} setIsChecked={setIsChecked} /> */}
    </>
  );
}

// TODO
// const Reservation = styled.section`
//   display: flex;
//   flex-direction: column;
//   padding: ${({ theme }) => theme.space['2xl']};
//   background-color: ${({ theme }) => theme.colors.background.box.default.primary};
//   border-radius: ${({ theme }) => theme.space.md};
//   box-shadow: ${({ theme }) => theme.shadow.dp01};
//   gap: ${({ theme }) => theme.space.lg};
// `;
