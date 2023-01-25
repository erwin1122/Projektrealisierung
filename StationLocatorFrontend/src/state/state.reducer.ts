import { createReducer, on } from '@ngrx/store';
import { AppState } from 'src/models/appState';
import * as Actions from './state.actions';

export const initialState: AppState = {
  currentStation: {},
  stationsNearby: [
    {
      id: '1',
      asl: '500',
      latitude: '48.8288',
      location: 'Deutschland',
      longitude: '8.1923',
    },
    {
      id: '2',
      asl: '500',
      latitude: '48.8288',
      location: 'Deutschland',
      longitude: '8.1923',
    },
    {
      id: '3',
      asl: '500',
      latitude: '48.8288',
      location: 'Deutschland',
      longitude: '8.1923',
    },
    {
      id: '4',
      asl: '500',
      latitude: '48.8288',
      location: 'Deutschland',
      longitude: '8.1923',
    },
    {
      id: '5',
      asl: '500',
      latitude: '48.8288',
      location: 'Deutschland',
      longitude: '8.1923',
    },
  ],
};

export const stateReducer = createReducer(
  initialState,
  on(Actions.updateCurrentStation, (state: AppState) => ({
    ...state,
    currentStation: {},
  }))
);
