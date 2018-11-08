import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IStudyGroup, defaultValue } from 'app/shared/model/study-group.model';

export const ACTION_TYPES = {
  SEARCH_STUDYGROUPS: 'studyGroup/SEARCH_STUDYGROUPS',
  FETCH_STUDYGROUP_LIST: 'studyGroup/FETCH_STUDYGROUP_LIST',
  FETCH_STUDYGROUP: 'studyGroup/FETCH_STUDYGROUP',
  CREATE_STUDYGROUP: 'studyGroup/CREATE_STUDYGROUP',
  UPDATE_STUDYGROUP: 'studyGroup/UPDATE_STUDYGROUP',
  DELETE_STUDYGROUP: 'studyGroup/DELETE_STUDYGROUP',
  RESET: 'studyGroup/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IStudyGroup>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type StudyGroupState = Readonly<typeof initialState>;

// Reducer

export default (state: StudyGroupState = initialState, action): StudyGroupState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_STUDYGROUPS):
    case REQUEST(ACTION_TYPES.FETCH_STUDYGROUP_LIST):
    case REQUEST(ACTION_TYPES.FETCH_STUDYGROUP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_STUDYGROUP):
    case REQUEST(ACTION_TYPES.UPDATE_STUDYGROUP):
    case REQUEST(ACTION_TYPES.DELETE_STUDYGROUP):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_STUDYGROUPS):
    case FAILURE(ACTION_TYPES.FETCH_STUDYGROUP_LIST):
    case FAILURE(ACTION_TYPES.FETCH_STUDYGROUP):
    case FAILURE(ACTION_TYPES.CREATE_STUDYGROUP):
    case FAILURE(ACTION_TYPES.UPDATE_STUDYGROUP):
    case FAILURE(ACTION_TYPES.DELETE_STUDYGROUP):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_STUDYGROUPS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_STUDYGROUP_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_STUDYGROUP):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_STUDYGROUP):
    case SUCCESS(ACTION_TYPES.UPDATE_STUDYGROUP):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_STUDYGROUP):
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

const apiUrl = 'api/study-groups';
const apiSearchUrl = 'api/_search/study-groups';

// Actions

export const getSearchEntities: ICrudSearchAction<IStudyGroup> = query => ({
  type: ACTION_TYPES.SEARCH_STUDYGROUPS,
  payload: axios.get<IStudyGroup>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<IStudyGroup> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_STUDYGROUP_LIST,
  payload: axios.get<IStudyGroup>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IStudyGroup> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_STUDYGROUP,
    payload: axios.get<IStudyGroup>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IStudyGroup> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_STUDYGROUP,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IStudyGroup> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_STUDYGROUP,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IStudyGroup> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_STUDYGROUP,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
