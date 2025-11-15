
import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  return (
    <header className="flex justify-between items-center py-4 px-6 bg-white dark:bg-dark-secondary border-b-2 border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
          <Menu size={24} />
        </button>
      </div>
      <div className="flex items-center">
        <div className="relative">
          <button className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-primary">
                <img className="h-full w-full object-cover" src="https://picsum.photos/100/100" alt="Your avatar"/>
            </div>
            <span className="font-semibold hidden md:block">Admin User</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
