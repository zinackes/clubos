export const french : { [key: string]: string} = {
    "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL": "Un utilisateur existe deja pour cette adresse mail.",
    "INVALID_EMAIL_OR_PASSWORD": "Le mail ou le mot de passe est invalide"
}

export function getFrenchTranslation(code: string){
    return french[code];
}