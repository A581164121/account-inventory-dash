
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS, REPORTS_LINKS } from '../../constants';
import { BarChart3 } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-secondary transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 flex flex-col`}>
        <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-primary" />
            <span className="text-gray-800 dark:text-white text-2xl mx-2 font-semibold">AcctPro</span>
          </div>
        </div>
        <nav className="mt-10 px-2 flex-1">
          <p className="px-4 text-xs text-gray-500 uppercase font-semibold">Main</p>
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center mt-4 py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
                }`
              }
            >
              {link.icon}
              <span className="mx-4 font-medium">{link.name}</span>
            </NavLink>
          ))}
          <p className="mt-8 px-4 text-xs text-gray-500 uppercase font-semibold">Reports</p>
          {REPORTS_LINKS.map(link => (
             <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center mt-4 py-2 px-4 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
                }`
              }
            >
              {link.icon}
              <span className="mx-4 font-medium">{link.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
