interface ISignUpModel {
    username: string;
    password: string;
    name: string;
    confirmPassword?: string;
    acceptPrivacyPolicy?: boolean;
};


export type {
    ISignUpModel
}