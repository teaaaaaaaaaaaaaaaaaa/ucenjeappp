import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full bg-gradient-to-r from-blue-900 to-purple-900 py-8 text-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-blue-200">
              © {currentYear} QuizApp 🧠 | All rights reserved
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
            <Link to="/" className="text-sm text-blue-200 hover:text-white transition-colors">
              🏠 Home
            </Link>
            <Link to="/setup/linux" className="text-sm text-blue-200 hover:text-white transition-colors">
              🐧 Linux Quiz
            </Link>
            <Link to="/setup/programming" className="text-sm text-blue-200 hover:text-white transition-colors">
              💻 Programming Quiz
            </Link>
            <Link to="/setup/marketing" className="text-sm text-blue-200 hover:text-white transition-colors">
              📈 Marketing Quiz
            </Link>
            <Link to="/setup/aros" className="text-sm text-blue-200 hover:text-white transition-colors">
              ⚙️ OS Quiz
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-blue-800 flex justify-center">
          <div className="flex space-x-4">
            <a href="#" className="text-blue-300 hover:text-white transition-colors text-lg" aria-label="Twitter">🐦</a>
            <a href="#" className="text-blue-300 hover:text-white transition-colors text-lg" aria-label="Facebook">📘</a>
            <a href="#" className="text-blue-300 hover:text-white transition-colors text-lg" aria-label="Instagram">📷</a>
            <a href="#" className="text-blue-300 hover:text-white transition-colors text-lg" aria-label="GitHub">🐙</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
