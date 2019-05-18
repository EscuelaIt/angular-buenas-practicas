// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  routesName: {
    login: 'login',
    createAccount: 'create-account',
    myAccount: 'my-account'
  },
  firestoneCollectionNames: {
    users: 'users',
    morInfo: 'more-info',
    provider: 'provider'
  },
  firebase: {
    apiKey: '121314',
    authDomain: '',
    databaseURL: '',
    projectId: '121314',
    storageBucket: '',
    messagingSenderId: ''
  }
};
