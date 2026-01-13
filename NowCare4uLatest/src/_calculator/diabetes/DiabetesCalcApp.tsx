import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../auth/UserContext';
import DiabetesCalc from './DiabetesCalc';

export default function DiabetesCalcApp() {
  const { user, token } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user || !token) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?redirect=${redirect}`);
    }
  }, [user, token, navigate, location]);

  if (!user || !token) return null;

  return <DiabetesCalc />;
}
