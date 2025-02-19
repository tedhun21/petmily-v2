import useSWR from 'swr';

import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { RootState } from 'store';
import { toggleTheme } from 'store/themeSlice';

import { FaRegPaperPlane } from 'react-icons/fa6';
import { FiSun } from 'react-icons/fi';
import { IoMdNotificationsOutline } from 'react-icons/io';
import { MdNightlightRound } from 'react-icons/md';

import { Row } from 'styles/commonStyle';
import MeButton from './MeButton';
import { fetcherWithCookie } from 'api';

const API_URL = process.env.REACT_APP_API_URL;

export default function TopHeader() {
  const dispatch = useDispatch();
  const { isDarkMode } = useSelector((state: RootState) => state.theme);

  const { data: me } = useSWR(`${API_URL}/users/me`, fetcherWithCookie);

  const handleDarkMode = () => {
    if (isDarkMode) {
      dispatch(toggleTheme('light'));
    } else {
      dispatch(toggleTheme('dark'));
    }
  };

  return (
    <Container>
      <Link to="/">
        <img src="/imgs/Logo.svg" alt="logo" />
      </Link>
      <Wrapper>
        <Button type="button" onClick={handleDarkMode}>
          {isDarkMode ? <FiSun size="20px" /> : <MdNightlightRound size="20px" />}
        </Button>
        {me && (
          <>
            <Button type="button">
              <IoMdNotificationsOutline size="20px" />
            </Button>
            <StyledLink to="/chats">
              <FaRegPaperPlane size="16px" />
            </StyledLink>
          </>
        )}
        <MeButton me={me} />
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
  padding: 6px;
  border-radius:${({ theme }) => theme.radius.normal};

  &:hover {
  background-color:${({ theme }) => theme.background.box.default.hover};
`;
