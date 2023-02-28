import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import * as StateActions from './state.actions';
import { Store } from '@ngrx/store';
import { GlobalState } from 'src/models/globalState';

@Injectable()
export class StateEffects {
  private baseURL = 'https://localhost:5001/';

  private startYear: number = 0;
  private endYear: number = 20000;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<GlobalState>
  ) {
    this.store
      .select((state) => state.state.currentFocus)
      .subscribe((focus) => {
        this.startYear = focus.startYear;
        this.endYear = focus.endYear;
      });
  }

  loadCompleteData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StateActions.updateCurrentStation),
      mergeMap((selectedStation) =>
        this.http
          .get(
            this.baseURL +
              selectedStation.id +
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
