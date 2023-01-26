import { createAction, props } from '@ngrx/store';
import { Station } from 'src/models/station';
import { StationResponse } from 'src/models/stationResponse';

export const updateCurrentStation = createAction(
  '[Station List] updateCurrentStation',
  props<Station>()
);

export const loadTempValuesSuccess = createAction(
  '[Current Station] loadTempValuesSuccess',
  props<any>()
);

export const loadTempValuesFailure = createAction(
  '[Current Station] loadTempValuesFailure',
  props<any>()
);
