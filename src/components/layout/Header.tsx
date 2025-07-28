import { Link } from 'react-router-dom';
import Logo from '../shared/Logo';

const Header: React.FC = () => {
  return (
    <header className="w-full bg-gradient-to-r from-blue-600 to-purple-600 py-4 shadow-lg border-b border-blue-700/20">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
            <span className="mr-1">🏠</span> Home
          </Link>
          <Link to="/setup/linux" className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
            <span className="mr-1">🐧</span> Linux
          </Link>
          <Link to="/setup/programming" className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
            <span className="mr-1">💻</span> Programming
          </Link>
          <Link to="/setup/marketing" className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
            <span className="mr-1">📈</span> Marketing
          </Link>
          <Link to="/setup/aros" className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
            <span className="mr-1">⚙️</span> OS
          </Link>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors font-medium flex items-center">
            <span className="mr-1">⭐</span> GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
