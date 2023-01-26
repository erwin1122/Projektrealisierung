import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { StationResponse } from '../models/stationResponse'

import * as StateActions from './state.actions';

@Injectable()
export class StateEffects {
    private baseURL = "https://localhost:44326/"

    constructor(private actions$: Actions, private http: HttpClient) {}
  
    loadExample$ = createEffect(() =>
    this.actions$.pipe(
      ofType(StateActions.updateCurrentStation),
      mergeMap((selectedStation) =>
        this.http.get(this.baseURL + selectedStation.id + "/range?startYear=0&endYear=2000000").pipe(
          map((data) => StateActions.loadTempValuesSuccess(data)),
          catchError(error => of(StateActions.loadTempValuesFailure({ error })))
        )
      )
    )
  );
}