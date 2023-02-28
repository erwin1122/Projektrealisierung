import { createAction, props } from '@ngrx/store';
import { Station } from 'src/models/station';
import { CustomDate } from 'src/models/customDate';

export const updateCurrentStation = createAction(
  '[Station List] updateCurrentStation',
  props<Station>()
);

export const loadTempValuesYears = createAction(
  '[Current Station] load Temp Values Years (Range)'
);

export const loadTempValuesYear = createAction(
  '[Current Station] load Temp Values Year',
  props<CustomDate>()
)

export const loadTempValuesMonth = createAction(
  "[Current Station] load Temp Values Month",
  props<CustomDate>()
)

export const loadTempValuesSuccess = createAction(
  '[Current Station] loadTempValuesSuccess',
  props<any>()
);

export const loadTempValuesFailure = createAction(
  '[Current Station] loadTempValuesFailure',
  props<any>()
);

export const searchForStations = createAction(
  '[Station List] search for Stations',
  props<any>()
);

export const updateStationList = createAction(
  '[Station List] update Station List',
  props<any>()
);

export const setDateRange = createAction(
  '[Station List] set Date Range',
  props<any>()
);

export const setScope = createAction('[Technical] set Scope', props<any>());
