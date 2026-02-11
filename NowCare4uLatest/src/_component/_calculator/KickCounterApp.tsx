import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../auth/UserContext';
import KickCounter from './kickCounter';

export default function KickCounterApp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  useEffect(() => {
    if (!user) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?redirect=${redirect}`);
    }
  }, [user, navigate, location]);

  return <KickCounter />;
}
