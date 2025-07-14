import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes/router';
import { QuizProvider } from './contexts/QuizContext';

const App: React.FC = () => {
  return (
    <QuizProvider>
      <RouterProvider router={router} />
    </QuizProvider>
  );
};

export default App;