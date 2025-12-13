export const french : { [key: string]: string} = {
    "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL": "Un utilisateur existe deja pour cette adresse mail."
}

export function getFrenchTranslation(code: string){
    return french[code];
}