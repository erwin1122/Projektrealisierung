import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { GlobalState } from 'src/models/globalState';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  isLoading$: Observable<boolean>;

  constructor(private store: Store<GlobalState>){
    this.isLoading$ = this.store.select((state) => state.state.technical.isLoading)
  }
}
