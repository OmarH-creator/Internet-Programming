import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer
} from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

const initialState = {
  user: authService.getStoredUser(),
  token: authService.getStoredToken(),
  isAuthenticated: Boolean(authService.getStoredToken()),
  loading: true,
  error: null
};

const AUTH_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGOUT: "LOGOUT",
  UPDATE_USER: "UPDATE_USER"
};

function getErrorMessage(error, fallback) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return fallback;
}

function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload
        }
      };

    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const saveSession = useCallback(({ token, user }) => {
    authService.persistSession({ token, user });

    dispatch({
      type: AUTH_ACTIONS.LOGIN_SUCCESS,
      payload: { token, user }
    });
  }, []);

  const clearSession = useCallback(() => {
    authService.clearSession();

    dispatch({
      type: AUTH_ACTIONS.LOGOUT
    });
  }, []);

  const loadMe = useCallback(async () => {
    const token = authService.getStoredToken();

    if (!token) {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return;
    }

    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authService.getCurrentUser();
      const user = response.data?.data?.user || response.data?.user || null;

      if (!user) {
        throw new Error("Invalid user response");
      }

      // Ignore stale /me responses if a newer token was saved while this request was in flight.
      if (authService.getStoredToken() !== token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      saveSession({ token, user });
    } catch (error) {
      // Do not clear a fresh session due to an older token validation request failing.
      if (authService.getStoredToken() !== token) {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        return;
      }

      clearSession();
      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: getErrorMessage(error, "Session expired. Please log in again.")
      });
    }
  }, [saveSession, clearSession]);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const register = useCallback(
    async ({ username, email, password }) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await authService.register({ username, email, password });
        const { token, user } = authService.persistSessionFromResponse(response);

        saveSession({ token, user });

        return { success: true };
      } catch (error) {
        const message = getErrorMessage(error, "Registration failed");

        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: message
        });

        return { success: false, message };
      }
    },
    [saveSession]
  );

  const login = useCallback(
    async ({ identifier, password }) => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
        dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

        const response = await authService.login({ identifier, password });
        const { token, user } = authService.persistSessionFromResponse(response);

        saveSession({ token, user });

        return { success: true };
      } catch (error) {
        const message = getErrorMessage(error, "Login failed");

        dispatch({
          type: AUTH_ACTIONS.SET_ERROR,
          payload: message
        });

        return { success: false, message };
      }
    },
    [saveSession]
  );

  const logout = useCallback(async () => {
    dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
    clearSession();
  }, [clearSession]);

  const forgotPassword = useCallback(async ({ email }) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authService.forgotPassword({ email });

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const message = getErrorMessage(error, "Password reset request failed");

      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: message
      });

      return { success: false, message };
    }
  }, []);

  const resetPassword = useCallback(async ({ token, password }) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authService.resetPassword({ token, password });

      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      const message = getErrorMessage(error, "Password reset failed");

      dispatch({
        type: AUTH_ACTIONS.SET_ERROR,
        payload: message
      });

      return { success: false, message };
    }
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  const updateUser = useCallback(
    (userData) => {
      dispatch({
        type: AUTH_ACTIONS.UPDATE_USER,
        payload: userData
      });

      const currentUser = authService.getStoredUser();
      if (currentUser) {
        authService.persistSession({
          token: state.token,
          user: { ...currentUser, ...userData }
        });
      }
    },
    [state.token]
  );

  const value = useMemo(() => {
    return {
      ...state,
      register,
      login,
      logout,
      loadMe,
      clearError,
      updateUser,
      forgotPassword,
      resetPassword
    };
  }, [
    state,
    register,
    login,
    logout,
    loadMe,
    clearError,
    updateUser,
    forgotPassword,
    resetPassword
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
