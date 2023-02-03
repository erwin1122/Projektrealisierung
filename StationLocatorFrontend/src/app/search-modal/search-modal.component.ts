import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalState } from 'src/models/globalState';
import * as Actions from '../../state/state.actions';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css'],
})
export class SearchModalComponent {
  searchInput = {
    longitude: null,
    latitude: null,
    country: null,
    startYear: null,
    endYear: null,
    count: null,
    radius: null
  };

  constructor(private store: Store<GlobalState>) {}

  searchForStations() {
    this.store.dispatch(Actions.searchForStations(this.searchInput));
  }
}
