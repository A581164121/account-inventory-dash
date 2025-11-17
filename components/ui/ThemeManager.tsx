import React, { useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';

const ThemeManager: React.FC = () => {
    const { themeColors } = useAppContext();

    useEffect(() => {
        const root = document.documentElement;
        root.style.setProperty('--color-primary', themeColors.primary);
        root.style.setProperty('--color-secondary', themeColors.secondary);
    }, [themeColors]);

    return null; // This component does not render anything
};

export default ThemeManager;
