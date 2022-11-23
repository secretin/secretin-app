export function getStrings(locale) {
  return messages[locale];
}

export function getSupportedBrowserLocale() {
  if (!window.navigator.language) return 'en';
  if (supportedLocales[window.navigator.language])
    return window.navigator.language;
  return 'en';
}

export const supportedLocales = {
  en: 'English',
  fr: 'Français',
};

export const messages = {
  en: {
    Username: 'Username',
    Password: 'Password',
    'Sign up': 'Sign up',
    'Sign in': 'Sign in',
    confirmPassword: 'Confirm password',
    alreadyHaveAccount: 'I already have an account',
    SignInSubtext: 'sign in',
    dontHaveAccount: 'I don&apos;t have an account',
    SignUpSubtext: 'create one',
    defaultLanguage: 'Language',
    refreshLanguage: 'Language will change next time you refresh the page',
    all: 'All',
  },
  fr: {
    Username: "Nom d'utilisateur",
    Password: 'Mot de passe',
    'Sign up': 'Créer un compte',
    'Sign in': 'Se connecter',
    confirmPassword: 'Confirmer le mot de passe',
    alreadyHaveAccount: "J'ai déjà un compte",
    SignInSubtext: 'me connecter',
    dontHaveAccount: "Je n'ai pas de compte",
    SignUpSubtext: "m'enregistrer",
    defaultLanguage: "Langue de l'interface",
    refreshLanguage: 'Rafraîchissez la page pour changer la langue',
    all: 'Tous',
  },
};
