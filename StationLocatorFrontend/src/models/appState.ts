import { Station } from './station';

export interface AppState {
  currentStation: Station;
  stationsNearby: Station[];
}
