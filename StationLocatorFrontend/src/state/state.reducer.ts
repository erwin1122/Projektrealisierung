import { createReducer, on } from '@ngrx/store';
import { AppState } from 'src/models/appState';
import * as Actions from './state.actions';

export const initialState: AppState = {
  currentFocus: {
    Station: {},
    values: [
      {
        year: 2003,
        month: 1,
        day: 0,
        minTemp: 7.6333337,
        maxTemp: 15.013333,
        scope: 'month',
      },
      {
        year: 2003,
        month: 2,
        day: 0,
        minTemp: 5.2473683,
        maxTemp: 13.83,
        scope: 'month',
      },
      {
        year: 2003,
        month: 3,
        day: 0,
        minTemp: 9.012,
        maxTemp: 19.814285,
        scope: 'month',
      },
      {
        year: 2003,
        month: 4,
        day: 0,
        minTemp: 11.495652,
        maxTemp: 21.813044,
        scope: 'month',
      },
      {
        year: 2003,
        month: 5,
        day: 0,
        minTemp: 13.238889,
        maxTemp: 25.900002,
        scope: 'month',
      },
      {
        year: 2003,
        month: 6,
        day: 0,
        minTemp: 20.061111,
        maxTemp: 35.50741,
        scope: 'month',
      },
      {
        year: 2003,
        month: 7,
        day: 0,
        minTemp: 23.91154,
        maxTemp: 37.75714,
        scope: 'month',
      },
      {
        year: 2003,
        month: 8,
        day: 0,
        minTemp: 22.9625,
        maxTemp: 37.75926,
        scope: 'month',
      },
      {
        year: 2003,
        month: 9,
        day: 0,
        minTemp: 19.286364,
        maxTemp: 30.65909,
        scope: 'month',
      },
      {
        year: 2003,
        month: 10,
        day: 0,
        minTemp: 16.096153,
        maxTemp: 26.851725,
        scope: 'month',
      },
      {
        year: 2003,
        month: 11,
        day: 0,
        minTemp: 12.086364,
        maxTemp: 20.976002,
        scope: 'month',
      },
      {
        year: 2003,
        month: 12,
        day: 0,
        minTemp: 7.2727275,
        maxTemp: 15.525001,
        scope: 'month',
      },
    ],
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
      Station: selectedStation,
    },
  })),
  on(Actions.loadTempValuesSuccess, (state: AppState, data) => ({
    ...state,
    currentFocus: {
      ...state.currentFocus,
      values: data.values,
    },
  }))
);
