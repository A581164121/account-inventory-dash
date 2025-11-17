
import React from 'react';
import { Menu } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../../context/auth';
import { useAppContext } from '../../context/AppContext';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  const { currentUser, users, login } = useAuth();
  const { logoUrl } = useAppContext();

  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white dark:bg-dark-secondary border-b-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
          <Menu size={24} />
        </button>
      </div>
      <div className="flex items-center space-x-4">
        <div className="hidden sm:block">
            <Logo src={logoUrl} style={{ height: '32px' }} />
        </div>
        <div className="relative">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary">
                <img className="h-full w-full object-cover" src={`https://i.pravatar.cc/100?u=${currentUser?.id}`} alt="Your avatar"/>
            </div>
            <div className="flex flex-col text-sm text-left">
              <span className="font-semibold hidden md:block">{currentUser?.name || 'Not Logged In'}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">{currentUser?.role}</span>
            </div>
            <select 
              value={currentUser?.id || ''} 
              onChange={(e) => login(e.target.value)}
              className="bg-transparent font-semibold cursor-pointer appearance-none p-1 rounded-md text-sm"
              aria-label="Switch User"
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;