import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalState } from 'src/models/globalState';
import { Station } from 'src/models/station';
import * as Actions from '../../state/state.actions';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css'],
})
export class StationListComponent implements OnInit {
  stations: Station[] = [];
  selectedStation: any;

  @Input()
  listHeight: string = '400px';

  constructor(private store: Store<GlobalState>) {
    this.store
      .select((state) => state.state.stationsNearby)
      .subscribe((list) => {
        this.stations = list;
      });
  }

  ngOnInit(): void {}

  updateSelectedStation() {
    this.store.dispatch(Actions.updateCurrentStation(this.selectedStation));
  }
}
