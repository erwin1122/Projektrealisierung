import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as StateActions from './state.actions';
import { Store } from '@ngrx/store';
import { GlobalState } from 'src/models/globalState';
import { Station } from 'src/models/station';

@Injectable()
export class StateEffects {
  private baseURL = 'https://localhost:5001/';

  private startYear: number = 0;
  private endYear: number = 20000;
  private currentStation: Station | undefined;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<GlobalState>
  ) {
    this.store
      .select((state) => state.state.currentFocus)
      .subscribe((currentFocus) => {
        this.startYear = currentFocus.startYear;
        this.endYear = currentFocus.endYear;
        this.currentStation = currentFocus.station;
      });
  }

  loadDataRange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StateActions.loadTempValuesYears),
      mergeMap(() =>
        this.http
          .get(
            this.baseURL +
              this.currentStation?.id +
              `/range?startYear=${this.startYear}&endYear=${this.endYear}`
          )
          .pipe(
            map((data) => StateActions.loadTempValuesSuccess(data)),
            catchError((error) =>
              of(StateActions.loadTempValuesFailure({ error }))
            )
          )
      )
    )
  );

  loadYear$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StateActions.loadTempValuesYear),
      mergeMap((customDate) =>
        this.http
          .get(this.baseURL + this.currentStation?.id + `/year?year=${customDate.year}`)
          .pipe(
            map((data) => StateActions.loadTempValuesSuccess(data)),
            catchError((error) =>
              of(StateActions.loadTempValuesFailure({ error }))
            )
          )
      )
    )
  );

  loadMonth$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StateActions.loadTempValuesMonth),
      mergeMap((customDate) =>
        this.http
          .get(
            this.baseURL +
              this.currentStation?.id +
              `/month?year=${customDate.year}&month=${customDate.month}`
          )
          .pipe(
            map((data) => StateActions.loadTempValuesSuccess(data)),
            catchError((error) =>
              of(StateActions.loadTempValuesFailure({ error }))
            )
          )
      )
    )
  );

  searchStations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StateActions.searchForStations),
      mergeMap((searchInput) =>
        this.http
          .get(this.baseURL, {
            params: searchInput,
          })
          .pipe(
            map((data) => StateActions.updateStationList(data)),
            catchError((error) =>
              of(StateActions.loadTempValuesFailure({ error }))
            )
          )
      )
    )
  );
}
