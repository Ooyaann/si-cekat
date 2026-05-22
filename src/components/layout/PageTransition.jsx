import { useLocation } from 'react-router-dom';

export const PageTransition = ({ children }) => {
  const location = useLocation();

  return (
    <div key={location.pathname} className="page-transition">
      {children}
    </div>
  );
};
