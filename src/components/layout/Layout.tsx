import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-background flex flex-col">
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout; 