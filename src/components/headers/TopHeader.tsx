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
import { Row } from 'styles/commonStyle';
import MeButton from './components/MeButton';
import NotiButton from './components/NotiButton/NotiButton';
import { ThemeContext } from '@components/contexts/ThemeProvider';

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
      <Wrapper>
        <ButtonContainer>
          <Button type="button" onClick={handleDarkMode}>
            {isDarkMode ? <FiSun size="20px" /> : <MdNightlightRound size="20px" />}
          </Button>
        </ButtonContainer>
        {me ? (
          <>
            <ButtonContainer>
              <NotiButton />
              {/* {unreadNotificationCount > 0 && (
                <UnreadCountContainer>
                  <UnreadCount>
                    <span>{unreadNotificationCount}</span>
                  </UnreadCount>
                </UnreadCountContainer>
              )} */}
            </ButtonContainer>

            <ButtonContainer>
              <StyledLink to="/chats">
                <FaRegPaperPlane size="20px" />
              </StyledLink>
              {unreadChatCount > 0 && (
                <UnreadCountContainer>
                  <UnreadCount>
                    <span>{unreadChatCount}</span>
                  </UnreadCount>
                </UnreadCountContainer>
              )}
            </ButtonContainer>

            <MeButton me={me} />
          </>
        ) : (
          <LoginNavLink to="/login">로그인/회원가입</LoginNavLink>
        )}
      </Wrapper>
    </Container>
  );
}

const Container = styled(Row)`
  flex: 1;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.md};
`;

const Wrapper = styled(Row)`
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ButtonContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 36px;
  height: 36px;
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.base};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.base};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.default.hover};
  }
`;

const LoginNavLink = styled(Link)`
  padding: 4px 8px;
  background-color: ${({ theme }) => theme.colors.background.box.blue.primary};
  border-radius: ${({ theme }) => theme.radius.base};
  color: ${({ theme }) => theme.colors.text.white};
  ${({ theme }) => theme.typeScale.sm};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

const UnreadCountContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const UnreadCount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: ${({ theme }) => theme.spacing.lg};
  height: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background.error};
  border-radius: ${({ theme }) => theme.radius.circle};

  > span {
    color: ${({ theme }) => theme.colors.text.white};
    ${({ theme }) => theme.typeScale.xs};
  }
`;
