import { Station } from './station';
import { TempValue } from './tempValue';

export interface StationResponse {
  station: Station;
  values: TempValue[];
}
