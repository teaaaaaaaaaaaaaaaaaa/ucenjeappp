import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-4 border-blue-200 dark:border-blue-800 p-8 text-center">
        <span className="text-6xl block mb-4">🔍</span>
        <h1 className="text-4xl font-bold mb-2 text-gray-800 dark:text-white">404</h1>
        <h2 className="text-xl font-semibold mb-4 text-gray-600 dark:text-gray-300">Stranica nije pronađena</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Stranica koju tražite ne postoji ili je premeštena.
        </p>
        <Link to="/">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3">
            <span className="mr-2">🏠</span> Nazad na početnu
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound; 