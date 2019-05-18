// tslint:disable: max-line-length
import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FormToolsService } from 'src/app/services/form-tools/form-tools.service';
import { AuthService } from 'src/app/services/firebase-login/auth.service';
import { Observable } from 'rxjs';
import { LoginEmailDataSend } from 'src/app/interfaces/login-email-data-send/login-email-data-send';
import { UserProviderModel } from 'src/app/models/user-provider/user-provider.model';
import { FirestoreToolsService } from 'src/app/services/firestore-tools/firestore-tools.service';
import { environment } from 'src/environments/environment';

@Injectable()
export class LoginService {

  // modelos de datos
  formLogin: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formToolsService: FormToolsService,
    private authService: AuthService,
    private firestoreToolsService: FirestoreToolsService
  ) { }

  // lógica de negocio

  tryEmailLogin(): Observable<firebase.auth.UserCredential> {
    const values: LoginEmailDataSend = this.formLogin.value;
    return this.authService.doLogin(values);
  }

  tryGoogleLogin(): Promise<firebase.auth.UserCredential> {
    return this.authService.googleLogin();
  }

  createForm() {
    this.formLogin = this.formBuilder.group({
      email: ['', [
                    Validators.required,
                    this.formToolsService.patternValidator(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, true, { email: true }),
                  ]],
      password: ['', [
                      Validators.required,
                      Validators.minLength(8),
                      this.formToolsService.patternValidator(/\d/, true, { hasNumber: true }),
                      this.formToolsService.patternValidator(/[A-Z]/, true, { hasCapitalCase: true }),
                      this.formToolsService.patternValidator(/[a-z]/, true, { hasSmallCase: true }),
                      this.formToolsService.patternValidator(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, true, { hasSpecialCharacters: true })
                    ]]
    });
  }

  createUserDataFromCredential(credential: firebase.auth.UserCredential): Promise<any> {
    const userLogin = new UserProviderModel(credential);
    return this.firestoreToolsService.updateFirestoneItemById (
      environment.firestoneCollectionNames.users,
      userLogin.uid,
      userLogin.saveUserInfoUpdate()
    );
  }

  updateUserProviderDataRRSS(credential: firebase.auth.UserCredential): Promise<any> {
    const uid = credential.user.uid;
    const url = environment.firestoneCollectionNames.users + '/' + uid + '/' + environment.firestoneCollectionNames.morInfo + '/' + environment.firestoneCollectionNames.provider;
    return this.firestoreToolsService.updateFirestoneItem (
      url,
      credential.additionalUserInfo.profile
    );
  }
}