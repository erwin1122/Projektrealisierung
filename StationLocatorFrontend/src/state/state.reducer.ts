import { createReducer, on } from '@ngrx/store';
import { AppState } from 'src/models/appState';
import { Constants } from 'src/models/constants';
import { Station } from 'src/models/station';
import * as Actions from './state.actions';

export const initialState: AppState = {
  technical: {
    isLoading: false,
    currentSearch: {},
  },
  currentFocus: {
    station: {},
    values: [],
  },
  stationsNearby: [],
};

export const stateReducer = createReducer(
  initialState,
  on(
    Actions.updateCurrentStation,
    (state: AppState, selectedStation: Station) => ({
      ...state,
      currentFocus: {
        ...state.currentFocus,
        station: selectedStation,
      },
      technical: {
        ...state.technical,
        isLoading: true,
      },
    })
  ),
  on(Actions.loadTempValuesSuccess, (state: AppState, data) => {
    return {
      ...state,
      currentFocus: {
        ...state.currentFocus,
        values: data.values,
      },
      technical: {
        ...state.technical,
        isLoading: false,
      },
    };
  }),
  on(Actions.loadTempValuesFailure, (state: AppState) => ({
    ...state,
    technical: {
      ...state.technical,
      isLoading: false,
    },
  })),
  on(Actions.searchForStations, (state: AppState, searchInput) => ({
    ...state,
    technical: {
      ...state.technical,
      isLoading: true,
    },
  })),
  on(Actions.updateStationList, (state: AppState, data) => {
    return {
      ...state,
      stationsNearby: data.values,
      technical: {
        ...state.technical,
        isLoading: false,
      },
    };
  })
);
