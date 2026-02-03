import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userId: string | null;
  login: (phoneNumber: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Check localStorage for existing session
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const login = async (phoneNumber: string) => {
    // For now, use phone number as userId directly
    // In production, you'd validate with backend
    const userId = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    if (userId.length >= 10) {
      localStorage.setItem('userId', userId);
      setUserId(userId);
    } else {
      throw new Error('Please enter a valid phone number');
    }
  };

  const logout = () => {
    localStorage.removeItem('userId');
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}