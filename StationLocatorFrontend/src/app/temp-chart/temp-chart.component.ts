import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { ChartData } from 'src/models/chartData';
import { GlobalState } from 'src/models/globalState';
import { Station } from 'src/models/station';
import { StationResponse } from 'src/models/stationResponse';
import { TempValue } from 'src/models/tempValue';
import { ApiService } from 'src/services/api-service.service';

@Component({
  selector: 'app-temp-chart',
  templateUrl: './temp-chart.component.html',
  styleUrls: ['./temp-chart.component.css'],
})
export class TempChartComponent implements OnInit {
  apiData: StationResponse = { station: {}, values: [] };
  chartData: ChartData = {};

  currentStation: Station | undefined;
  currentStationId: string | undefined;
  currentScope: string = '';

  showSidebar: boolean = false;

  basicOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#7F7F7F',
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
      y: {
        ticks: {
          color: '#495057',
        },
        grid: {
          color: '#ebedef',
        },
      },
    },
  };

  constructor(
    private store: Store<GlobalState>,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.store
      .select((state) => state.state.currentFocus.station.id)
      .subscribe((id) => {
        this.currentStationId = id;
        this.getInitialData(this.currentStationId);
      });

    this.store
      .select((state) => state.state.currentFocus.station)
      .subscribe((station) => (this.currentStation = station));
  }

  toggleSidebar(){
    this.showSidebar = !this.showSidebar;
  }

  getInitialData(stationId: string | undefined) {
    this.apiService.getInitialStationData(stationId)?.subscribe((data: any) => {
      this.apiData = data;
      this.currentScope = 'year';
      this.extractData(data.values);
    });
  }

  extractData(values: TempValue[]) {
    if (this.currentScope == 'year') {
      this.extractYearScope(values);
    }
    if (this.currentScope == 'month') {
      this.extractMonthScope(values);
    }
    if (this.currentScope != 'month' && this.currentScope != 'year') {
      this.extractDayScope(values);
    }
  }

  selectData(e: any) {
    var stationId: string | undefined = this.currentStationId;
    var year: number = this.apiData.values[e.element.index].year;
    var month: number = this.apiData.values[e.element.index].month;

    if (this.currentScope == 'year') {
      this.apiService.getYear(stationId, year).subscribe((data: any) => {
        this.apiData = data;
        this.currentScope = 'month';
        this.extractData(data.values);
      });
    }
    if (this.currentScope == 'month') {
      this.apiService
        .getMonth(stationId, year, month)
        .subscribe((data: any) => {
          this.apiData = data;
          this.currentScope = '';
          this.extractData(data.values);
        });
    }
  }

  extractYearScope(values: TempValue[]) {
    var labels: string[] = [];
    var tMax: number[] = [];
    var tMin: number[] = [];
    var tMaxS: number[] = [];
    var tMinW: number[] = [];

    values.forEach((value) => {
      labels.push(value.year.toString());
      tMin.push(value.minTemp);
      tMax.push(value.maxTemp);
    });

    this.chartData = {
      datasets: [
        {
          label: 'TMAX',
          tension: 0.2,
          borderColor: '#FF0000',
          fill: false,
          data: tMax,
        },
        {
          label: 'TMIN',
          tension: 0.2,
          borderColor: '#2E75B6',
          fill: false,
          data: tMin,
        },
        {
          label: 'TMAX S',
          tension: 0.2,
          borderColor: '#70AD47',
          fill: false,
          data: tMaxS,
        },
        {
          label: 'TMIN W',
          tension: 0.2,
          borderColor: '#ED7D31',
          fill: false,
          data: tMinW,
        },
      ],
      labels: labels,
    };
  }

  extractMonthScope(values: TempValue[]) {
    var labels: string[] = [
      'Januar',
      'Februar',
      'März',
      'April',
      'Mai',
      'Juni',
      'Juli',
      'August',
      'September',
      'Oktober',
      'November',
      'Dezember',
    ];
    var tMax: number[] = [];
    var tMin: number[] = [];
    var tAvg: number[] = [];

    values.forEach((value) => {
      tMin.push(value.minTemp);
      tMax.push(value.maxTemp);
      tAvg.push((value.minTemp + value.maxTemp) / 2);
    });

    this.chartData = {
      datasets: [
        {
          label: 'TMAX',
          tension: 0.2,
          borderColor: '#FF0000',
          fill: false,
          data: tMax,
        },
        {
          label: 'TMIN',
          tension: 0.2,
          borderColor: '#2E75B6',
          fill: false,
          data: tMin,
        },
        {
          label: 'TAVG',
          tension: 0.2,
          borderColor: '#A6A6A6',
          fill: false,
          data: tAvg,
        },
      ],
      labels: labels,
    };
  }

  extractDayScope(values: TempValue[]) {
    var labels: string[] = [];
    var tMax: number[] = [];
    var tMin: number[] = [];

    values.forEach((value) => {
      labels.push(value.day.toString());
      tMin.push(value.minTemp);
      tMax.push(value.maxTemp);
    });

    this.chartData = {
      datasets: [
        {
          label: 'TMAX',
          tension: 0.2,
          borderColor: '#FF0000',
          fill: false,
          data: tMax,
        },
        {
          label: 'TMIN',
          tension: 0.2,
          borderColor: '#2E75B6',
          fill: false,
          data: tMin,
        },
      ],
      labels: labels,
    };
  }
}
