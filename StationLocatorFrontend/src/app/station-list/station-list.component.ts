import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GlobalState } from 'src/models/globalState';
import { Station } from 'src/models/station';
import { ApiService } from 'src/services/api-service.service';
import * as Actions from '../../state/state.actions';

@Component({
  selector: 'app-station-list',
  templateUrl: './station-list.component.html',
  styleUrls: ['./station-list.component.css'],
})
export class StationListComponent implements OnInit {
  stations$: Observable<Station[]>;
  selectedStation: any;

  constructor(private store: Store<GlobalState>) {
    this.stations$ = this.store.select((state) => state.state.stationsNearby);
  }

  ngOnInit(): void {}

  updateSelectedStation() {
    this.store.dispatch(Actions.updateCurrentStation(this.selectedStation));
  }
}
