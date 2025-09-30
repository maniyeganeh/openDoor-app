// src/context/AuthContext.tsx
import { createContext, useReducer, useContext, ReactNode } from 'react';

interface User {
  id: string;
  name?: string;
  role: 'admin' | 'consultant' | 'developer';
  token: string;
  email?: string;
  mobile?: string;
  isVerified?: boolean;
}

interface AuthState {
  user: User | null;
  token: string | null;
}

type Action = { type: 'LOGIN'; payload: User } | { type: 'LOGOUT' };

const initialState: AuthState = {
  user: null,
  token: null,
};

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload, token: action.payload.token };
    case 'LOGOUT':
      return { user: null, token: null };
    default:
      return state;
  }
}

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<Action>;
}>({ state: initialState, dispatch: () => null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState, () => {
    const storedUser = localStorage.getItem('user');
    return storedUser
      ? { user: JSON.parse(storedUser), token: JSON.parse(storedUser).token }
      : initialState;
  });

  const customDispatch = (action: Action) => {
    switch (action.type) {
      case 'LOGIN':
        localStorage.setItem('user', JSON.stringify(action.payload));
        break;
      case 'LOGOUT':
        localStorage.removeItem('user');
        break;
    }
    dispatch(action);
  };

  return (
    <AuthContext.Provider value={{ state, dispatch: customDispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook سفارشی برای دسترسی سریع به AuthContext
export const useAuth = () => useContext(AuthContext);

// Helper برای ارسال درخواست‌های Protected API
export const authHeader = (token?: string) => ({
  headers: {
    Authorization: `Bearer ${
      token || JSON.parse(localStorage.getItem('user') || '{}').token || ''
    }`,
  },
});
