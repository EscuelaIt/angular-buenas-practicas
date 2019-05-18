// Angular
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// servicios de terceros
import { MatDialogConfig } from '@angular/material';

// mis servicios
import { RoutingHistoryService } from 'src/app/services/routing-history/routing-history.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { WindowSpinnerSnackbarService } from 'src/app/services/window-spinner-snackbar/window-spinner-snackbar.service';
import { ConfigAppService } from 'src/app/services/config-app/config-app.service';
import { FirestoreToolsService } from 'src/app/services/firestore-tools/firestore-tools.service';
import { FormToolsService } from 'src/app/services/form-tools/form-tools.service';

// mis componentes
import { RecoveryPasswordComponent } from 'src/app/components/recovery-password/recovery-password.component';

// mis modelos
import { UserProviderModel } from 'src/app/models/user-provider/user-provider.model';

// mis interfaces
import { LoginEmailDataSendIntrerface } from 'src/app/interfaces/login-email-data-send';
import { ErrorLoginFirebaseInterface } from 'src/app/interfaces/error-login-firebase-interface';
import { ConfigModalInterface } from 'src/app/interfaces/config-modal-interface';
import { ErrorCreateSocialMediaRegisterFirebaseInterface } from 'src/app/interfaces/error-create-social-media-register-firebase-interface';

// constantes
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-no-mvc',
  templateUrl: './no-mvc.component.html',
  styleUrls: ['./no-mvc.component.sass']
})
export class NoMvcComponent implements OnInit {

