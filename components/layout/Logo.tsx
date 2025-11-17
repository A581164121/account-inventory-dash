import React from 'react';

const defaultLogoSrc = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0ibm9uZSI+PGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIHJ4PSIyMCIgZmlsbD0iIzRmNDZlNSIvPjxyZWN0IHg9IjI1IiB5PSI2MCIgd2lkdGg9IjE1IiBoZWlnaHQ9IjIwIiByeD0iNSIgZmlsbD0iI2ZmZmZmZiIvPjxyZWN0IHg9IjQ1IiB5PSI0NSIgd2lkdGg9IjE1IiBoZWlnaHQ9IjM1IiByeD0iNSIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjgiLz48cmVjdCB4PSI2NSIgeT0iMjAiIHdpZHRoPSIxNSIgaGVpZ2h0PSI2MCIgcng9IjUiIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC42Ii8+PC9nPjxkZWZzPjxjbGlwUGF0aCBpZD0iY2xpcDAiPjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMjAiLz48L2NsaXBQYXRoPjwvZGVmcz48L3N2Zz4=";


interface LogoProps {
  src?: string | null;
  style?: React.CSSProperties;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ src, style, className }) => {
  return (
    <img 
      src={src || defaultLogoSrc} 
      alt="Accounting ERP Logo" 
      style={{ height: '40px', objectFit: 'contain', ...style }} 
      className={className}
    />
  );
};

export default Logo;
