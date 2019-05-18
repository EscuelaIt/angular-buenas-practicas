export interface ButtonModalInterface {
    label: 'accept' | 'cancel' | 'myCount' | 'home'; // dar de alta en el "es.json", apartado "Buttons"
    action?: 'redirectMyAccount' | 'redirectHome';
    color?: 'primary' | 'accent' | 'warn';
}

export interface ConfigModalInterface {
    class?: 'error';
    tittle: string;
    messages: Array<string>;
    buttons: Array<ButtonModalInterface>;
}
