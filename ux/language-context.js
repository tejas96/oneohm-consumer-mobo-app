// ─── OneOhm Language Context ───────────────────────────────────────────────

const LANGUAGES = {
  EN: {
    id: 'en',
    label: 'English',
    native: 'English',
  },
  MR: {
    id: 'mr',
    label: 'Marathi',
    native: 'मराठी',
  },
};

const ACTIVE_LANG_KEY = 'oneohm_active_lang';

function getActiveLanguage() {
  return localStorage.getItem(ACTIVE_LANG_KEY) || LANGUAGES.EN.id;
}

function setActiveLanguage(id) {
  localStorage.setItem(ACTIVE_LANG_KEY, id);
  // Refresh page to apply changes
  window.location.reload();
}

// Simple translation helper for common UI elements
const UI_STRINGS = {
  en: {
    home: 'Home',
    project: 'Project',
    docs: 'Docs',
    payments: 'Payments',
    profile: 'Profile',
    switch_project: 'Switch Project',
    notifications: 'Notifications',
    good_morning: 'Good Morning',
    good_afternoon: 'Good Afternoon',
    good_evening: 'Good Evening',
  },
  mr: {
    home: 'होम',
    project: 'प्रकल्प',
    docs: 'कागदपत्रे',
    payments: 'पेमेंट',
    profile: 'प्रोफाइल',
    switch_project: 'प्रकल्प बदला',
    notifications: 'सूचना',
    good_morning: 'शुभ प्रभात',
    good_afternoon: 'शुभ दुपार',
    good_evening: 'शुभ संध्याकाळ',
  },
};

function t(key) {
  const lang = getActiveLanguage();
  return UI_STRINGS[lang][key] || UI_STRINGS.en[key] || key;
}
