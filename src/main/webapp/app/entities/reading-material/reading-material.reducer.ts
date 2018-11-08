import axios from 'axios';
import { ICrudSearchAction, ICrudGetAction, ICrudGetAllAction, ICrudPutAction, ICrudDeleteAction } from 'react-jhipster';

import { cleanEntity } from 'app/shared/util/entity-utils';
import { REQUEST, SUCCESS, FAILURE } from 'app/shared/reducers/action-type.util';

import { IReadingMaterial, defaultValue } from 'app/shared/model/reading-material.model';

export const ACTION_TYPES = {
  SEARCH_READINGMATERIALS: 'readingMaterial/SEARCH_READINGMATERIALS',
  FETCH_READINGMATERIAL_LIST: 'readingMaterial/FETCH_READINGMATERIAL_LIST',
  FETCH_READINGMATERIAL: 'readingMaterial/FETCH_READINGMATERIAL',
  CREATE_READINGMATERIAL: 'readingMaterial/CREATE_READINGMATERIAL',
  UPDATE_READINGMATERIAL: 'readingMaterial/UPDATE_READINGMATERIAL',
  DELETE_READINGMATERIAL: 'readingMaterial/DELETE_READINGMATERIAL',
  RESET: 'readingMaterial/RESET'
};

const initialState = {
  loading: false,
  errorMessage: null,
  entities: [] as ReadonlyArray<IReadingMaterial>,
  entity: defaultValue,
  updating: false,
  updateSuccess: false
};

export type ReadingMaterialState = Readonly<typeof initialState>;

// Reducer

export default (state: ReadingMaterialState = initialState, action): ReadingMaterialState => {
  switch (action.type) {
    case REQUEST(ACTION_TYPES.SEARCH_READINGMATERIALS):
    case REQUEST(ACTION_TYPES.FETCH_READINGMATERIAL_LIST):
    case REQUEST(ACTION_TYPES.FETCH_READINGMATERIAL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        loading: true
      };
    case REQUEST(ACTION_TYPES.CREATE_READINGMATERIAL):
    case REQUEST(ACTION_TYPES.UPDATE_READINGMATERIAL):
    case REQUEST(ACTION_TYPES.DELETE_READINGMATERIAL):
      return {
        ...state,
        errorMessage: null,
        updateSuccess: false,
        updating: true
      };
    case FAILURE(ACTION_TYPES.SEARCH_READINGMATERIALS):
    case FAILURE(ACTION_TYPES.FETCH_READINGMATERIAL_LIST):
    case FAILURE(ACTION_TYPES.FETCH_READINGMATERIAL):
    case FAILURE(ACTION_TYPES.CREATE_READINGMATERIAL):
    case FAILURE(ACTION_TYPES.UPDATE_READINGMATERIAL):
    case FAILURE(ACTION_TYPES.DELETE_READINGMATERIAL):
      return {
        ...state,
        loading: false,
        updating: false,
        updateSuccess: false,
        errorMessage: action.payload
      };
    case SUCCESS(ACTION_TYPES.SEARCH_READINGMATERIALS):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_READINGMATERIAL_LIST):
      return {
        ...state,
        loading: false,
        entities: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.FETCH_READINGMATERIAL):
      return {
        ...state,
        loading: false,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.CREATE_READINGMATERIAL):
    case SUCCESS(ACTION_TYPES.UPDATE_READINGMATERIAL):
      return {
        ...state,
        updating: false,
        updateSuccess: true,
        entity: action.payload.data
      };
    case SUCCESS(ACTION_TYPES.DELETE_READINGMATERIAL):
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

const apiUrl = 'api/reading-materials';
const apiSearchUrl = 'api/_search/reading-materials';

// Actions

export const getSearchEntities: ICrudSearchAction<IReadingMaterial> = query => ({
  type: ACTION_TYPES.SEARCH_READINGMATERIALS,
  payload: axios.get<IReadingMaterial>(`${apiSearchUrl}?query=` + query)
});

export const getEntities: ICrudGetAllAction<IReadingMaterial> = (page, size, sort) => ({
  type: ACTION_TYPES.FETCH_READINGMATERIAL_LIST,
  payload: axios.get<IReadingMaterial>(`${apiUrl}?cacheBuster=${new Date().getTime()}`)
});

export const getEntity: ICrudGetAction<IReadingMaterial> = id => {
  const requestUrl = `${apiUrl}/${id}`;
  return {
    type: ACTION_TYPES.FETCH_READINGMATERIAL,
    payload: axios.get<IReadingMaterial>(requestUrl)
  };
};

export const createEntity: ICrudPutAction<IReadingMaterial> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.CREATE_READINGMATERIAL,
    payload: axios.post(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const updateEntity: ICrudPutAction<IReadingMaterial> = entity => async dispatch => {
  const result = await dispatch({
    type: ACTION_TYPES.UPDATE_READINGMATERIAL,
    payload: axios.put(apiUrl, cleanEntity(entity))
  });
  dispatch(getEntities());
  return result;
};

export const deleteEntity: ICrudDeleteAction<IReadingMaterial> = id => async dispatch => {
  const requestUrl = `${apiUrl}/${id}`;
  const result = await dispatch({
    type: ACTION_TYPES.DELETE_READINGMATERIAL,
    payload: axios.delete(requestUrl)
  });
  dispatch(getEntities());
  return result;
};

export const reset = () => ({
  type: ACTION_TYPES.RESET
});
