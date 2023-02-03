import { Component } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { SearchModalComponent } from '../search-modal/search-modal.component';

@Component({
  selector: 'app-search-window',
  templateUrl: './search-window.component.html',
  styleUrls: ['./search-window.component.css'],
  providers: [DialogService]
})
export class SearchWindowComponent {

  constructor(public dialogService: DialogService) {}

  show() {
    const ref = this.dialogService.open(SearchModalComponent, {});
}
}
