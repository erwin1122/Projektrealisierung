import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: string = "https://localhost:44326/";

  constructor(private http: HttpClient) { }

  getInitialStationData(stationId: string | undefined) {
    if(stationId){
      return this.http.get(this.baseUrl + `${stationId}/range?startYear=0&endYear=2000000`);
    } else {
      return null;
    }
  }

  getYear(stationId: string | undefined, year: number){
    return this.http.get(this.baseUrl + `${stationId}/year?year=${year}`);
  }

  getMonth(stationId: string | undefined, year: number, month: number){
    return this.http.get(this.baseUrl + `${stationId}/month?year=${year}&month=${month}`);
  }
}
