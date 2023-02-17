import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Constants } from 'src/models/constants';
import { Country } from 'src/models/country';
import { GlobalState } from 'src/models/globalState';
import { SearchInput } from 'src/models/searchInput';
import * as Actions from '../../state/state.actions';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css'],
})
export class SearchModalComponent {
  searchInput: SearchInput = { count: 5 };

  countries: Country[];
  country!: Country;

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
