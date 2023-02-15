import { Station } from './station';
import { StationResponse } from './stationResponse';
import { TempValue } from './tempValue';

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
  currentFocus: {
    startYear: number;
    endYear: number;
    station: Station;
    values: Array<TempValue>;
  };
  stationsNearby: Station[];
}
