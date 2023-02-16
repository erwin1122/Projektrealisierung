import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { GlobalState } from 'src/models/globalState';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl: string = 'https://localhost:44326/';

  private startYear: number = 0;
  private endYear: number = 20000;

  constructor(private http: HttpClient, private store: Store<GlobalState>) {
    this.store
      .select((state) => state.state.currentFocus)
      .subscribe((focus) => {
        this.startYear = focus.startYear;
        this.endYear = focus.endYear;
      });
  }

  getInitialStationData(stationId: string | undefined) {
    if (stationId) {
      return this.http.get(
        this.baseUrl +
          `${stationId}/range?startYear=${this.startYear}&endYear=${this.endYear}`
      );
    } else {
      return null;
    }
  }

  getYear(stationId: string | undefined, year: number) {
    return this.http.get(this.baseUrl + `${stationId}/year?year=${year}`);
  }

  getMonth(stationId: string | undefined, year: number, month: number) {
    return this.http.get(
      this.baseUrl + `${stationId}/month?year=${year}&month=${month}`
    );
  }
}
