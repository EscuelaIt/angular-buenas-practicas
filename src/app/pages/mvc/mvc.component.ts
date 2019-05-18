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
    this.windowSpinnerSnackbarService.openSpinner(); // LÓGICA DE APLICACIÓN
    this.mvcService.onTryGoogleLogin() // LÓGICA DE NEGOCIO
      .then(
        (credential: firebase.auth.UserCredential) => {
          this.windowSpinnerSnackbarService.closeSpiner();
          this._tryCreateUserDataRRSS(credential); // LÓGICA DE NEGOCIO
        },
        (errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) => {
          this.windowSpinnerSnackbarService.closeSpiner(true); // LÓGICA DE APLICACIÓN
          this._showErrorLoginRRSS(errorCredential); // LÓGICA DE APLICACIÓN
        });
  }
  // * ACABADA
  onTryFacebookLogin() {
    this.windowSpinnerSnackbarService.openSpinner(); // LÓGICA DE APLICACIÓN
    this.mvcService.onTryFacebookLogin() // LÓGICA DE NEGOCIO
      .then(
        (credential: firebase.auth.UserCredential) => {
          this.windowSpinnerSnackbarService.closeSpiner();
          this._tryCreateUserDataRRSS(credential); // LÓGICA DE NEGOCIO
        },
        (errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) => {
          this.windowSpinnerSnackbarService.closeSpiner(true); // LÓGICA DE APLICACIÓN
          this._showErrorLoginRRSS(errorCredential); // LÓGICA DE APLICACIÓN
        });
  }
  // * ACABADA
  onTryTwitterLogin() {
    this.windowSpinnerSnackbarService.openSpinner(); // LÓGICA DE APLICACIÓN
    this.mvcService.onTryTwitterLogin() // LÓGICA DE NEGOCIO
      .then(
        (credential: firebase.auth.UserCredential) => {
          this.windowSpinnerSnackbarService.closeSpiner();
          this._tryCreateUserDataRRSS(credential); // LÓGICA DE NEGOCIO
        },
        (errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) => {
          this.windowSpinnerSnackbarService.closeSpiner(true); // LÓGICA DE APLICACIÓN
          this._showErrorLoginRRSS(errorCredential); // LÓGICA DE APLICACIÓN
        });
  }
  // * ACABADA
  onClickIconEmail() {
     // LÓGICA DE APLICACIÓN
    this.windowSpinnerSnackbarService.openBottomSheet(this.configAppService.CONFIG_APP.bottomSheetData.email);
  }
  // * ACABADA
  onClickIconPassword() {
     // LÓGICA DE APLICACIÓN
    this.windowSpinnerSnackbarService.openBottomSheet(this.configAppService.CONFIG_APP.bottomSheetData.password);
  }
  // * ACABADA
  onClickRecoverPassword() {
     // LÓGICA DE APLICACIÓN
    const data: ConfigModalInterface = {
      tittle: 'LoginComponent.recover',
      messages: ['LoginComponent.recoverPasswordInfo'],
      buttons: []
    };
    const configWindow: MatDialogConfig = {
      disableClose: true, // Whether the user can use escape or clicking on the backdrop to close the modal
      data
    };
    // abro una ventana modal para recoger el email del usuario
    // LÓGICA DE APLICACIÓN
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
  /**
   * * ACABADA
   * @description aquí realizamos el control de toda la lógica de las tres redes sociales activas para el LOGIN
   * @param credential
   */
  private _tryCreateUserDataRRSS(credential: firebase.auth.UserCredential) {
    this.windowSpinnerSnackbarService.openSpinner(); // LÓGICA DE APLICACIÓN
    // compruebo si el usuario es nuevo o no
    let saveDataUserPromise;
    if (credential.additionalUserInfo.isNewUser) { // LÓGICA DE NEGOCIO
      saveDataUserPromise = this.mvcService.createUserDataFromCredential(credential);
    } else {
      saveDataUserPromise = Promise.resolve(false);
    }
    saveDataUserPromise // LÓGICA DE NEGOCIO
        .then(
          (dataCreate) => {
            return this.mvcService.updateUserProviderDataRRSS(credential); // LÓGICA DE NEGOCIO
          },
          errorDataCreate => {
            this.windowSpinnerSnackbarService.closeSpiner(true); // LÓGICA DE APLICACIÓN
            this._showErrorLoginRRSSAndLogout(); // LÓGICA DE APLICACIÓN
            this.mvcService.deleteCurrentUser(); // LÓGICA DE NEGOCIO
            return saveDataUserPromise.finally();
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
  /**
   * * ACABADA
   * @description navegación de la aplicación
   */
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
  /**
   * * ACABADA
   * @description muestro ventanas modales informativas
   * @param errEmailLogin
   */
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
  /**
   * * ACABADA
   * @description deslogeo al usuario y muestro mensaje modal
   */
  private _showErrorLoginRRSSAndLogout() {
    this.mvcService.doLogOut();
    const configModal: ConfigModalInterface = {
      class: 'error',
      tittle: 'Errors.unexpectedError',
      messages: ['Errors.errorTryLogin', 'Errors.retryLater'],
      buttons: [{label: 'accept'}]
    };
    this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal);
  }
  /**
   * * ACABADA
   * @description dependiendo del tipo de error, realizaré una determinada acción
   * @param errorCredential
   */
  // refactor
  private _showErrorLoginRRSS(errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) {
    let configModal: ConfigModalInterface;
    switch (errorCredential.code) {
      case 'auth/popup-closed-by-user':
        // no hago nada, porque el usuario a cancelado o cerrado el popup de LOGIN del Provider
        break;  // LÓGICA DE APLICACIÓN
      case 'auth/account-exists-with-different-credential':
        const email = errorCredential.email;
        // obtener su lista de provider para enseñársela al usuario
        this.authService.fetchProvidersForEmail(email) // LÓGICA DE APLICACIÓN
          .subscribe(
            (providers: Array<string>) => {
              configModal = {
                class: 'error',
                tittle: 'Errors.anotherProvider',
                messages: ['Errors.retryLoginAnotherProvider', '"' + providers[0] + '"'],
                buttons: [{label: 'accept'}]
              };
              this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal);  // LÓGICA DE APLICACIÓN
            },
            errorFetchProvidersForEmail => {
              console.log('showErrorLoginRRSS() errorFetchProvidersForEmail: ', errorFetchProvidersForEmail);
              configModal = {
                class: 'error',
                tittle: 'Errors.unexpectedError',
                messages: ['Errors.errorTryLogin', 'Errors.retry'],
                buttons: [{label: 'accept'}]
              };
              this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal); // LÓGICA DE APLICACIÓN
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
        this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal); // LÓGICA DE APLICACIÓN
        break;
    }
  }
  /**
   * * ACABADA
   * @description cuando he recogido el email del usuario, llamo al servicio de Auth para que envíe un email con las intrucciones
   * @param email 
   */
  private _resetPAssword(email: string) {
    this.windowSpinnerSnackbarService.openSpinner(); // LÓGICA APLICACIÓN
    this.mvcService.resetPassword(email) // LÓGICA DE NEGOCIO
    .subscribe(
      (sendEmailSuccess) => {
        this.windowSpinnerSnackbarService.closeSpiner();
        const configModal: ConfigModalInterface = {
          tittle: 'Success.sendEmailRecoveryPassSucess',
          messages: ['Success.openEmail'],
          buttons: [{label: 'accept'}]
        };
        this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal); // LÓGICA APLICACIÓN
      },
      sendEmailError => {
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
        this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal); // LÓGICA APLICACIÓN
      });
  }

}
