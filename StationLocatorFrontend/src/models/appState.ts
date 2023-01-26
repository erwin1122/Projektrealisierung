import { Station } from './station';
import { TempValue } from './tempValue';

export interface AppState {
  currentFocus: {
    Station: Station,
    values: TempValue[]
  }
  stationsNearby: Station[];
}
