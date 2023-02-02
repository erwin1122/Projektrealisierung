import { createReducer, on } from '@ngrx/store';
import { AppState } from 'src/models/appState';
import * as Actions from './state.actions';

export const initialState: AppState = {
  technical: {
    isLoading: false,
  },
  currentFocus: {
    station: {
      id: 'AGE00147708',
    },
  },
  stationsNearby: [
    {
      id: 'AGE00147708',
      asl: '100',
      latitude: '48.8288',
      location: 'Deutschland',
      longitude: '8.1923',
    },
    {
      id: 'AEM00041194',
      asl: '200',
      latitude: '48.8288',
      location: 'Deutschland',
      longitude: '8.1923',
    },
    {
      id: 'AGM00060518',
      asl: '300',
      latitude: '48.8288',
      location: 'Deutschland',
      longitude: '8.1923',
    },
    {
      id: 'ASN00006050',
      asl: '400',
      latitude: '48.8288',
      location: 'Deutschland',
      longitude: '8.1923',
    },
    {
      id: 'US1COMF0027',
      asl: '500',
      latitude: '48.8288',
      location: 'Deutschland',
      longitude: '8.1923',
    },
  ],
};

export const stateReducer = createReducer(
  initialState,
  on(Actions.updateCurrentStation, (state: AppState, selectedStation) => ({
    ...state,
    currentFocus: {
      ...state.currentFocus,
      station: selectedStation,
    },
    technical: {
      ...state.technical,
      isLoading: true,
    },
  })),
  on(Actions.loadTempValuesSuccess, (state: AppState, data) => ({
    ...state,
    currentFocus: {
      ...state.currentFocus,
      values: data.values,
    },
    technical: {
      ...state.technical,
      isLoading: false,
    },
  }))
);
