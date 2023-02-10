import { createReducer, on } from '@ngrx/store';
import { AppState } from 'src/models/appState';
import { Station } from 'src/models/station';
import { TempValue } from 'src/models/tempValue';
import * as Actions from './state.actions';

export const initialState: AppState = {
  technical: {
    isLoading: false,
    currentSearch: {},
  },
  currentFocus: {
    station: {
      id: 'AGE00147708',
    },
    values: [],
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
    console.log(data);
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
    console.log(data);
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
