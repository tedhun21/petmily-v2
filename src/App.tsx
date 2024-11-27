// import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Route, createRoutesFromElements } from 'react-router-dom';
import styled, { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components';

import NavHeader from '@components/headers/NavHeader';
import BackHeader from '@components/headers/BackHeader';
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
import CareDetail from '@pages/cares/:id/CareDetail';

import Search from '@pages/search/Search';
import QnA from '@pages/home/QnA';
import Profile from '@pages/users/:id/Profile';

import SitterSchedule from '@pages/me/SitterSchedule';

import Chat from '@pages/chats/Chat';

import NotFound from '@pages/common/404';

import ReservationFormWizard from '@pages/reservation/ReservationFormWizard';
import { useDispatch, useSelector } from 'react-redux';
import { SWRConfig } from 'swr';

import Redirect from '@pages/login/Redirect';
import { ToastContainer } from 'react-toastify';
import Review from '@pages/cares/:id/review/Review';
import Journal from '@pages/cares/:id/journal/Journal';
import { darkTheme, lightTheme } from 'theme';
import GlobalStyle from 'Globalstyle';
import { ITheme, toggleTheme } from 'store/themeSlice';
import { useEffect } from 'react';

const NavHeaderLayout = () => {
  return (
    <>
      <NavHeader />
      <Outlet />
    </>
  );
};

const BackHeaderLayout = () => {
  return (
    <>
      <BackHeader />
      <Outlet />
    </>
  );
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route element={<NavHeaderLayout />}>
        <Route path="" element={<Home />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="reservation" element={<ReservationFormWizard />} />
        <Route path="cares" element={<Cares />} />
      </Route>
      <Route element={<BackHeaderLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="me/edit" element={<EditMe />} />
        <Route path="me/register" element={<CreatePet />} />
        <Route path="me/:petId/edit" element={<EditPet />} />
        <Route path="search" element={<Search />} />
        <Route path="qna" element={<QnA />} />
        <Route path="cares/:id" element={<CareDetail />} />
        <Route path="cares/:id/review" element={<Review />} />
        <Route path="cares/:id/journal" element={<Journal />} />
        <Route path="users/:nickname" element={<Profile />} />
        {/* <Route path="petsitters/:memberId/schedule" element={<SitterSchedule />} /> */}
      </Route>
      <Route path="me" element={<Me />} />
      <Route path="auth/connect/google/callback" element={<Redirect />} />
      <Route path="chats/:opponentId" element={<Chat />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default function App() {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state: ITheme) => state.theme.isDarkMode);

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
  position: relative;
  width: 100%;
  height: 100%;
  max-width: 600px;
  color: ${({ theme }) => theme.text.active};
  background-color: ${({ theme }) => theme.background.primary};
`;
