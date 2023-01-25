import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import {FormsModule} from '@angular/forms';
import {ListboxModule} from 'primeng/listbox';
import {DropdownModule} from 'primeng/dropdown';

import { AppComponent } from './main/app.component';
import { StationListComponent } from './station-list/station-list.component';
import { stateReducer } from 'src/state/state.reducer';

@NgModule({
  declarations: [
    AppComponent,
    StationListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({state: stateReducer}),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      autoPause: true
    }),
    FormsModule,
    ListboxModule,
    DropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
