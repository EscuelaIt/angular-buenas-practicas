// Angullar
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// servicios de terceros
import { MatDialogConfig } from '@angular/material';

// mis servicios
import { AuthService } from 'src/app/services/auth/auth.service';
import { RoutingHistoryService } from 'src/app/services/routing-history/routing-history.service';
import { WindowSpinnerSnackbarService } from 'src/app/services/window-spinner-snackbar/window-spinner-snackbar.service';
import { ConfigAppService } from 'src/app/services/config-app/config-app.service';

// servicio MVC del componente
import { MvcService } from './mvc.service';

// interfaces
import { ErrorLoginFirebaseInterface } from 'src/app/interfaces/error-login-firebase-interface';
import { ErrorCreateSocialMediaRegisterFirebaseInterface } from 'src/app/interfaces/error-create-social-media-register-firebase-interface';
import { ConfigModalInterface } from 'src/app/interfaces/config-modal-interface';

// componentes
import { RecoveryPasswordComponent } from 'src/app/components/recovery-password/recovery-password.component';

// constantes
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mvc',
  templateUrl: './mvc.component.html',
  styleUrls: ['./mvc.component.scss']
})
export class MvcComponent implements OnInit {

  environment = environment;

  constructor(
    private router: Router,
    private authService: AuthService,
    private routingHistoryService: RoutingHistoryService,
    private windowSpinnerSnackbarService: WindowSpinnerSnackbarService,
    private configAppService: ConfigAppService,
    // servicio propio
    public mvcService: MvcService
  ) { }
  // * ACABADA
  ngOnInit() {
    this.windowSpinnerSnackbarService.openSpinner(); // LÓGICA DE APLICACIÓN
    this.mvcService.createForm(); // MODELO DE DATOS
    this.windowSpinnerSnackbarService.closeSpiner(); // LÓGICA DE APLICACIÓN
  }
  // * ACABADA
  onTryEmailLogin() {
    this.windowSpinnerSnackbarService.openSpinner(); // LÓGICA DE APLICACIÓN
    this.mvcService.onTryEmailLogin()
      .subscribe(
        (sucessEmialLogin: firebase.auth.UserCredential) => {
          this.windowSpinnerSnackbarService.closeSpiner(); // LÓGICA DE APLICACIÓN
          this._navigateHomeOrBackUrl(); // LÓGICA DE APLICACIÓN
        },
        (errEmailLogin: ErrorLoginFirebaseInterface) => {
          this.windowSpinnerSnackbarService.closeSpiner(true); // LÓGICA DE APLICACIÓN
          this._showErrorTryEmailLogin(errEmailLogin); // LÓGICA DE APLICACIÓN
        });
  }
  // * ACABADA
  onTryGoogleLogin() {
    let googleCredential: firebase.auth.UserCredential;
    this.windowSpinnerSnackbarService.openSpinner(); // LÓGICA DE APLICACIÓN
    const googleLoginPromise = this.mvcService.tryGoogleLogin() // LÓGICA DE NEGOCIO
      .then(
        (credential: firebase.auth.UserCredential) => {
          googleCredential = credential;
          if (googleCredential.additionalUserInfo.isNewUser) {
            return this.mvcService.createUserDataFromCredential(credential); // LÓGICA DE NEGOCIO
          } else {
            return Promise.resolve(false);
          }
        },
        (errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) => {
          this.windowSpinnerSnackbarService.closeSpiner(true); // LÓGICA DE APLICACIÓN
          this._showErrorLoginRRSS(errorCredential); // LÓGICA DE APLICACIÓN
          return googleLoginPromise.finally();
        })
      .then(
        (dataCreate) => {
          return this.mvcService.updateUserProviderDataRRSS(googleCredential); // LÓGICA DE NEGOCIO
        },
        errorDataCreate => {
          this.windowSpinnerSnackbarService.closeSpiner(true); // LÓGICA DE APLICACIÓN
          this._showErrorLoginRRSSAndLogout(); // LÓGICA DE APLICACIÓN
          this.mvcService.deleteCurrentUser(); // LÓGICA DE NEGOCIO
          return googleLoginPromise.finally();
        }
      )
      .then(
        (dataUpdate) => {
          this.windowSpinnerSnackbarService.closeSpiner(); // LÓGICA DE APLICACIÓN
          this._navigateHomeOrBackUrl(); // LÓGICA DE APLICACIÓN
        },
        errorDataUpdate => {
          this.windowSpinnerSnackbarService.closeSpiner(true); // LÓGICA DE APLICACIÓN
          this._showErrorLoginRRSSAndLogout(); // LÓGICA DE APLICACIÓN
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

  onClickIconPassword() {
    this.windowSpinnerSnackbarService.openBottomSheet(this.configAppService.CONFIG_APP.bottomSheetData.password);
  }

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
          if (email && email.email) {
            this._resetPAssword(email.email);
          }
        });
  }

  // ### LÓGICA DE APLICACIÓN ###

  // navegación de la aplicación
  private _navigateHomeOrBackUrl() {
    const lastNavigation = this.routingHistoryService.getPreviousUrl();
    // si no es LOGIN o no es CREATE-ACCOUNT, puedes volverte a donde ibas
    // tslint:disable-next-line: max-line-length
    if (lastNavigation && lastNavigation !== '/' + environment.routesName.login && lastNavigation !== '/' + environment.routesName.createAccount) {
      this.router.navigate([lastNavigation]);
    } else {
      // en todos los demás casos te vas al área del usuario DONDE ESTÁ LA PASTA
      this.router.navigate(['/' + environment.routesName.myAccount]);
    }
  }

  // muestro ventanas modales informativas
  private _showErrorTryEmailLogin(errEmailLogin: ErrorLoginFirebaseInterface) {
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




  // refactor
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
