import { ChartData } from './chartData';
import { Station } from './station';
import { TempValue } from './tempValue';

export interface AppState {
  currentFocus: {
    station: Station,
    values: TempValue[],
    chartData: ChartData
  }
  stationsNearby: Station[],
  technical: {
    isLoading: boolean
  }
}
