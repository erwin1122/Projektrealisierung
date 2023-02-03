import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartData } from 'src/models/chartData';
import { DataLine } from 'src/models/dataLine';
import { GlobalState } from 'src/models/globalState';
import { Label } from 'src/models/label';
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
  months: string[] = [
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
  gesamtWerteCheckbox = true;
  meteoWerteCheckbox = false;
  basicCheckboxes: DataLine[] = [
    {
      label: Label.TMIN,
      tension: 0.2,
      borderColor: '#2E75B6',
      fill: false,
    },
    {
      label: Label.TMAX,
      tension: 0.2,
      borderColor: '#FF0000',
      fill: false,
    },
  ];
  meteoCheckboxes: DataLine[] = [
    {
      label: Label.TMINF,
      tension: 0.2,
      borderColor: '#FF99FF',
      fill: false,
    },
    {
      label: Label.TMAXF,
      tension: 0.2,
      borderColor: '#CC0099',
      fill: false,
    },
    {
      label: Label.TMINS,
      tension: 0.2,
      borderColor: '#A9D18E',
      fill: false,
    },
    {
      label: Label.TMAXS,
      tension: 0.2,
      borderColor: '#548235',
      fill: false,
    },
    {
      label: Label.TMINH,
      tension: 0.2,
      borderColor: '#FFC000',
      fill: false,
    },
    {
      label: Label.TMAXH,
      tension: 0.2,
      borderColor: '#ED7D31',
      fill: false,
    },
    {
      label: Label.TMINW,
      tension: 0.2,
      borderColor: '#66FFFF',
      fill: false,
    },
    {
      label: Label.TMAXW,
      tension: 0.2,
      borderColor: '#000099',
      fill: false,
    },
  ];
  selectedCategories: DataLine[] = [];

  searchInput: any;

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
    this.toggleGesamtwerte();

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

  toggleGesamtwerte() {
    if (!this.gesamtWerteCheckbox) {
      this.selectedCategories = this.selectedCategories.filter(
        (x) => !this.basicCheckboxes.includes(x)
      );
    }

    if (this.gesamtWerteCheckbox) {
      this.basicCheckboxes.forEach((box) => {
        this.selectedCategories = this.selectedCategories.filter((x) =>
          this.selectedCategories.includes(x)
        );
        this.selectedCategories.push(box);
      });
    }

    this.extractData(this.apiData.values);
  }

  toggleMeteoWerte() {
    if (!this.meteoWerteCheckbox) {
      this.selectedCategories = this.selectedCategories.filter(
        (x) => !this.meteoCheckboxes.includes(x)
      );
    }

    if (this.meteoWerteCheckbox) {
      this.meteoCheckboxes.forEach((box) => {
        this.selectedCategories = this.selectedCategories.filter((x) =>
          this.selectedCategories.includes(x)
        );
        this.selectedCategories.push(box);
      });
    }

    this.extractData(this.apiData.values);
  }

  getChartHeader() {
    if (this.currentScope == 'year') {
      return `Mittelwerte für Station ${this.currentStationId} | ${
        this.apiData.values[0]?.year
      } - ${this.apiData.values[this.apiData.values.length - 1]?.year}`;
    }

    if (this.currentScope == 'month') {
      return `Monatliche Mittelwerte für Station ${this.currentStationId} | ${this.apiData.values[0]?.year}`;
    }

    if (this.currentScope == '') {
      return `Werte für Station ${this.currentStationId} | ${
        this.months[this.apiData.values[0]?.month - 1]
      } ${this.apiData.values[0]?.year}`;
    }

    return '';
  }

  searchYear(e: any) {
    if (this.searchInput) {
      var year: number = +this.searchInput;

      this.apiService
        .getYear(this.currentStationId, year)
        .subscribe((data: any) => {
          this.apiData = data;
          this.currentScope = 'month';
          this.extractData(data.values);
        });
    }
  }

  searchMonth(e: any) {
    var month: number = this.searchInput.getMonth() + 1;
    var year: number = this.apiData.values[0].year;

    this.apiService
      .getMonth(this.currentStationId, year, month)
      .subscribe((data: any) => {
        this.apiData = data;
        this.currentScope = '';
        this.extractData(data.values);
      });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  getInitialData(stationId: string | undefined) {
    this.apiService.getInitialStationData(stationId)?.subscribe((data: any) => {
      this.apiData = data;
      this.currentScope = 'year';
      this.extractData(this.apiData.values);
    });
  }

  selectData(e: any) {
    var stationId: string | undefined = this.currentStationId;
    var year: number = this.apiData.values[e.element.index].year;
    var month: number = this.apiData.values[e.element.index].month;

    if (this.currentScope == 'year') {
      this.apiService.getYear(stationId, year).subscribe((data: any) => {
        this.apiData = data;
        this.currentScope = 'month';
        this.extractData(this.apiData.values);
      });
    }
    if (this.currentScope == 'month') {
      this.apiService
        .getMonth(stationId, year, month)
        .subscribe((data: any) => {
          this.apiData = data;
          this.currentScope = '';
          this.extractData(this.apiData.values);
        });
    }
  }

  extractData(values: TempValue[]) {
    var labels: string[] = [];

    if (this.currentScope == 'year') {
      values.forEach((value) => {
        labels.push(value.year.toString());
      });
    }

    if (this.currentScope == 'month') {
      labels = this.months;
    }

    if (this.currentScope == '') {
      values.forEach((value) => {
        labels.push(value.day.toString());
      });
    }

    var data: any[] = [
      { label: Label.TMAX, values: new Array<number>() },
      { label: Label.TMIN, values: new Array<number>() },
      { label: Label.TMINF, values: new Array<number>() },
      { label: Label.TMAXF, values: new Array<number>() },
      { label: Label.TMINS, values: new Array<number>() },
      { label: Label.TMAXS, values: new Array<number>() },
      { label: Label.TMINH, values: new Array<number>() },
      { label: Label.TMAXH, values: new Array<number>() },
      { label: Label.TMINW, values: new Array<number>() },
      { label: Label.TMAXW, values: new Array<number>() },
    ];

    this.chartData = {
      datasets: this.selectedCategories,
      labels: labels,
    };

    values.forEach((value) => {
      data.find((x) => x.label == Label.TMAX).values.push(value.maxTemp);
      data.find((x) => x.label == Label.TMIN).values.push(value.minTemp);
      data.find((x) => x.label == Label.TMINF).values.push(value.minTemp);
      data.find((x) => x.label == Label.TMAXF).values.push(value.minTemp);
      data.find((x) => x.label == Label.TMINS).values.push(value.minTemp);
      data.find((x) => x.label == Label.TMAXS).values.push(value.minTemp);
      data.find((x) => x.label == Label.TMINH).values.push(value.minTemp);
      data.find((x) => x.label == Label.TMAXH).values.push(value.minTemp);
      data.find((x) => x.label == Label.TMINW).values.push(value.minTemp);
      data.find((x) => x.label == Label.TMAXW).values.push(value.minTemp);
    });

    this.chartData.datasets?.forEach((dataSet) => {
      dataSet.data = data.find((x) => x.label == dataSet.label).values;
    });
  }
}
