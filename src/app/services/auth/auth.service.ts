// Angular
import { Injectable } from '@angular/core';

// servicios de terceros
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import * as firebase from 'firebase/app';

// mis servicios
import { FirestoreToolsService } from '../firestore-tools/firestore-tools.service';

// mis interfaces
import { LoginEmailDataSendInterface } from 'src/app/interfaces/login-email-data-send';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private angularFireAuth: AngularFireAuth,
    private firestoreToolsService: FirestoreToolsService,
  ) { }

  doLogin(value: LoginEmailDataSendInterface): Observable<firebase.auth.UserCredential> {
    return from(this.angularFireAuth.auth
                        .signInWithEmailAndPassword(value.email, value.password));
  }

  googleLogin(): Promise<firebase.auth.UserCredential> {
    // creo el proveedor y añado los SCOPES necesarios
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    return  this.angularFireAuth.auth
              .signInWithPopup(provider);
  }

  facebookLogin(): Promise<firebase.auth.UserCredential> {
    // creo el proveedor y añado los SCOPES necesarios
    const provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('user_birthday');
    return this.angularFireAuth.auth
                .signInWithPopup(provider);
  }

  twitterLogin(): Promise<firebase.auth.UserCredential> {
    // creo el proveedor y añado los SCOPES necesarios
    const provider = new firebase.auth.TwitterAuthProvider();
    return this.angularFireAuth.auth
                .signInWithPopup(provider);
  }

  resetPassword(email: string): Observable<void> {
    return from(this.angularFireAuth
      .auth
      .sendPasswordResetEmail(email));
  }

  fetchProvidersForEmail(email: string): Observable<Array<string>> {
    return from(this.angularFireAuth.auth.fetchProvidersForEmail(email));
  }

  doLogout(): Promise<void> {
    if (firebase.auth().currentUser) {
      return this.angularFireAuth.auth.signOut();
    } else {
      return Promise.reject();
    }
  }

  deleteCurrentUser(): Promise<void> {
    const user = this.angularFireAuth.auth.currentUser;
    return user.delete();
  }
}
