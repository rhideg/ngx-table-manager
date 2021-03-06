import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { BrowserModule } from '@angular/platform-browser';
import { AdvancedSearchDialogComponent } from './dialogs/advanced-search-dialog/advanced-search-dialog.component';
import { TableHeadersDialogComponent } from './dialogs/table-headers-dialog/table-headers-dialog.component';
import { TableManagerComponent } from './table-manager.component';
import { NgxTmSelectComponent } from './components/ngx-tm-select/ngx-tm-select.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgxTableComponent } from './components/ngx-table/ngx-table.component';
import { ConfirmDialogComponent } from './dialogs/confirm-dialog/confirm-dialog/confirm-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ColorPickerModule } from 'ngx-color-picker';
/* import { FontPickerModule } from 'ngx-font-picker';
import { FONT_PICKER_CONFIG } from 'ngx-font-picker';
import { FontPickerConfigInterface } from 'ngx-font-picker';

const DEFAULT_FONT_PICKER_CONFIG: FontPickerConfigInterface = {
  // Change this to your Google API key
  apiKey: 'AIzaSyA9S7DY0khhn9JYcfyRWb1F6Rd2rwtF_mA'
}; */

@NgModule({
  declarations: [
    TableManagerComponent,
    AdvancedSearchDialogComponent,
    TableHeadersDialogComponent,
    NgxTmSelectComponent,
    NgxTableComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatCheckboxModule,
    MatMenuModule,
    MatListModule,
    FormsModule,
    BrowserModule,
    FlexLayoutModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatSliderModule,
    MatTableModule,
    ReactiveFormsModule,
    MatSortModule,
    DragDropModule,
    MatTooltipModule,
    ColorPickerModule,
    /* FontPickerModule */
  ],
  exports: [
    TableManagerComponent,
    NgxTmSelectComponent,
    NgxTableComponent,
  ],
  entryComponents: [
    TableHeadersDialogComponent,
    AdvancedSearchDialogComponent,
    ConfirmDialogComponent
  ],
  /* providers: [
    {
      provide: FONT_PICKER_CONFIG,
      useValue: DEFAULT_FONT_PICKER_CONFIG
    }
  ] */
})
export class TableManagerModule { }
