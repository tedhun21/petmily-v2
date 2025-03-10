// import { Suspense, lazy } from 'react';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import { styled, ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// import LoadingFallback from '@components/LoadingFallback';

// const Home = lazy(() => import('@pages/main/Home'));
// const PetSitterHome = lazy(() => import('@pages/main/PetSitterHome'));
// const Login = lazy(() => import('@pages/login/Login'));
// const Signup = lazy(() => import('@pages/login/Signup'));
// const Reviews = lazy(() => import('@pages/main/Reviews'));
// const Mypage = lazy(() => import('@pages/mypage/Mypage'));
// const EditUserProfile = lazy(() => import('@pages/mypage/EditUserProfile'));
// const ViewPetsitters = lazy(() => import('@pages/reservation/ViewPetsitters'));
// const Reservation = lazy(() => import('@pages/reservation/Reservation'));
// const ReservationStepTwo = lazy(() => import('@pages/reservation/ReservationStepTwo'));
// const ReservationStepThree = lazy(() => import('@pages/reservation/ReservationStepThree'));
// const Cares = lazy(() => import('@pages/care/Cares'));
// const RegisterPet = lazy(() => import('@pages/mypage/RegisterPet'));
// const EditPet = lazy(() => import('@pages/mypage/EditPet'));
// const PetsitterViewDetails = lazy(() => import('@pages/reservation/PetsitterViewDetails'));
// const Search = lazy(() => import('@pages/main/Search'));
// const CreateReview = lazy(() => import('@pages/care/CreateReview'));
// const CreateJournal = lazy(() => import('@pages/care/CreateJournal'));
// const SitterSchedule = lazy(() => import('@pages/mypage/SitterSchedule'));
// const OAuthBranch = lazy(() => import('@pages/login/OAuthBranch'));
// const ViewJournal = lazy(() => import('@pages/common/ViewJournal'));
// const QnA = lazy(() => import('@pages/main/QnA'));
// const NotFound = lazy(() => import('@pages/common/404'));

import Home from '@pages/home/Home';
import Reviews from '@pages/reviews/Reviews';

import Login from '@pages/login/Login';
import Signup from '@pages/login/Signup';

import Me from '@pages/me/Me';
import EditMe from '@pages/me/edit/EditMe';
import CreatePet from '@pages/me/register/CreatePet';
import EditPet from '@pages/me/editPet/EditPet';

import Cares from '@pages/cares/Cares';
import Care from '@pages/cares/:id/Care';

import Search from '@pages/search/Search';
import FaQ from '@pages/home/FaQ';
import Profile from '@pages/users/:id/Profile';

import Chats from '@pages/chats/Chats';
import Chat from '@pages/chats/chat/Chat';

import NotFound from '@pages/common/404';

import { useDispatch, useSelector } from 'react-redux';
import { SWRConfig } from 'swr';

import Redirect from '@pages/login/Redirect';
import { ToastContainer } from 'react-toastify';
import Review from '@pages/cares/:id/review/Review';
import Journal from '@pages/cares/:id/journal/Journal';
import Book from '@pages/users/:id/book/Book';

import { darkTheme, lightTheme } from 'styles/theme';
import GlobalStyle from 'styles/Globalstyle';
import { ITheme, toggleTheme } from 'store/themeSlice';
import Maps from '@pages/cares/:id/maps/Maps';
import MessageProvider from '@components/MessageProvider';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="" element={<Home />} />
      <Route path="reviews" element={<Reviews />} />
      <Route path="search" element={<Search />} />
      <Route path="cares" element={<Cares />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="auth/connect/google/callback" element={<Redirect />} />
      <Route path="me" element={<Me />} />
      <Route path="me/edit" element={<EditMe />} />
      <Route path="me/register" element={<CreatePet />} />
      <Route path="me/:petId/edit" element={<EditPet />} />
      <Route path="faq" element={<FaQ />} />
      <Route path="cares/:id" element={<Care />} />
      <Route path="cares/:id/review" element={<Review />} />
      <Route path="cares/:id/journal" element={<Journal />} />
      <Route path="cares/:id/maps" element={<Maps />} />
      <Route path="users/:nickname" element={<Profile />} />
      <Route path="users/:nickname/book" element={<Book />} />
      <Route path="chats" element={<Chats />} />
      <Route path="chat/:chatRoomId?" element={<Chat />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

const muiLightTheme = createTheme({ palette: { mode: 'light' } });
const muiDarkTheme = createTheme({ palette: { mode: 'dark' } });

export default function App() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: ITheme) => state.theme.isDarkMode);

  // dark mode 설정
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      dispatch(toggleTheme(e.matches ? 'dark' : 'light'));
    };

    dispatch(toggleTheme(mediaQuery.matches ? 'dark' : 'light')); // 초기 테마 설정
    mediaQuery.addEventListener('change', handleChange); // 시스템 테마 변경 감지

    return () => {
      mediaQuery.removeEventListener('change', handleChange); // 클린업
    };
  }, [dispatch]);

  return (
    <SWRConfig value={{ revalidateOnFocus: false, provider: () => new Map() }}>
      <StyledComponentsThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <MuiThemeProvider theme={isDarkMode ? muiDarkTheme : muiLightTheme}>
          <MessageProvider>
            <GlobalStyle />
            <Container>
              <Wrapper>
                <RouterProvider router={router} />
                <ToastContainer
                  position="top-right"
                  autoClose={2000}
                  theme={isDarkMode ? 'dark' : 'light'}
                  hideProgressBar={true}
                  closeOnClick={true}
                  pauseOnFocusLoss={false}
                />
              </Wrapper>
            </Container>
          </MessageProvider>
        </MuiThemeProvider>
      </StyledComponentsThemeProvider>
    </SWRConfig>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.background.secondary};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  max-width: 600px;
  color: ${({ theme }) => theme.text.active};
  background-color: ${({ theme }) => theme.background.primary};
`;
