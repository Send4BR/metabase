/* @flow */

import {
  createAction,
  handleActions,
  createThunkAction,
} from "metabase/lib/redux";

import { push } from "react-router-redux";
import Cookies from "js-cookie";

import { CLOSE_QB_NEWB_MODAL } from "metabase/query_builder/actions";
import { LOGOUT } from "metabase/auth/auth";

import { UserApi } from "metabase/services";

import { METABASE_SESSION_COOKIE } from "metabase/lib/cookies";

// inject token
export const LOGIN_BY_INJECTED_TOKEN = "metabase/auth/LOGIN_BY_INJECTED_TOKEN";
export const loginByInjectedToken = createThunkAction(
  LOGIN_BY_INJECTED_TOKEN,
  (token, redirectUrl) => async (dispatch, getState) => {
    Cookies.remove(METABASE_SESSION_COOKIE);
    Cookies.set(METABASE_SESSION_COOKIE, token);

    try {
      await UserApi.current();
      dispatch(push(redirectUrl || "/"));
    } catch (e) {
      dispatch(push("/"));
    }
  },
);

export const REFRESH_CURRENT_USER = "metabase/user/REFRESH_CURRENT_USER";
export const refreshCurrentUser = createAction(REFRESH_CURRENT_USER, () => {
  try {
    return UserApi.current();
  } catch (e) {
    return null;
  }
});

export const LOAD_CURRENT_USER = "metabase/user/LOAD_CURRENT_USER";
export const loadCurrentUser = createThunkAction(
  LOAD_CURRENT_USER,
  () => async (dispatch, getState) => {
    if (!getState().currentUser) {
      await dispatch(refreshCurrentUser());
    }
  },
);

export const CLEAR_CURRENT_USER = "metabase/user/CLEAR_CURRENT_USER";
export const clearCurrentUser = createAction(CLEAR_CURRENT_USER);

export const currentUser = handleActions(
  {
    [LOGOUT]: { next: (state, { payload }) => null },
    [CLEAR_CURRENT_USER]: { next: (state, payload) => null },
    [REFRESH_CURRENT_USER]: { next: (state, { payload }) => payload },
    [CLOSE_QB_NEWB_MODAL]: {
      next: (state, { payload }) => ({ ...state, is_qbnewb: false }),
    },
  },
  null,
);
