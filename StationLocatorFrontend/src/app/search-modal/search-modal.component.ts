import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { Constants } from 'src/models/constants';
import { Country } from 'src/models/country';
import { GlobalState } from 'src/models/globalState';
import { SearchInput } from 'src/models/searchInput';
import * as Actions from '../../state/state.actions';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.css'],
  providers: [DialogService],
})
export class SearchModalComponent {
  searchInput: SearchInput = { count: 5 };

  countries: Country[];
  country!: Country;

  constructor(
    private store: Store<GlobalState>,
    private ref: DynamicDialogRef,
    private dialogService: DynamicDialogConfig
  ) {
    this.countries = Constants.COUNTRIES;

    this.searchInput.count = this.dialogService.data?.count
      ? this.dialogService.data.count
      : null;
    this.searchInput.country = this.dialogService.data?.country
      ? this.dialogService.data.country
      : null;
    this.searchInput.startYear = this.dialogService.data?.startYear
      ? this.dialogService.data.startYear
      : null;
    this.searchInput.endYear = this.dialogService.data?.endYear
      ? this.dialogService.data.endYear
      : null;
    this.searchInput.latitude = this.dialogService.data?.latitude
      ? this.dialogService.data.latitude
      : null;
    this.searchInput.longitude = this.dialogService.data?.longitude
      ? this.dialogService.data.longitude
      : null;
    this.searchInput.radius = this.dialogService.data?.radius
      ? this.dialogService.data.radius
      : null;
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
