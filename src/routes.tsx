import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';

import HomePage from '@/pages/home/page';
import LoginPage from '@/pages/login/page';
import SignupPage from '@/pages/signup/page';
import SearchPage from '@/pages/search/page';
import ReviewsPage from '@/pages/reviews/page';
import FaQPage from '@/pages/faq/page';
import ChatsPage from '@/pages/chats/page';
import ChatPage from '@/pages/chats/:id/page';
import CaresPage from '@/pages/cares/page';
import CarePage from '@/pages/cares/:id/page';
import MapsPage from '@/pages/cares/:id/maps/MapsPage';
import ReviewPage from '@/pages/cares/:id/review/page';
import JournalPage from '@/pages/cares/:id/journal/page';
import MyPage from '@/pages/me/page';
import EditMePage from '@/pages/me/edit/page';
import CreatePetPage from '@/pages/me/pets/register/page';
import EditPetPage from '@/pages/me/pets/:id/edit/page';
import ProfilePage from '@/pages/users/:id/page';
import BookPage from '@/pages/users/:id/book/page';

import RedirectPage from '@/pages/common/Redirect';
import NotFoundPage from '@/pages/common/NotFound';

export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'reviews', element: <ReviewsPage /> },
      { path: 'faq', element: <FaQPage /> },
      { path: 'chats', element: <ChatsPage /> },
      { path: 'chats/:id', element: <ChatPage /> },
      { path: 'cares', element: <CaresPage /> },
      { path: 'cares/:id', element: <CarePage /> },
      { path: 'cares/:id/review', element: <ReviewPage /> },
      { path: 'cares/:id/journal', element: <JournalPage /> },
      { path: 'cares/:id/maps', element: <MapsPage /> },
      { path: 'me', element: <MyPage /> },
      { path: 'me/edit', element: <EditMePage /> },
      { path: 'me/pets/register', element: <CreatePetPage /> },
      { path: 'me/pets/:id/edit', element: <EditPetPage /> },
      { path: 'users/:id', element: <ProfilePage /> },
      { path: 'users/:id/book', element: <BookPage /> },
      { path: 'auth/connect/google/callback', element: <RedirectPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
