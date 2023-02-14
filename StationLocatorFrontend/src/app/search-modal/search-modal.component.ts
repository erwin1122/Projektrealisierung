import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Constants } from 'src/models/constants';
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
    radius: null,
  };

  countries: any[];
  country: any;

  constructor(private store: Store<GlobalState>) {
    this.countries = Constants.COUNTRIES;
  }

  searchForStations() {
    if (this.country != undefined) {
      this.searchInput.country = this.country.country_code;
    }

    this.store.dispatch(
      Actions.searchForStations(
        Object.fromEntries(
          Object.entries(this.searchInput).filter(([_, v]) => v != null)
        )
      )
    );
  }
}