  formLogin: FormGroup;
  environment = environment;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private routingHistoryService: RoutingHistoryService,
    private windowSpinnerSnackbarService: WindowSpinnerSnackbarService,
    private firestoreToolsService: FirestoreToolsService,
    private configAppService: ConfigAppService,
    private formToolsService: FormToolsService
  ) { }

  ngOnInit() {
    this.windowSpinnerSnackbarService.openSpinner();
    this._createForm();
    this.windowSpinnerSnackbarService.closeSpiner();
  }


  tryEmailLogin() {
    this.windowSpinnerSnackbarService.openSpinner();
    const values: LoginEmailDataSendIntrerface = this.formLogin.value;
    this.authService.doLogin(values)
      .subscribe(
        (sucessEmialLogin: firebase.auth.UserCredential) => {
          this.windowSpinnerSnackbarService.closeSpiner();
          this._navigateHomeOrBackUrl();
        },
        (errEmailLogin: ErrorLoginFirebaseInterface) => {
          this.windowSpinnerSnackbarService.closeSpiner(true);
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
        });
  }

  tryGoogleLogin() {
    this.windowSpinnerSnackbarService.openSpinner();
    this.authService.googleLogin()
      .subscribe(
        (credential: firebase.auth.UserCredential) => {
          this.windowSpinnerSnackbarService.closeSpiner();
          this._tryCreateUserDataRRSS(credential);
        },
        ((errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) => {
          this.windowSpinnerSnackbarService.closeSpiner(true);
          this.showErrorLoginRRSS(errorCredential);
        })
      );
  }

  tryFacebookLogin() {
    this.windowSpinnerSnackbarService.openSpinner();
    this.authService.facebookLogin()
      .subscribe(
        (credential: firebase.auth.UserCredential) => {
          this.windowSpinnerSnackbarService.closeSpiner();
          this._tryCreateUserDataRRSS(credential);
        },
        ((errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) => {
          this.windowSpinnerSnackbarService.closeSpiner(true);
          this.showErrorLoginRRSS(errorCredential);
        })
      );
  }

  tryTwitterLogin() {
    this.windowSpinnerSnackbarService.openSpinner();
    this.authService.twitterLogin()
    .subscribe(
      (credential: firebase.auth.UserCredential) => {
        this.windowSpinnerSnackbarService.closeSpiner();
        this._tryCreateUserDataRRSS(credential);
      },
      ((errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) => {
        this.windowSpinnerSnackbarService.closeSpiner(true);
        this.showErrorLoginRRSS(errorCredential);
      })
    );
  }

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
      buttons: []
    };
    const configWindow: MatDialogConfig = {
      disableClose: true,
      data
    };
    this.windowSpinnerSnackbarService.showCustomDialogWindowReturnReference( RecoveryPasswordComponent, configWindow)
      .afterClosed()
      .subscribe((email: {email: string}) => {
          if (email && email.email) {
            this._resetPAssword(email.email);
          }
        });
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

  private _navigateHomeOrBackUrl() {
    const lastNavigation = this.routingHistoryService.getPreviousUrl();
    if (lastNavigation && lastNavigation !== '/' + environment.routesName.login && lastNavigation !== '/' + environment.routesName.createAccount) {
      this.router.navigate([lastNavigation]);
    } else {
      this.router.navigate(['/' + environment.routesName.myAccount]);
    }
  }

  private showErrorLoginRRSS(errorCredential: ErrorCreateSocialMediaRegisterFirebaseInterface) {
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
              configModal = {
                class: 'error',
                tittle: 'Errors.unexpectedError',
                messages: ['Errors.errorTryLogin', 'Errors.retry'],
                buttons: [{label: 'accept'}]
              };
              this.windowSpinnerSnackbarService.showDialogWindowWithoutReference(configModal);
            });
        break;
      case 'auth/invalid-credential': // "Malformed response cannot be parsed from twitter.com for VERIFY_CREDENTIAL"
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

  private _tryCreateUserDataRRSS(credential: firebase.auth.UserCredential) {
    this.windowSpinnerSnackbarService.openSpinner();
    let myPromise: Promise<void | Error>;
    if (credential.additionalUserInfo.isNewUser) {
      const userLogin = new UserProviderModel(credential);
      myPromise = this._createUserDataRRSS(userLogin)
        .then(() => this._updateUserDataRRSS(credential));
    } else {
      myPromise =  this._updateUserDataRRSS(credential);
    }
    myPromise
      .then(() => {
        this.windowSpinnerSnackbarService.closeSpiner();
        this._navigateHomeOrBackUrl();
      })
      .catch((catchErrorCreateUserDataFirestone: Error) => {
        this.windowSpinnerSnackbarService.closeSpiner(true);
        const configModal: ConfigModalInterface = {
          class: 'error',
          tittle: 'Errors.unexpectedError',
          messages: ['Errors.errorTryLogin', 'Errors.retryLater'],
          buttons: [{label: 'accept'}]
        };
        this.windowSpinnerSnackbarService.showDialogWindowReturnReference(configModal)
          .afterClosed()
          .subscribe(data => {
            this.authService.doLogout();
          });
      });
  }

  private _updateUserDataRRSS(credential: firebase.auth.UserCredential): Promise<void> {
    const uid = credential.user.uid;
    const url = environment.firestoneCollectionNames.users + '/' + uid + '/' + environment.firestoneCollectionNames.morInfo + '/' + environment.firestoneCollectionNames.provider;
    return this.firestoreToolsService.updateFirestoneItem (
      url,
      credential.additionalUserInfo.profile
    );
  }

  private _createUserDataRRSS(user: UserProviderModel): Promise<void> {
    return this.firestoreToolsService.updateFirestoneItemById (
      environment.firestoneCollectionNames.users,
      user.uid,
      user.saveUserInfoUpdate()
    );
  }

  private _createForm() {
    this.formLogin = this.formBuilder.group({
      email: ['', [
                    Validators.required,
                    this.formToolsService.patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, true, { email: true }),
                  ]],
      password: ['', [Validators.required,
                      Validators.minLength(8),
                      this.formToolsService.patternValidator(/\d/, true, { hasNumber: true }),
                      this.formToolsService.patternValidator(/[A-Z]/, true, { hasCapitalCase: true }),
                      this.formToolsService.patternValidator(/[a-z]/, true, { hasSmallCase: true }),
                      this.formToolsService.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, true, { hasSpecialCharacters: true })
                    ]]
    });
  }

}
