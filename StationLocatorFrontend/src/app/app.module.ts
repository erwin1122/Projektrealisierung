import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';

import { AppComponent } from './main/app.component';
import { StationListComponent } from './station-list/station-list.component';

import { stateReducer } from 'src/state/state.reducer';
import { StateEffects } from 'src/state/state.effects';

@NgModule({
  declarations: [AppComponent, StationListComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({ state: stateReducer }),
    EffectsModule.forRoot([StateEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      autoPause: true,
    }),
    FormsModule,
    ListboxModule,
    DropdownModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
