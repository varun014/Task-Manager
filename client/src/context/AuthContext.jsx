import { createContext, useEffect, useMemo, useReducer } from 'react';
import { loginApi, meApi, signupApi } from '../api/authApi';

export const AuthContext = createContext(null);

const initialState = {
  user: null,
  token: localStorage.getItem('ttm_token'),
  loading: true
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loading: false
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        loading: false
      };
    case 'LOGOUT':
      return {
        ...state,
        token: null,
        user: null,
        loading: false
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

const extractMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.errors?.[0]?.message ||
    error.message ||
    'Something went wrong'
  );
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const bootstrapUser = async () => {
      if (!state.token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const response = await meApi();
        dispatch({ type: 'SET_USER', payload: response.user });
      } catch (error) {
        localStorage.removeItem('ttm_token');
        dispatch({ type: 'LOGOUT' });
      }
    };

    bootstrapUser();
  }, [state.token]);

  const login = async (payload) => {
    const response = await loginApi(payload);
    localStorage.setItem('ttm_token', response.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response });
    return response;
  };

  const signup = async (payload) => {
    const response = await signupApi(payload);
    localStorage.setItem('ttm_token', response.token);
    dispatch({ type: 'LOGIN_SUCCESS', payload: response });
    return response;
  };

  const logout = () => {
    localStorage.removeItem('ttm_token');
    dispatch({ type: 'LOGOUT' });
  };

  const refreshUser = async () => {
    try {
      const response = await meApi();
      dispatch({ type: 'SET_USER', payload: response.user });
    } catch (error) {
      throw new Error(extractMessage(error));
    }
  };

  const value = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      loading: state.loading,
      isAuthenticated: Boolean(state.token),
      login,
      signup,
      logout,
      refreshUser,
      extractMessage
    }),
    [state.user, state.token, state.loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
