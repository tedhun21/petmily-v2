// import { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Route, createRoutesFromElements } from 'react-router-dom';
import styled from 'styled-components';

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
import Reviews from '@pages/review/Reviews';
import Me from '@pages/me/Me';
import Cares from '@pages/care/Cares';
import Care from '@pages/care/CareDetail';
import Login from '@pages/login/Login';
import Signup from '@pages/login/Signup';
import EditMe from '@pages/me/EditMe';
import CreatePet from '@pages/me/CreatePet';
import EditPet from '@pages/me/EditPet';
import Search from '@pages/home/Search';
import QnA from '@pages/home/QnA';
import ViewPetsitters from '@pages/reservation/ViewPetsitters';
import ViewJournal from '@pages/common/ViewJournal';
import PetsitterViewDetails from '@pages/reservation/PetsitterViewDetails';
import SitterSchedule from '@pages/me/SitterSchedule';
import NotFound from '@pages/common/404';

import FormWizard from '@pages/reservation/FormWizard';
import { Provider as ReduxProvider } from 'react-redux';
import store from './store/index';
import { SWRConfig } from 'swr';
import CareDetail from '@pages/care/CareDetail';
import CreateJournal from '@pages/care/journal/CreateJournal';
import CreateReview from '@pages/care/review/CreateReview';
import EditReview from '@pages/care/review/EditReview';
import Redirect from '@pages/login/Redirect';
import { ToastContainer } from 'react-toastify';

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
        <Route path="reservation" element={<FormWizard />} />
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
        <Route path="cares/:id/journal/create" element={<CreateJournal />} />
        <Route path="cares/:id/review/create" element={<CreateReview />} />
        <Route path="cares/:id/review" element={<EditReview />} />
        {/* <Route path="cares/:id/journal" element={<EditJournal />} /> */}
        <Route path="petsitters/:id" element={<PetsitterViewDetails />} />
        {/* <Route path="petsitters" element={<ViewPetsitters />} /> */}
        {/* <Route path="petsitters/:memberId/schedule" element={<SitterSchedule />} /> */}
      </Route>
      <Route path="me" element={<Me />} />
      <Route path="auth/connect/google/callback" element={<Redirect />} />
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default function App() {
  return (
    <ReduxProvider store={store}>
      <SWRConfig value={{ revalidateOnFocus: false, provider: () => new Map() }}>
        <Container>
          <Wrapper>
            <RouterProvider router={router} />
            <ToastContainer position="top-center" autoClose={3000} />
          </Wrapper>
        </Container>
      </SWRConfig>
    </ReduxProvider>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
`;

const Wrapper = styled.div`
  display: flex;
  position: relative;
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  height: 100%;
  background-color: white;
`;
