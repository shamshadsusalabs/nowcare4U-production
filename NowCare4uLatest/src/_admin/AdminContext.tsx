import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminContextType {
  admin: Admin | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('adminToken');
    const savedAdmin = localStorage.getItem('adminData');
    
    if (savedToken && savedAdmin) {
      setToken(savedToken);
      setAdmin(JSON.parse(savedAdmin));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    setToken(data.token);
    setAdmin(data.admin);
    localStorage.setItem('adminToken', data.token);
    localStorage.setItem('adminData', JSON.stringify(data.admin));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
  };

  return (
    <AdminContext.Provider value={{ admin, token, login, logout, loading }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminProvider');
  }
  return context;
}
