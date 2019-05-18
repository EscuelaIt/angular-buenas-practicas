import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// servicio de terceros
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatToolbarModule, MatIconModule, MatSidenavModule, MatSnackBarModule,
        MatDialogModule, MatProgressSpinnerModule, MatBottomSheetModule, MatButtonModule,
        MatListModule, MatCardModule, MatInputModule } from '@angular/material';
import { AngularFireModule } from '@angular/fire';

// mis servicios

// componentes
import { AppComponent } from './app.component';
import { ModalWindowComponent } from './components/modal-window/modal-window.component';
import { RecoveryPasswordComponent } from './components/recovery-password/recovery-password.component';

// routing
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    RecoveryPasswordComponent,
    ModalWindowComponent
  ],
  entryComponents: [
    RecoveryPasswordComponent,
    ModalWindowComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
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
    MatButtonModule,
    MatMomentDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
