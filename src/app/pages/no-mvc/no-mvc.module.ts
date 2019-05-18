// cORE
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// servicio de terceros
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatSnackBarModule,
         MatDialogModule, MatProgressSpinnerModule, MatBottomSheetModule, MatButtonModule,
         MatListModule, MatCardModule, MatInputModule } from '@angular/material';

// componentes
import { NoMvcComponent } from './no-mvc.component';

// routing
import { NoMvcRoutingModule } from './no-mvc-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [NoMvcComponent],
  imports: [
    CommonModule,
    NoMvcRoutingModule,
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
  ]
})
export class NoMvcModule { }
