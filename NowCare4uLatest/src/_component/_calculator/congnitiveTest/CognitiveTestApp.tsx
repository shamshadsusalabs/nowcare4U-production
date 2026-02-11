import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../../auth/UserContext';
import CognitiveTest from './CognitiveTest';

export default function CognitiveTestApp() {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      const redirect = encodeURIComponent(location.pathname + location.search);
      navigate(`/login?redirect=${redirect}`);
    }
  }, [user, navigate, location]);

  return <CognitiveTest />;
}
