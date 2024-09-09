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
import Login from '@pages/login/Login';
import Mypage from '@pages/mypage/Mypage';
import Reviews from '@pages/home/Reviews';
import Care from '@pages/care/Care';
import Signup from '@pages/login/Signup';
import OAuthBranch from '@pages/login/OAuthBranch';
import EditUserProfile from '@pages/mypage/EditUserProfile';
import RegisterPet from '@pages/mypage/RegisterPet';
import EditPet from '@pages/mypage/EditPet';
import Search from '@pages/home/Search';
import QnA from '@pages/home/QnA';
import ViewPetsitters from '@pages/reservation/ViewPetsitters';
import ViewJournal from '@pages/common/ViewJournal';
import PetsitterViewDetails from '@pages/reservation/PetsitterViewDetails';
import SitterSchedule from '@pages/mypage/SitterSchedule';
import NotFound from '@pages/common/404';
import FormWizard from '@pages/reservation/FormWizard';
import { Provider } from 'react-redux';
import store from './store/index';

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
        <Route path="care" element={<Care />} />
      </Route>
      <Route element={<BackHeaderLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="signup/branch" element={<OAuthBranch />} />
        <Route path="mypage" element={<Mypage />} />
        <Route path="mypage/edit" element={<EditUserProfile />} />
        <Route path="mypage/register" element={<RegisterPet />} />
        <Route path="mypage/:petId/edit" element={<EditPet />} />
        <Route path="search" element={<Search />} />
        <Route path="qna" element={<QnA />} />
        <Route path="petsitters" element={<ViewPetsitters />} />
        <Route path="mypage/:petId/edit" element={<EditPet />} />
        <Route path="cares/journal/:journalId" element={<ViewJournal />} />
        <Route path="petsitters/:petsitterId" element={<PetsitterViewDetails />} />
        <Route path="petsitters/:memberId/schedule" element={<SitterSchedule />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>,
  ),
);

export default function App() {
  return (
    <Provider store={store}>
      <Container>
        <Wrapper>
          <RouterProvider router={router} />
        </Wrapper>
      </Container>
    </Provider>
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
  flex-direction: column;
  max-width: 600px;
  width: 100%;
  height: 100%;
  background-color: white;
`;

{
  /* <Container>
        <Wrapper>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<AddNavHeaderLayout />}>
                <Route path="" element={<Home />} />
                <Route path="/petsitter" element={<PetSitterHome />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="mypage" element={<Mypage />} />
                <Route path="reservation" element={<Reservation />} />
                <Route path="reservation/step2" element={<ReservationStepTwo />} />
                <Route path="cares" element={<Cares />} />
                <Route path="cares/:reservationId/review" element={<CreateReview />} />
                <Route path="cares/:reservationId/journal" element={<CreateJournal />} />
              </Route>
              <Route path="/" element={<BackHeaderLayout />}>
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="signup/branch" element={<OAuthBranch />} />
                <Route path="mypage/edit" element={<EditUserProfile />} />
                <Route path="mypage/register" element={<RegisterPet />} />
                <Route path="mypage/:petId/edit" element={<EditPet />} />
                <Route path="search" element={<Search />} />
                <Route path="qna" element={<QnA />} />
                <Route path="petsitters" element={<ViewPetsitters />} />
                <Route path="reservation/step3" element={<ReservationStepThree />} />
                <Route path="cares/journal/:journalId" element={<ViewJournal />} />
                <Route path="petsitters/:petsitterId" element={<PetsitterViewDetails />} />
                <Route path="petsitters/:memberId/schedule" element={<SitterSchedule />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Wrapper>
      </Container> */
}
