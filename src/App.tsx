// import { Suspense, lazy } from 'react';

import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from 'react-router-dom';
import { styled } from 'styled-components';

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

import HomePage from '@pages/home/page';
import ReviewsPage from '@pages/reviews/page';
import SearchPage from '@pages/search/page';
import FaQPage from '@pages/faq/page';

import LoginPage from '@pages/login/page';
import SignupPage from '@pages/signup/page';

import MyPage from '@pages/me/page';
import EditMePage from '@pages/me/edit/page';
import CreatePetPage from '@pages/me/register/page';
import EditPetPage from '@pages/me/editPet/page';

import CaresPage from '@pages/cares/page';
import CarePage from '@pages/cares/:id/page';
import Maps from '@pages/cares/:id/maps/Maps';
import ReviewPage from '@pages/cares/:id/review/page';
import JournalPage from '@pages/cares/:id/journal/page';

import ProfilePage from '@pages/users/:id/page';
import BookPage from '@pages/users/:id/book/page';

import ChatsPage from '@pages/chats/page';
import ChatPage from '@pages/chats/:id/page';

import NotFoundPage from '@pages/common/NotFound';

import { SWRConfig } from 'swr';

import RedirectPage from '@pages/common/Redirect';

import AuthProvider from '@components/contexts/AuthProvider';
import SocketProvider from '@components/contexts/SocketProvider';
import ThemeProvider from '@components/contexts/ThemeProvider';
import GlobalStyle from 'styles/Globalstyle';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route path="" element={<HomePage />} />
      <Route path="reviews" element={<ReviewsPage />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="cares" element={<CaresPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="auth/connect/google/callback" element={<RedirectPage />} />
      <Route path="me" element={<MyPage />} />
      <Route path="me/edit" element={<EditMePage />} />
      <Route path="me/register" element={<CreatePetPage />} />
      <Route path="me/:petId/edit" element={<EditPetPage />} />
      <Route path="faq" element={<FaQPage />} />
      <Route path="cares/:id" element={<CarePage />} />
      <Route path="cares/:id/review" element={<ReviewPage />} />
      <Route path="cares/:id/journal" element={<JournalPage />} />
      <Route path="cares/:id/maps" element={<Maps />} />
      <Route path="users/:nickname" element={<ProfilePage />} />
      <Route path="users/:nickname/book" element={<BookPage />} />
      <Route path="chats" element={<ChatsPage />} />
      <Route path="chats/:id" element={<ChatPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>,
  ),
);

export default function App() {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        provider: () => new Map(),
      }}
    >
      <AuthProvider>
        <SocketProvider>
          <ThemeProvider>
            <GlobalStyle />
            <Container>
              <Wrapper>
                <RouterProvider router={router} />
              </Wrapper>
            </Container>
          </ThemeProvider>
        </SocketProvider>
      </AuthProvider>
    </SWRConfig>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background.secondary};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.active};
`;
