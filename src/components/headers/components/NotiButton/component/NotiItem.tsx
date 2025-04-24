import { useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Row, Texts12h18, Texts14h21 } from 'styles/commonStyle';
import { dateAgo, dateFormat } from 'utils/date';

export default function NotiItem({ notification, onInView }: any) {
  const isRead = notification.readStatus[0].isRead;

  const itemRef = useRef(null);
  const isInView = useInView(itemRef, { once: true });

  useEffect(() => {
    if (isInView && !isRead) {
      onInView(notification.id);
    }
  }, [isInView]);

  return (
    <Item ref={itemRef} key={notification.id}>
      <TopDiv>
        <DayDiv>
          <Day>{`${dateFormat(notification.createdAt).year}.${dateFormat(notification.createdAt).month}.${dateFormat(notification.createdAt).day}`}</Day>
          <Ago>{dateAgo(notification.createdAt)}</Ago>
        </DayDiv>
        {!isRead && <IsUnread />}
      </TopDiv>
      <Message>{notification.message}</Message>
    </Item>
  );
}

const Item = styled.li`
  display: flex;
  flex-direction: column;
  padding: 4px;
`;

const TopDiv = styled(Row)`
  justify-content: space-between;
  align-items: center;
`;

const DayDiv = styled(Row)`
  gap: 4px;
  align-items: flex-end;
`;

const IsUnread = styled.div`
  padding: 4px;
  background-color: ${({ theme }) => theme.background.red};
  border-radius: ${({ theme }) => theme.radius.circle};
`;

const Day = styled(Texts14h21)`
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const Ago = styled(Texts12h18)``;

const Message = styled(Texts14h21)`
  width: 100%;
  white-space: nowrap;
`;
