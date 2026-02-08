export const french : { [key: string]: string} = {
    "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL": "Un utilisateur existe deja pour cette adresse mail.",
    "INVALID_EMAIL_OR_PASSWORD": "Le mail ou le mot de passe est invalide",
    "FAILED_TO_CREATE_USER": "Erreur dans la création de l'utilisateur",
    "Internal Server Error": "Erreur interne du serveur"
}

export function getFrenchTranslation(code: string){
    return french[code];
}