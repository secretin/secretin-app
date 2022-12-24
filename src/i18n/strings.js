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
    login: 'Username',
    password: 'Password',
    'Sign up': 'Sign up',
    'Sign in': 'Sign in',
    confirmPassword: 'Confirm password',
    alreadyHaveAccount: 'I already have an account',
    SignInSubtext: 'sign in',
    logout: 'Log out',
    dontHaveAccount: "I don't have an account",
    SignUpSubtext: 'create one',
    defaultLanguage: 'Language',
    donate: 'Donate',
    all: 'All',
    'my secrets': 'My secrets',
    'shared secrets': 'Shared secrets',
    settings: 'Settings',
    'export secrets': 'Export secrets',
    'import secrets': 'Importer secrets',
    'new secret': 'Secret',
    'new folder': 'Folder',
    search: 'Search...',
    'Last modified': 'Last modified',
    'Shared with': 'Shared with',
    Title: 'Title',
    'create folder title': 'Add new folder',
    'create secret title': 'Add new secret',
    'add folder button': 'Add folder',
    'add secret button': 'Add secret',
    Close: 'Close',
    shareWarning: 'You are about to give',
    latest: '(latest)',
    oldest: '(oldest)',
    'Secret title': 'Secret title',
    Copy: 'Copy',
    Open: 'Open',
    url: 'url',
    to: 'to',
    on: 'on',
    'Share the secret': 'Share the secret',
    'Read only': 'Read only',
    'Read and write': 'Read and write',
    'Read, write and share': 'Read, write and share',
    "You don't have the permission to share this secret":
      "You don't have the permission to share this secret",
    "You can't modify or remove yourself":
      "You can't modify or remove yourself",
    'Generate strong': 'Generate strong',
    'Generate alphanumeric': 'Generate alphanumeric',
    'Generate pronounceable': 'Generate pronounceable',
    Details: 'Details',
    'Who has access': 'Who has access',
    History: 'History',
    Save: 'Save',
    'Untitled secret': 'Untitled secret',
    'Untitled folder': 'Untitled folder',
    'Folder title': 'Folder title',
    Cancel: 'Cancel',
  },
  fr: {
    login: "Nom d'utilisateur",
    password: 'Mot de passe',
    'Sign up': 'Créer un compte',
    'Sign in': 'Se connecter',
    logout: 'Déconnexion',
    confirmPassword: 'Confirmer le mot de passe',
    alreadyHaveAccount: "J'ai déjà un compte",
    SignInSubtext: 'me connecter',
    dontHaveAccount: "Je n'ai pas de compte",
    SignUpSubtext: "m'enregistrer",
    defaultLanguage: "Langue de l'interface",
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
    'create folder title': "Ajout d'un dossier",
    'create secret title': "Ajout d'un secret",
    'Folder title': 'Titre du dossier',
    'Secret title': 'Titre du secret',
    Cancel: 'Annuler',
    'add folder button': 'Créer le dossier',
    'add secret button': 'Créer le secret',
    Copy: 'Copier',
    'Untitled folder': 'Dossier sans titre',
    'Untitled secret': 'Secret sans titre',
    Open: 'Ouvrir',
    Close: 'Fermer',
    Details: 'Détails',
    'Who has access': 'Partage',
    History: 'Historique',
    Save: 'Sauvegarder',
    'read access': 'lecture',
    'read and write access': 'lecture et écriture',
    'read, write and share access': 'lecture, écriture et partage',
    'Are you sure?': 'Êtes-vous sûr·e ?',
    shareWarning: 'Vous vous apprêtez à donner les droits de',
    to: 'à',
    on: 'sur',
    'Share the secret': 'Partager le secret',
    'Read only': 'Lecture seule',
    'Read and write': 'Lecture et écriture',
    'Read, write and share': 'Lecture, écriture et partage',
    "You don't have the permission to share this secret":
      "Vous n'avez pas la permission de partager ce secret",
    "You can't modify or remove yourself":
      'Vous ne pouvez pas modifier vos propres permissions',
    'Generate strong': 'Mot de passe fort',
    'Generate alphanumeric': 'Mot de passe alphanumérique',
    'Generate pronounceable': 'Mot de passe prononçable',
    latest: '(le plus récent)',
    oldest: '(le plus ancien)',
    url: 'url',
  },
};