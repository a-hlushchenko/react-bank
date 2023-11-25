import React, {
  useState,
  useEffect,
  useReducer,
  useRef,
  useMemo,
  useCallback,
  memo,
  lazy,
  Suspense,
  createContext,
  useContext,
} from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";

import WelcomePage from "./page/welcome";
import SignupPage from "./page/signup";
import SigninPage from "./page/signin";
import SignupConfirmPage from "./page/signup-confirm";
import RecoveryPage from "./page/recovery";
import RecoveryConfirmPage from "./page/recovery-confirm";

import BalancePage from "./page/balance";
import NotificationsPage from "./page/notifications";
import SettingsPage from "./page/settings";
import ReceivePage from "./page/receive";
import SendPage from "./page/send";
import TransactionPage from "./page/transaction";

import AuthRoute from "./component/auth-route";
import PrivateRoute from "./component/private-route";
import PrivateAuthRoute from "./component/private-auth-route";

import { loadSession, saveSession } from "./utils/session";

const session = loadSession();

type AuthDataType = {
  token: string | null;
  user: { [key: string]: any };
};

type DashboardDataType = {
  user: { [key: string]: any };
};

type AUTH_DATA_ACTION = {
  type: AUTH_DATA_ACTION_TYPE;
  payload?: any;
};

type DASHBOARD_DATA_ACTION = {
  type: DASHBOARD_DATA_ACTION_TYPE;
  payload: any;
};

export enum AUTH_DATA_ACTION_TYPE {
  LOGIN,
  LOGOUT,
}

export enum DASHBOARD_DATA_ACTION_TYPE {
  UPDATE,
}

type AuthContextType = {
  state: AuthDataType;
  dispatch: React.Dispatch<AUTH_DATA_ACTION>;
};

type DashboardContextType = {
  state: DashboardDataType;
  dispatch: React.Dispatch<DASHBOARD_DATA_ACTION>;
};

export const AuthContext = createContext<AuthContextType | null>(null);
export const DashboardContext = createContext<DashboardContextType | null>(
  null
);

const notSigninUser = {
  token: "",
  user: {},
};

const authDataReducer: React.Reducer<AuthDataType, AUTH_DATA_ACTION> = (
  state: AuthDataType,
  action: AUTH_DATA_ACTION
) => {
  switch (action.type) {
    case AUTH_DATA_ACTION_TYPE.LOGIN:
      saveSession(action.payload);
      const session = loadSession();
      return session;
    case AUTH_DATA_ACTION_TYPE.LOGOUT:
      saveSession();

      return notSigninUser;
    default:
      return state;
  }
};

const dashboardDataReducer: React.Reducer<
  DashboardDataType,
  DASHBOARD_DATA_ACTION
> = (state: DashboardDataType, action: DASHBOARD_DATA_ACTION) => {
  switch (action.type) {
    case DASHBOARD_DATA_ACTION_TYPE.UPDATE:
      const user = action.payload;
      return { ...state, user: user };
    default:
      return state;
  }
};

const authDataInit = session ? session : notSigninUser;

const dashboardDataInit = { user: {} };

const App: React.FC<{}> = () => {
  const [authData, authDataDispatch] = useReducer(
    authDataReducer,
    authDataInit
  );
  const [dashboardData, dashboardDataDispatch] = useReducer(
    dashboardDataReducer,
    dashboardDataInit
  );

  const authContextData = {
    state: authData,
    dispatch: authDataDispatch,
  };

  const dashboardContextData = {
    state: dashboardData,
    dispatch: dashboardDataDispatch,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      <DashboardContext.Provider value={dashboardContextData}>
        <BrowserRouter>
          <Routes>
            <Route
              index
              element={
                <AuthRoute>
                  <WelcomePage />
                </AuthRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <AuthRoute>
                  <SignupPage />
                </AuthRoute>
              }
            />
            <Route
              path="/signup-confirm"
              element={
                <PrivateAuthRoute>
                  <SignupConfirmPage />
                </PrivateAuthRoute>
              }
            />
            <Route
              path="/signin"
              element={
                <AuthRoute>
                  <SigninPage />
                </AuthRoute>
              }
            />
            <Route
              path="/recovery"
              element={
                <AuthRoute>
                  <RecoveryPage />
                </AuthRoute>
              }
            />
            <Route
              path="/recovery-confirm"
              element={
                <AuthRoute>
                  <RecoveryConfirmPage />
                </AuthRoute>
              }
            />
            <Route
              path="/balance"
              element={
                <PrivateRoute>
                  <BalancePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <PrivateRoute>
                  <NotificationsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <PrivateRoute>
                  <SettingsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/receive"
              element={
                <PrivateRoute>
                  <ReceivePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/send"
              element={
                <PrivateRoute>
                  <SendPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/transaction/:transactionId"
              element={
                <PrivateRoute>
                  <TransactionPage />
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <AuthRoute>
                  <WelcomePage />
                </AuthRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </DashboardContext.Provider>
    </AuthContext.Provider>
  );
};

export default App;
