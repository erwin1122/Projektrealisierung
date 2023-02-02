import { Station } from './station';

export interface AppState {
  technical: {
    isLoading: boolean;
  };
  currentFocus: {
    station: Station;
  };
  stationsNearby: Station[];
}
