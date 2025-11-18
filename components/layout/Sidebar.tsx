
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAV_LINKS, REPORTS_LINKS, ADMIN_LINKS } from '../../constants';
import Logo from './Logo';
import { useAuth } from '../../context/auth';
import { Permission } from '../../types';
import { useAppContext } from '../../context/AppContext';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { hasPermission } = useAuth();
  const { logoUrl } = useAppContext();

  const NavGroup: React.FC<{title: string, links: typeof NAV_LINKS}> = ({ title, links }) => {
    const visibleLinks = links.filter(link => hasPermission(link.permission));
    if (visibleLinks.length === 0) return null;

    return (
     <>
      <p className="mt-8 px-4 text-xs text-gray-500 uppercase font-semibold">{title}</p>
      {visibleLinks.map(link => (
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
     </>
    )
  };


  return (
    <>
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden ${sidebarOpen ? 'block' : 'hidden'} no-print`} onClick={() => setSidebarOpen(false)}></div>
      <div className={`fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-secondary transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-30 flex flex-col no-print`}>
        <div className="flex items-center justify-center p-6">
          <Logo src={logoUrl} />
        </div>
        <nav className="mt-4 px-2 flex-1 overflow-y-auto">
          <NavGroup title="Main" links={NAV_LINKS} />
          <NavGroup title="Reports" links={REPORTS_LINKS} />
          {hasPermission(Permission.ACCESS_ADMIN_PANEL) && (
            <NavGroup title="Admin" links={ADMIN_LINKS} />
          )}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
