import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Constants } from 'src/models/constants';
import { GlobalState } from 'src/models/globalState';
import * as Actions from '../../state/state.actions';

interface Country {
  name?: string;
  country_code?: string;
}

interface SearchInput {
  latitude?: string;
  longitude?: string;
  country?: string;
  startYear?: number;
  endYear?: number;
  count?: number;
  radius?: number;
}

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css'],
})
export class SearchModalComponent {
  searchInput: SearchInput = {};

  countries: Country[];
  country: Country = {};

  constructor(
    private store: Store<GlobalState>,
    private ref: DynamicDialogRef
  ) {
    this.countries = Constants.COUNTRIES;
  }

  closeModal() {
    this.ref.close();
  }

  searchForStations() {
    if (this.country) {
      this.searchInput.country = this.country.country_code;
    }

    console.log(this.countries);
    console.log(this.country);
    console.table(this.searchInput);

    this.store.dispatch(
      Actions.searchForStations(
        Object.fromEntries(
          Object.entries(this.searchInput).filter(([_, v]) => v != null)
        )
      )
    );

    this.store.dispatch(Actions.setDateRange(this.searchInput));
  }
}
