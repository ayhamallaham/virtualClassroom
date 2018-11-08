import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ISession, defaultValue } from 'app/shared/model/session.model';

export const ACTION_TYPES = {
  SEARCH_SESSIONS: 'session/SEARCH_SESSIONS',
  FETCH_SESSION_LIST: 'session/FETCH_SESSION_LIST',
  FETCH_SESSION: 'session/FETCH_SESSION',
  CREATE_SESSION: 'session/CREATE_SESSION',
  UPDATE_SESSION: 'session/UPDATE_SESSION',
  DELETE_SESSION: 'session/DELETE_SESSION',
  RESET: 'session/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISession>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type SessionState = Readonly<typeof initialState>;

// Reducer

export default (state: SessionState = initialState, action): SessionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_SESSIONS):
    case REQUEST(ACTION_TYPES.FETCH_SESSION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SESSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_SESSION):
    case REQUEST(ACTION_TYPES.UPDATE_SESSION):
    case REQUEST(ACTION_TYPES.DELETE_SESSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_SESSIONS):
    case FAILURE(ACTION_TYPES.FETCH_SESSION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SESSION):
    case FAILURE(ACTION_TYPES.CREATE_SESSION):
    case FAILURE(ACTION_TYPES.UPDATE_SESSION):
    case FAILURE(ACTION_TYPES.DELETE_SESSION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_SESSIONS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_SESSION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_SESSION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_SESSION):
    case SUCCESS(ACTION_TYPES.UPDATE_SESSION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_SESSION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: {}
      };
    case ACTION_TYPES.RESET:
      return {
        ...initialState
      };
    default:
      return state;
  }
};

const apiUrl = 'api/sessions';
const apiSearchUrl = 'api/_search/sessions';

// Actions

export const getSearchEntities: ICrudSearchAction<ISession> = query => ({
  type: ACTION_TYPES.SEARCH_SESSIONS,
  payload: axios.get<ISession>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<ISession> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_SESSION_LIST,
  payload: axios.get<ISession>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ISession> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SESSION,
    payload: axios.get<ISession>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ISession> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SESSION,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ISession> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SESSION,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ISession> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SESSION,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
