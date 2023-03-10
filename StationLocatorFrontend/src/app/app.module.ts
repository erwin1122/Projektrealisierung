import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { ListboxModule } from 'primeng/listbox';
import { DropdownModule } from 'primeng/dropdown';
import { ChartModule } from 'primeng/chart';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { CalendarModule } from 'primeng/calendar';

import { AppComponent } from './main/app.component';
import { StationListComponent } from './station-list/station-list.component';
import { TempChartComponent } from './temp-chart/temp-chart.component';
import { LoadingComponent } from './loading/loading.component';
import { SearchModalComponent } from './search-modal/search-modal.component';
import { StartScreenComponent } from './start-screen/start-screen.component';

import { stateReducer } from 'src/state/state.reducer';
import { StateEffects } from 'src/state/state.effects';

@NgModule({
  declarations: [
    AppComponent,
    StationListComponent,
    TempChartComponent,
    LoadingComponent,
    SearchModalComponent,
    StartScreenComponent,
  ],
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
    ChartModule,
    DynamicDialogModule,
    ButtonModule,
    ToastModule,
    TableModule,
    CardModule,
    SidebarModule,
    InputTextModule,
    CalendarModule,
    InputNumberModule,
    CheckboxModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
