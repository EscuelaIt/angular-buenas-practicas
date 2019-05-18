interface CredentialInterface {
    a: any;
    accessToken: string;
    providerId: string; // "facebook.com"
    signInMethod: string; // "facebook.com"
    secret?: string; // "5k8TxSk0CdhFAUJSu0QmlUEWx1qMw0IMx4zt9lVYYg4cO"
}


export interface ErrorLoginFirebaseInterface {
    code: string;
    message: string;
}

export interface ErrorCreateEmailRegisterFirebaseInterface extends ErrorLoginFirebaseInterface {
    name: string;
}

export interface ErrorCreateSocialMediaRegisterFirebaseInterface extends ErrorLoginFirebaseInterface {
    email: string;
    credential: CredentialInterface;
}
