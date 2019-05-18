// tslint:disable: max-line-length
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LoginEmailDataSend } from 'src/app/interfaces/login-email-data-send/login-email-data-send';
import { ErrorLoginFirebaseInterface, ErrorCreateSocialMediaRegisterFirebaseInterface } from 'src/app/interfaces/error-create-register-firebase/error-create-register-firebase';
import { RoutingHistoryService } from 'src/app/services/routing-history/routing-history.service';
import { AuthService } from 'src/app/services/firebase-login/auth.service';
import { WindowSpinnerSnackbarService } from 'src/app/services/window-spinner-snackbar/window-spinner-snackbar.service';
import { FirestoreToolsService } from 'src/app/services/firestore-tools/firestore-tools.service';
import { ConfigAppService } from 'src/app/services/config-app/config-app.service';
import { concatMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ConfigModalInterface } from 'src/app/components/modal-window/config-modal-window';
import { FormToolsService } from 'src/app/services/form-tools/form-tools.service';
import { MatDialogConfig } from '@angular/material';
import { RecoveryPasswordComponent } from './components/recovery-password/recovery-password.component';
import { UserProviderModel } from 'src/app/models/user-provider/user-provider.model';
import { of } from 'rxjs/internal/observable/of';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs';
import { LoginService } from './login.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  environment = environment;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private routingHistoryService: RoutingHistoryService,
    private windowSpinnerSnackbarService: WindowSpinnerSnackbarService,
    private firestoreToolsService: FirestoreToolsService,
    private configAppService: ConfigAppService,
    private formToolsService: FormToolsService,
    // servicio propio
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.windowSpinnerSnackbarService.openSpinner();
    this.loginService.createForm();
    this.windowSpinnerSnackbarService.closeSpiner();
  }


  onTryEmailLogin() {
    this.windowSpinnerSnackbarService.openSpinner();
    this.loginService.tryEmailLogin()
      .subscribe(
        (sucessEmialLogin: firebase.auth.UserCredential) => {
          // lógica de aplicación
          this.windowSpinnerSnackbarService.closeSpiner();
          this._navigateHomeOrBackUrl();
        },
        (errEmailLogin: ErrorLoginFirebaseInterface) => {
          // lógica de aplicación
          this.windowSpinnerSnackbarService.closeSpiner(true);
          this._openErrorTryEmailLogin(errEmailLogin);
        });
  }


  onTryGoogleLogin() {
    let googleCredential: firebase.auth.UserCredential;
    this.windowSpinnerSnackbarService.openSpinner();
    const googleLoginPromise = this.loginService.tryGoogleLogin()
      .then(
        (credential: firebase.auth.UserCredential) => {
          googleCredential = credential;
          if (googleCredential.additionalUserInfo.isNewUser) {// si nuevo usuario => creo el modelo de datos
            return this.loginService.createUserDataFromCredential(credential);
          } else {
            return Promise.resolve(false); // salto al siguiente paso
          }
        },
        (errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) => {
          this.windowSpinnerSnackbarService.closeSpiner(true);
          this._showErrorLoginRRSS(errorCredential);
          return googleLoginPromise.finally(); // paramos la promesa
        })
      .then(
        (dataCreate) => {
          return this.loginService.updateUserProviderDataRRSS(googleCredential);
        },
        errorDataCreate => {
          this.windowSpinnerSnackbarService.closeSpiner(true);
          // eliminar la cuenta
          this._showErrorLoginRRSSAndLogout();
          this.authService.deleteCurrentUser()
            .then(() => {
              return googleLoginPromise.finally();
            });
        }
      )
      .then(
        (dataUpdate) => {
          this.windowSpinnerSnackbarService.closeSpiner();
          this._navigateHomeOrBackUrl();
        },
        errorDataUpdate => {
          this.windowSpinnerSnackbarService.closeSpiner(true);
          this._showErrorLoginRRSSAndLogout();
        });
  }

  tryFacebookLogin() {
    // levanto SPINNER
    this.windowSpinnerSnackbarService.openSpinner();
    // llamo al servicio de AUTH de GOOGLE
    this.authService.facebookLogin()
      .subscribe(
        (credential: firebase.auth.UserCredential) => {
          this.windowSpinnerSnackbarService.closeSpiner();
          // this._tryCreateUserDataRRSS(credential);
        },
        ((errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) => {
          console.log('tryFacebookLogin() errorCredential: ', errorCredential);
          this.windowSpinnerSnackbarService.closeSpiner(true);
          this._showErrorLoginRRSS(errorCredential);
        })
      );
  }

  tryTwitterLogin() {
    // levanto SPINNER
    this.windowSpinnerSnackbarService.openSpinner();
    this.authService.twitterLogin()
    .subscribe(
      (credential: firebase.auth.UserCredential) => {
        this.windowSpinnerSnackbarService.closeSpiner();
        // this._tryCreateUserDataRRSS(credential);
      },
      ((errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) => {
        console.log('tryTwitterLogin() errorCredential: ', errorCredential);
        this.windowSpinnerSnackbarService.closeSpiner(true);
        this._showErrorLoginRRSS(errorCredential);
      })
    );
  }
  /**
   * * ACABADA
   */
  onClickIconEmail() {
    this.windowSpinnerSnackbarService.openBottomSheet(this.configAppService.CONFIG_APP.bottomSheetData.email);
  }
  /**
   * * ACABADA
   */
  onClickIconPassword() {
    this.windowSpinnerSnackbarService.openBottomSheet(this.configAppService.CONFIG_APP.bottomSheetData.password);
  }
  /**
   * * ACABADA
   */
  onClickRecoverPassword() {
    const data: ConfigModalInterface = {
      tittle: 'LoginComponent.recover',
      messages: ['LoginComponent.recoverPasswordInfo'],
      buttons: [] // no lo voy a usar
    };
    const configWindow: MatDialogConfig = {
      disableClose: true, // Whether the user can use escape or clicking on the backdrop to close the modal
      data
    };
// tslint:disable-next-line: max-line-length
    this.windowSpinnerSnackbarService.showCustomDialogWindowReturnReference( RecoveryPasswordComponent, configWindow)
      .afterClosed()
      .subscribe((email: {email: string}) => {
          // si el usuario ha cerrado la ventana no viene ningún valor
          if (email && email.email && email.email !== environment.fakeData) {
            this._resetPAssword(email.email);
          }
        });
  }

  // LÓGICA DE APLICACIÓN
  private _navigateHomeOrBackUrl() {
    const lastNavigation = this.routingHistoryService.getPreviousUrl();
    // si no es LOGIN o no es CREATE-ACCOUNT, puedes volverte a donde ibas
    if (lastNavigation && lastNavigation !== '/' + environment.routesName.login && lastNavigation !== '/' + environment.routesName.createAccount) {
      this.router.navigate([lastNavigation]);
    } else {
      // en todos los demás casos te vas al área del usuario DONDE ESTÁ LA PASTA
      this.router.navigate(['/' + environment.routesName.myAccount]);
    }
  }

  private _openErrorTryEmailLogin(errEmailLogin: ErrorLoginFirebaseInterface) {
    const configModal: ConfigModalInterface = {
      class: 'error',
      tittle: 'Errors.unexpectedError',
      messages: ['Errors.errorTryLogin'],
      buttons: [{label: 'accept'}]
    };
    switch (errEmailLogin.code) {
      case 'auth/user-not-found':
        configModal.messages.push('Errors.notUserEmail');
        break;
      case 'auth/invalid-email':
        configModal.messages.push('Errors.invalidEmail');
        break;

      default:
        configModal.messages.push('Errors.retryLater');
        break;
    }
    this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal);
  }

  private _showErrorLoginRRSS(errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) {
    let configModal: ConfigModalInterface;
    switch (errorCredential.code) {
      case 'auth/popup-closed-by-user':
        // no hago nada, porque el usuario a cancelado o cerrado el popup de LOGIN del Provider
        break;
      case 'auth/account-exists-with-different-credential':
        const email = errorCredential.email;
        this.authService.fetchProvidersForEmail(email)
          .subscribe(
            (providers: Array<string>) => {
              configModal = {
                class: 'error',
                tittle: 'Errors.anotherProvider',
                messages: ['Errors.retryLoginAnotherProvider', '"' + providers[0] + '"'],
                buttons: [{label: 'accept'}]
              };
              this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal);
            },
            errorFetchProvidersForEmail => {
              console.log('showErrorLoginRRSS() errorFetchProvidersForEmail: ', errorFetchProvidersForEmail);
              configModal = {
                class: 'error',
                tittle: 'Errors.unexpectedError',
                messages: ['Errors.errorTryLogin', 'Errors.retry'],
                buttons: [{label: 'accept'}]
              };
              this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal);
            });
        break;
      case 'auth/invalid-credential': // message: "Malformed response cannot be parsed from twitter.com for VERIFY_CREDENTIAL"
      default:
        configModal = {
          class: 'error',
          tittle: 'Errors.unexpectedError',
          messages: ['Errors.errorTryLogin', 'Errors.retry'],
          buttons: [{label: 'accept'}]
        };
        this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal);
        break;
    }
  }
  private _showErrorLoginRRSSAndLogout() {
    this.authService.doLogout();
    const configModal: ConfigModalInterface = {
      class: 'error',
      tittle: 'Errors.unexpectedError',
      messages: ['Errors.errorTryLogin', 'Errors.retryLater'],
      buttons: [{label: 'accept'}]
    };
    this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal);
  }

  // refactorizando
  private _resetPAssword(email: string) {
    this.windowSpinnerSnackbarService.openSpinner();
    this.authService.resetPassword(email)
    .subscribe(
      (sendEmailSuccess) => {
        this.windowSpinnerSnackbarService.closeSpiner();
        const configModal: ConfigModalInterface = {
          tittle: 'Success.sendEmailRecoveryPassSucess',
          messages: ['Success.openEmail'],
          buttons: [{label: 'accept'}]
        };
        this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal);
      },
      sendEmailError => {
        console.log('onClickRecoverPassword() sendEmailError: ', sendEmailError);
        this.windowSpinnerSnackbarService.closeSpiner(true);
        const configModal: ConfigModalInterface = {
          class: 'error',
          tittle: 'Errors.unexpectedError',
          messages: ['Errors.sendEmailRecoveryPassError'],
          buttons: [{label: 'accept'}]
        };
        switch (sendEmailError.code) {
          case 'auth/invalid-email': // Thrown if the email address is not valid
            configModal.messages.push('Errors.invalidEmail');
            break;
          case 'auth/user-not-found': // Thrown if there is no user corresponding to the email address
            configModal.messages.push('Errors.notUserEmail');
            break;

          case 'auth/missing-android-pkg-name': // An Android package name must be provided if the Android app is required to be installed
          case 'auth/missing-continue-uri': // A continue URL must be provided in the request
          case 'auth/missing-ios-bundle-id': // An iOS Bundle ID must be provided if an App Store ID is provided
          case 'auth/invalid-continue-uri': // The continue URL provided in the request is invalid
          case 'auth/unauthorized-continue-uri': // The domain of the continue URL is not whitelisted. Whitelist the domain in the Firebase console
          default:
            configModal.messages.push('Errors.retryLater');
            break;
        }
        this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal);
      });
  }

  
}
