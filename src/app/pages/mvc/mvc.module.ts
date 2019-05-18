import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MvcRoutingModule } from './mvc-routing.module';
import { MvcComponent } from './mvc.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatSnackBarModule, MatDialogModule, MatProgressSpinnerModule, MatBottomSheetModule, MatButtonModule, MatListModule, MatCardModule, MatInputModule } from '@angular/material';
import { MvcService } from './mvc.service';

@NgModule({
  declarations: [MvcComponent],
  imports: [
    CommonModule,
    MvcRoutingModule,
    ReactiveFormsModule,
    TranslateModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [MvcService]
})
export class MvcModule { }
