import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ChartData } from 'src/models/chartData';
import { DataLine } from 'src/models/dataLine';
import { GlobalState } from 'src/models/globalState';
import { Constants } from 'src/models/constants';
import { Station } from 'src/models/station';
import { StationResponse } from 'src/models/stationResponse';
import { TempValue } from 'src/models/tempValue';
import { ApiService } from 'src/services/api-service.service';
import * as Actions from '../../state/state.actions';
import { DialogService } from 'primeng/dynamicdialog';
import { SearchModalComponent } from '../search-modal/search-modal.component';

@Component({
  selector: 'app-temp-chart',
  templateUrl: './temp-chart.component.html',
  styleUrls: ['./temp-chart.component.css'],
  providers: [DialogService],
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
      label: Constants.TMIN,
      tension: 0.2,
      borderColor: '#2E75B6',
      fill: false,
    },
    {
      label: Constants.TMAX,
      tension: 0.2,
      borderColor: '#FF0000',
      fill: false,
    },
  ];
  meteoCheckboxes: DataLine[] = [
    {
      label: Constants.TMINF,
      tension: 0.2,
      borderColor: '#FF99FF',
      fill: false,
    },
    {
      label: Constants.TMAXF,
      tension: 0.2,
      borderColor: '#CC0099',
      fill: false,
    },
    {
      label: Constants.TMINS,
      tension: 0.2,
      borderColor: '#A9D18E',
      fill: false,
    },
    {
      label: Constants.TMAXS,
      tension: 0.2,
      borderColor: '#548235',
      fill: false,
    },
    {
      label: Constants.TMINH,
      tension: 0.2,
      borderColor: '#FFC000',
      fill: false,
    },
    {
      label: Constants.TMAXH,
      tension: 0.2,
      borderColor: '#ED7D31',
      fill: false,
    },
    {
      label: Constants.TMINW,
      tension: 0.2,
      borderColor: '#66FFFF',
      fill: false,
    },
    {
      label: Constants.TMAXW,
      tension: 0.2,
      borderColor: '#000099',
      fill: false,
    },
  ];
  selectedCategories: DataLine[] = [];

  searchInput: any;

  currentStation: Station | undefined;
  currentScope: string = Constants.YEAR;

  year = Constants.YEAR;
  month = Constants.MONTH;
  day = Constants.DAYS;

  showSidebar: boolean = true;

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
    private apiService: ApiService,
    public dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.toggleGesamtwerte();

    this.store
      .select((state) => state.state.currentFocus.station)
      .subscribe((station) => {
        this.currentStation = station;
        this.getInitialData(this.currentStation.id);
      });

    this.store
      .select((state) => state.state.technical.scope)
      .subscribe((scope) => (this.currentScope = scope));
  }

  navigateToYears() {
    this.apiService
      .getInitialStationData(this.currentStation?.id)
      ?.subscribe((data: any) => {
        this.apiData.values = data.values;
        this.store.dispatch(Actions.setScope({ scope: Constants.YEAR }));
        this.extractData(this.apiData.values);
      });
  }

  navigateToMonths() {
    var year: number = this.apiData.values[0].year;

    this.apiService
      .getYear(this.currentStation?.id, year)
      .subscribe((data: any) => {
        this.apiData.values = data.values;
        this.store.dispatch(Actions.setScope({ scope: Constants.MONTH }));
        this.extractData(data.values);
      });
  }

  showSearchModal() {
    const ref = this.dialogService.open(SearchModalComponent, {});
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
    if (this.currentScope == Constants.YEAR) {
      return `Mittelwerte für Station ${this.currentStation?.location} | ${
        this.apiData.values[0]?.year ? this.apiData.values[0]?.year : ''
      } - ${
        this.apiData.values[this.apiData.values.length - 1]?.year
          ? this.apiData.values[this.apiData.values.length - 1]?.year
          : ''
      }`;
    }

    if (this.currentScope == Constants.MONTH) {
      return `Monatliche Mittelwerte für Station ${this.currentStation?.location} | ${this.apiData.values[0]?.year}`;
    }

    if (this.currentScope == Constants.DAYS) {
      return `Werte für Station ${this.currentStation?.location} | ${
        this.months[this.apiData.values[0]?.month - 1]
          ? this.months[this.apiData.values[0]?.month - 1]
          : ''
      } ${this.apiData.values[0]?.year ? this.apiData.values[0]?.year : ''}`;
    }

    return '';
  }

  searchYear(e: any) {
    if (this.searchInput) {
      var year: number = +this.searchInput;

      this.apiService
        .getYear(this.currentStation?.id, year)
        .subscribe((data: any) => {
          this.apiData.values = data.values;
          this.store.dispatch(Actions.setScope({ scope: Constants.MONTH }));
          this.extractData(data.values);
        });
    }
  }

  searchMonth(e: any) {
    var month: number = this.searchInput.getMonth() + 1;
    var year: number = this.apiData.values[0].year;

    this.apiService
      .getMonth(this.currentStation?.id, year, month)
      .subscribe((data: any) => {
        this.apiData.values = data.values;
        this.store.dispatch(Actions.setScope({ scope: Constants.DAYS }));
        this.extractData(data.values);
      });
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
  }

  getInitialData(stationId: string | undefined) {
    this.apiService.getInitialStationData(stationId)?.subscribe((data: any) => {
      this.apiData.values = data.values;
      this.store.dispatch(Actions.setScope({ scope: Constants.YEAR }));
      this.extractData(this.apiData.values);
    });
  }

  selectData(e: any) {
    var stationId: string | undefined = this.currentStation?.id;
    var year: number = this.apiData.values[e.element.index].year;
    var month: number = this.apiData.values[e.element.index].month;

    if (this.currentScope == Constants.YEAR) {
      this.apiService.getYear(stationId, year).subscribe((data: any) => {
        this.apiData.values = data.values;
        this.store.dispatch(Actions.setScope({ scope: Constants.MONTH }));
        this.extractData(this.apiData.values);
      });
    }
    if (this.currentScope == Constants.MONTH) {
      this.apiService
        .getMonth(stationId, year, month)
        .subscribe((data: any) => {
          this.apiData.values = data.values;
          this.store.dispatch(Actions.setScope({ scope: Constants.DAYS }));
          this.extractData(this.apiData.values);
        });
    }
  }

  extractData(values: TempValue[]) {
    var labels: string[] = [];

    if (this.currentScope == Constants.YEAR) {
      values.forEach((value) => {
        labels.push(value.year.toString());
      });
    }

    if (this.currentScope == Constants.MONTH) {
      labels = this.months;
    }

    if (this.currentScope == Constants.DAYS) {
      values.forEach((value) => {
        labels.push(value.day.toString());
      });
    }

    var data: any[] = [
      { label: Constants.TMAX, values: new Array<number>() },
      { label: Constants.TMIN, values: new Array<number>() },
      { label: Constants.TMINF, values: new Array<number>() },
      { label: Constants.TMAXF, values: new Array<number>() },
      { label: Constants.TMINS, values: new Array<number>() },
      { label: Constants.TMAXS, values: new Array<number>() },
      { label: Constants.TMINH, values: new Array<number>() },
      { label: Constants.TMAXH, values: new Array<number>() },
      { label: Constants.TMINW, values: new Array<number>() },
      { label: Constants.TMAXW, values: new Array<number>() },
    ];

    this.chartData = {
      datasets: this.selectedCategories,
      labels: labels,
    };

    values.forEach((value) => {
      data.find((x) => x.label == Constants.TMAX).values.push(value.maxTemp);
      data.find((x) => x.label == Constants.TMIN).values.push(value.minTemp);
      data.find((x) => x.label == Constants.TMINF).values.push(value.minTempF);
      data.find((x) => x.label == Constants.TMAXF).values.push(value.maxTempF);
      data.find((x) => x.label == Constants.TMINS).values.push(value.minTempS);
      data.find((x) => x.label == Constants.TMAXS).values.push(value.maxTempS);
      data.find((x) => x.label == Constants.TMINH).values.push(value.minTempH);
      data.find((x) => x.label == Constants.TMAXH).values.push(value.maxTempH);
      data.find((x) => x.label == Constants.TMINW).values.push(value.minTempW);
      data.find((x) => x.label == Constants.TMAXW).values.push(value.maxTempW);
    });

    this.chartData.datasets?.forEach((dataSet) => {
      dataSet.data = data.find((x) => x.label == dataSet.label)?.values;
    });
  }
}
