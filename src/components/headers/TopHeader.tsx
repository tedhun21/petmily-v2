import { useContext } from 'react';

import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { FaRegPaperPlane } from 'react-icons/fa6';
import { FiSun } from 'react-icons/fi';
import { MdNightlightRound } from 'react-icons/md';

import { useAuthSWR } from 'hooks/authSWR';
import { RootState } from 'store';
import { fetcher } from 'api';
import MeButton from './components/MeButton';
import NotiButton from './components/NotiButton/NotiButton';
import { ThemeContext } from '@components/contexts/ThemeProvider';
import { Button } from '@components/buttons/Button';
import { flex, Flex } from '@components/Flex';
import { Text } from '@components/Text';
import Link from '@components/Link';
import Box from '@components/Box';

export default function TopHeader() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const { newMessages } = useSelector((state: RootState) => state.newMessage);
  const { newNotifications } = useSelector((state: RootState) => state.notification);

  const { data: me } = useAuthSWR('/users/me', fetcher);

  // const { data: unreadCount } = useSWR('/notifications/unreadCount', fetcher);
  const { data: unreadMessageCount } = useAuthSWR('/chats/unread-count', fetcher);

  // console.log('newMessages', newMessages);
  // console.log('unreadMessageCount', unreadMessageCount);

  const unreadChatCount = unreadMessageCount + newMessages.length;

  // const unreadNotificationCount: number = unreadCount + newNotifications.length;

  const handleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Container>
      <Link to="/" type="image">
        <img src="/imgs/Logo.svg" alt="logo" width="100px" />
      </Link>
      <Flex gap="sm">
        <Flex alignItems="center" gap="xs">
          <Button type="button" onClick={handleDarkMode} variant="icon" borderRadius="circle">
            {isDarkMode ? <FiSun size="24px" /> : <MdNightlightRound size="24px" />}
          </Button>

          {me && (
            <>
              <NotiButton />
              {/* {unreadNotificationCount > 0 && (
                <UnreadCountContainer>
                  <UnreadCount>
                    <span>{unreadNotificationCount}</span>
                  </UnreadCount>
                </UnreadCountContainer>
              )} */}

              <div style={{ position: 'relative' }}>
                <Link to="/chats" type="icon">
                  <FaRegPaperPlane size="24px" />
                </Link>

                {unreadChatCount > 0 && (
                  <UnreadCountContainer>
                    <UnreadCount>
                      <Text size="xs" color="white">
                        {unreadChatCount}
                      </Text>
                    </UnreadCount>
                  </UnreadCountContainer>
                )}
              </div>
            </>
          )}
        </Flex>

        {me ? (
          <MeButton me={me} />
        ) : (
          <Link to="/login" type="text" size="sm">
            로그인/회원가입
          </Link>
        )}
      </Flex>
    </Container>
  );
}

const Container = styled(Box).attrs(() => ({
  px: 'lg',
  py: 'md',
}))`
  ${flex({
    justifyContent: 'space-between',
  })}
`;

const UnreadCountContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

// TODO Box?
const UnreadCount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: ${({ theme }) => theme.spacing.lg};
  height: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.error};
  border-radius: ${({ theme }) => theme.radius.circle};
`;
