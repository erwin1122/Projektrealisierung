import { Station } from './station';
import { TempValue } from './tempValue';

export interface AppState {
  technical: {
    scope: string;
    isLoading: boolean;
    currentSearch: {
      latitude?: number;
      longitude?: number;
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
