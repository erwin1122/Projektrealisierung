import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogService } from 'primeng/dynamicdialog';
import { GlobalState } from 'src/models/globalState';
import { SearchModalComponent } from '../search-modal/search-modal.component';
import * as Actions from '../../state/state.actions';
import { SearchInput } from 'src/models/searchInput';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.css'],
  providers: [DialogService],
})
export class StartScreenComponent {
  isVisible: boolean = true;
  currentSearch: SearchInput = { count: 5 };

  constructor(
    public dialogService: DialogService,
    private store: Store<GlobalState>
  ) {
    this.store
      .select((state) => state.state.stationsNearby)
      .subscribe((focus) => {
        if (focus.length == 0) {
          this.isVisible = true;
        } else {
          this.isVisible = false;
        }
      });
  }

  show() {
    this.dialogService.open(SearchModalComponent, {
      header: 'Suche',
      data: this.currentSearch,
    });
    this.isVisible = false;
  }
}
