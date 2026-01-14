import { useContext } from 'react';

import { useSelector } from 'react-redux';
import styled from '@emotion/styled';

import { FaRegPaperPlane } from 'react-icons/fa6';
import { FiSun } from 'react-icons/fi';
import { MdNightlightRound } from 'react-icons/md';

import { useAuthSWR } from '@/hooks/authSWR';
import type { RootState } from '@/store';
import { fetcher } from '@/api';
import MeButton from './components/MeButton';
import NotiButton from './components/NotiButton/NotiButton';

import Text from '@/components/styled/Text';
import Box from '@/components/styled/Box';
import Flex from '@/components/styled/Flex';

import { ThemeContext } from '../contexts/ThemeContext';

import Link from '../styled/Link';
import { IconButton, IconLink } from '../styled/IconButtonAndLink';

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
    <Box px="lg" py="md">
      <Flex justifyContent="space-between">
        <Link to="/" type="image">
          <img src="/imgs/Logo.svg" alt="logo" width="100px" />
        </Link>

        <Flex gap="sm">
          <Flex alignItems="center" gap="xs">
            <IconButton onClick={handleDarkMode} variant="clear" size="sm" shape="circle">
              {isDarkMode ? <FiSun size="24px" /> : <MdNightlightRound size="24px" />}
            </IconButton>

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
                  <IconLink to="/chats" variant="clear" size="sm" shape="circle">
                    <FaRegPaperPlane size="24px" />
                  </IconLink>

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
            <Link to="/login" variant="text" size="sm">
              로그인/회원가입
            </Link>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

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
  min-width: ${({ theme }) => theme.space.lg};
  height: ${({ theme }) => theme.space.lg};
  background-color: ${({ theme }) => theme.colors.background.error};
  border-radius: ${({ theme }) => theme.radius.circle};
`;
