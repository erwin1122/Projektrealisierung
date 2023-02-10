import { Station } from './station';
import { StationResponse } from './stationResponse';

export interface AppState {
  technical: {
    isLoading: boolean;
    currentSearch: {
      longitude?: number;
      latitude?: number;
      country?: string;
      startYear?: number;
      endYear?: number;
      count?: number;
    };
  };
  currentFocus: StationResponse;
  stationsNearby: Station[];
}
