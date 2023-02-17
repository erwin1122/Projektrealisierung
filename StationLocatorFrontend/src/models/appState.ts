import { SearchInput } from './searchInput';
import { Station } from './station';
import { TempValue } from './tempValue';

export interface AppState {
  technical: {
    scope: string;
    isLoading: boolean;
    currentSearch: SearchInput
  };
  currentFocus: {
    startYear: number;
    endYear: number;
    station: Station;
    values: Array<TempValue>;
  };
  stationsNearby: Station[];
}
