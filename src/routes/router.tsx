import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import QuizSetup from '@/pages/QuizSetup';
import Quiz from '@/pages/Quiz';
import NotFound from '@/pages/NotFound';
import DynamicPage from '@/pages/DynamicPage';
import SubjectStatsPage from '@/pages/SubjectStatsPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'setup/:subject',
        element: <QuizSetup />,
      },
      {
        path: 'quiz/:subject',
        element: <Quiz />,
      },
      {
        path: 'stats/:subject',
        element: <SubjectStatsPage />,
      },
      {
        path: ':slug',
        element: <DynamicPage />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router; 