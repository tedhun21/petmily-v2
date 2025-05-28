import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useSWR from 'swr';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { FaRegPaperPlane } from 'react-icons/fa6';
import { FiSun } from 'react-icons/fi';
import { MdNightlightRound } from 'react-icons/md';

import { RootState } from 'store';
import { fetcherWithCookie } from 'api';
import { Row } from 'styles/commonStyle';
import MeButton from './components/MeButton';
import NotiButton from './components/NotiButton/NotiButton';
import { ThemeContext } from '@components/ThemeProvider';
import { API_URL } from 'config';

export default function TopHeader() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  const { newMessages } = useSelector((state: RootState) => state.message);
  const { newNotifications } = useSelector((state: RootState) => state.notification);

  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);

  const { data: unreadCount } = useSWR(`${API_URL}/notifications/unreadCount`, fetcherWithCookie);

  const unreadChatCount: number = me?.unreadChatCount + newMessages.length;
  const unreadNotificationCount: number = unreadCount + newNotifications.length;

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
              {unreadNotificationCount > 0 && (
                <UnreadCountContainer>
                  <UnreadCount>
                    <span>{unreadNotificationCount}</span>
                  </UnreadCount>
                </UnreadCountContainer>
              )}
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
  padding: 12px;
`;

const Wrapper = styled(Row)`
  align-items: center;
  gap: 4px;
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
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.normal};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.hover};
  }
`;

const StyledLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  border-radius: ${({ theme }) => theme.radius.normal};

  &:hover {
    background-color: ${({ theme }) => theme.background.box.default.hover};
  }
`;

const LoginNavLink = styled(Link)`
  color: ${({ theme }) => theme.text.white};
  background-color: ${({ theme }) => theme.background.box.blue.primary};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.normal};
  ${({ theme }) => theme.fontSize.s14h21}

  &:hover {
    background-color: ${({ theme }) => theme.background.box.blue.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.background.box.blue.active};
    box-shadow: ${({ theme }) => theme.shadow.inset};
  }
`;

const UnreadCountContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
`;

const UnreadCount = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 16px;
  height: 16px;

  background-color: ${({ theme }) => theme.background.red};
  border-radius: ${({ theme }) => theme.radius.circle};

  > span {
    color: ${({ theme }) => theme.text.white};
    ${({ theme }) => theme.fontSize.s12h18};
  }
`;
