import { useContext } from 'react';
import { Link } from 'react-router-dom';

import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { FaRegPaperPlane } from 'react-icons/fa6';
import { FiSun } from 'react-icons/fi';
import { MdNightlightRound } from 'react-icons/md';

import { useAuthSWR } from 'hooks/authSWR';
import { RootState } from 'store';
import { fetcher } from 'api';
import { Center, Row } from 'styles/commonStyle';
import MeButton from './components/MeButton';
import NotiButton from './components/NotiButton/NotiButton';
import { ThemeContext } from '@components/contexts/ThemeProvider';
import { Button } from '@components/buttons/Button';

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
      <Link to="/">
        <img src="/imgs/Logo.svg" alt="logo" />
      </Link>
      <MenuContainer>
        <IconContainer>
          <Button type="button" onClick={handleDarkMode} $variant="icon" $borderRadius="circle">
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
                <Button as={Link} to="/chats" $variant="icon" $borderRadius="circle">
                  <FaRegPaperPlane size="24px" />
                </Button>
                {unreadChatCount > 0 && (
                  <UnreadCountContainer>
                    <UnreadCount>
                      <span>{unreadChatCount}</span>
                    </UnreadCount>
                  </UnreadCountContainer>
                )}
              </div>
            </>
          )}
        </IconContainer>

        {me ? (
          <MeButton me={me} />
        ) : (
          <Button as={Link} to="/login" $variant="primary" $size="sm" $borderRadius="sm">
            로그인/회원가입
          </Button>
        )}
      </MenuContainer>
    </Container>
  );
}

const Container = styled(Row)`
  flex: 1;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
`;

const MenuContainer = styled(Row)`
  gap: ${({ theme }) => theme.spacing.sm};
`;

const IconContainer = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const UnreadCountContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const UnreadCount = styled(Center)`
  min-width: ${({ theme }) => theme.spacing.lg};
  height: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.error};
  border-radius: ${({ theme }) => theme.radius.circle};

  > span {
    color: ${({ theme }) => theme.colors.text.white};
    ${({ theme }) => theme.typeScale.xs};
  }
`;
