import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { ISubmission, defaultValue } from 'app/shared/model/submission.model';

export const ACTION_TYPES = {
  SEARCH_SUBMISSIONS: 'submission/SEARCH_SUBMISSIONS',
  FETCH_SUBMISSION_LIST: 'submission/FETCH_SUBMISSION_LIST',
  FETCH_SUBMISSION: 'submission/FETCH_SUBMISSION',
  CREATE_SUBMISSION: 'submission/CREATE_SUBMISSION',
  UPDATE_SUBMISSION: 'submission/UPDATE_SUBMISSION',
  DELETE_SUBMISSION: 'submission/DELETE_SUBMISSION',
  RESET: 'submission/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<ISubmission>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type SubmissionState = Readonly<typeof initialState>;

// Reducer

export default (state: SubmissionState = initialState, action): SubmissionState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_SUBMISSIONS):
    case REQUEST(ACTION_TYPES.FETCH_SUBMISSION_LIST):
    case REQUEST(ACTION_TYPES.FETCH_SUBMISSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_SUBMISSION):
    case REQUEST(ACTION_TYPES.UPDATE_SUBMISSION):
    case REQUEST(ACTION_TYPES.DELETE_SUBMISSION):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_SUBMISSIONS):
    case FAILURE(ACTION_TYPES.FETCH_SUBMISSION_LIST):
    case FAILURE(ACTION_TYPES.FETCH_SUBMISSION):
    case FAILURE(ACTION_TYPES.CREATE_SUBMISSION):
    case FAILURE(ACTION_TYPES.UPDATE_SUBMISSION):
    case FAILURE(ACTION_TYPES.DELETE_SUBMISSION):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_SUBMISSIONS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_SUBMISSION_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_SUBMISSION):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_SUBMISSION):
    case SUCCESS(ACTION_TYPES.UPDATE_SUBMISSION):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_SUBMISSION):
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

const apiUrl = 'api/submissions';
const apiSearchUrl = 'api/_search/submissions';

// Actions

export const getSearchEntities: ICrudSearchAction<ISubmission> = query => ({
  type: ACTION_TYPES.SEARCH_SUBMISSIONS,
  payload: axios.get<ISubmission>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<ISubmission> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_SUBMISSION_LIST,
  payload: axios.get<ISubmission>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<ISubmission> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_SUBMISSION,
    payload: axios.get<ISubmission>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<ISubmission> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_SUBMISSION,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<ISubmission> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_SUBMISSION,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<ISubmission> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_SUBMISSION,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
