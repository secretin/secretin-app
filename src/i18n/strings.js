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
    logout: 'Log out',
    dontHaveAccount: "I don't have an account",
    SignUpSubtext: 'create one',
    defaultLanguage: 'Language',
    refreshLanguage: 'Language will change next time you refresh the page',
    donate: 'Donate',
    all: 'All',
    'my secrets': 'My secrets',
    'shared secrets': 'shared secrets',
    settings: 'Settings',
    'export secrets': 'Export secrets',
    'import secrets': 'Importer secrets',
    'new secret': 'Secret',
    'new folder': 'Folder',
    search: 'Search...',
    'Last modified': 'Last modified',
    'Shared with': 'Shared with',
    Title: 'Title',
  },
  fr: {
    Username: "Nom d'utilisateur",
    Password: 'Mot de passe',
    'Sign up': 'Créer un compte',
    'Sign in': 'Se connecter',
    logout: 'Déconnexion',
    confirmPassword: 'Confirmer le mot de passe',
    alreadyHaveAccount: "J'ai déjà un compte",
    SignInSubtext: 'me connecter',
    dontHaveAccount: "Je n'ai pas de compte",
    SignUpSubtext: "m'enregistrer",
    defaultLanguage: "Langue de l'interface",
    refreshLanguage: 'Rafraîchissez la page pour changer la langue',
    donate: 'Faire un don',
    all: 'Tous les secrets',
    'my secrets': 'Mes secrets',
    'shared secrets': 'Secrets partagés',
    settings: 'Paramètres',
    'export secrets': 'Exporter mes secrets',
    'import secrets': 'Importer des secrets',
    'new secret': 'Secret',
    'new folder': 'Dossier',
    search: 'Rechercher...',
    'Last modified': 'Dernière modification',
    'Shared with': 'Partagé avec',
    Title: 'Titre',
  },
};
