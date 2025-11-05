// Multi-language support for emotions

import { L1Category, L2_EMOTIONS } from './emotionCategories';

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ar';

// L1 Category translations
export const L1_TRANSLATIONS: Record<SupportedLanguage, Record<L1Category, string>> = {
  en: {
    high_energy_pleasant: 'High Energy Pleasant',
    high_energy_unpleasant: 'High Energy Unpleasant',
    low_energy_unpleasant: 'Low Energy Unpleasant',
    low_energy_pleasant: 'Low Energy Pleasant'
  },
  es: {
    high_energy_pleasant: 'Alta Energía Agradable',
    high_energy_unpleasant: 'Alta Energía Desagradable',
    low_energy_unpleasant: 'Baja Energía Desagradable',
    low_energy_pleasant: 'Baja Energía Agradable'
  },
  fr: {
    high_energy_pleasant: 'Haute Énergie Agréable',
    high_energy_unpleasant: 'Haute Énergie Désagréable',
    low_energy_unpleasant: 'Basse Énergie Désagréable',
    low_energy_pleasant: 'Basse Énergie Agréable'
  },
  de: {
    high_energy_pleasant: 'Hohe Energie Angenehm',
    high_energy_unpleasant: 'Hohe Energie Unangenehm',
    low_energy_unpleasant: 'Niedrige Energie Unangenehm',
    low_energy_pleasant: 'Niedrige Energie Angenehm'
  },
  zh: {
    high_energy_pleasant: '高能量愉快',
    high_energy_unpleasant: '高能量不愉快',
    low_energy_unpleasant: '低能量不愉快',
    low_energy_pleasant: '低能量愉快'
  },
  ja: {
    high_energy_pleasant: '高エネルギー快適',
    high_energy_unpleasant: '高エネルギー不快',
    low_energy_unpleasant: '低エネルギー不快',
    low_energy_pleasant: '低エネルギー快適'
  },
  ar: {
    high_energy_pleasant: 'طاقة عالية سارة',
    high_energy_unpleasant: 'طاقة عالية غير سارة',
    low_energy_unpleasant: 'طاقة منخفضة غير سارة',
    low_energy_pleasant: 'طاقة منخفضة سارة'
  }
};

// Sample L2 emotion translations (in production, all 100 emotions would be translated)
export const L2_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // English is the default, emotions are already in English
    'Joyful': 'Joyful',
    'Excited': 'Excited',
    'Angry': 'Angry',
    'Frustrated': 'Frustrated',
    'Sad': 'Sad',
    'Calm': 'Calm',
    'Relaxed': 'Relaxed',
    // ... (all other emotions would be here)
  },
  es: {
    'Joyful': 'Alegre',
    'Excited': 'Emocionado',
    'Angry': 'Enojado',
    'Frustrated': 'Frustrado',
    'Sad': 'Triste',
    'Calm': 'Tranquilo',
    'Relaxed': 'Relajado',
    // ... (Spanish translations)
  },
  fr: {
    'Joyful': 'Joyeux',
    'Excited': 'Excité',
    'Angry': 'En colère',
    'Frustrated': 'Frustré',
    'Sad': 'Triste',
    'Calm': 'Calme',
    'Relaxed': 'Détendu',
    // ... (French translations)
  },
  de: {
    'Joyful': 'Freudig',
    'Excited': 'Aufgeregt',
    'Angry': 'Wütend',
    'Frustrated': 'Frustriert',
    'Sad': 'Traurig',
    'Calm': 'Ruhig',
    'Relaxed': 'Entspannt',
    // ... (German translations)
  },
  zh: {
    'Joyful': '快乐',
    'Excited': '兴奋',
    'Angry': '生气',
    'Frustrated': '沮丧',
    'Sad': '悲伤',
    'Calm': '平静',
    'Relaxed': '放松',
    // ... (Chinese translations)
  },
  ja: {
    'Joyful': '喜び',
    'Excited': '興奮',
    'Angry': '怒り',
    'Frustrated': '欲求不満',
    'Sad': '悲しい',
    'Calm': '穏やか',
    'Relaxed': 'リラックス',
    // ... (Japanese translations)
  },
  ar: {
    'Joyful': 'مبتهج',
    'Excited': 'متحمس',
    'Angry': 'غاضب',
    'Frustrated': 'محبط',
    'Sad': 'حزين',
    'Calm': 'هادئ',
    'Relaxed': 'مسترخٍ',
    // ... (Arabic translations)
  }
};

export function getL1Label(category: L1Category, language: SupportedLanguage = 'en'): string {
  return L1_TRANSLATIONS[language]?.[category] || L1_TRANSLATIONS.en[category];
}

export function getL2Label(emotion: string, language: SupportedLanguage = 'en'): string {
  return L2_TRANSLATIONS[language]?.[emotion] || emotion;
}

export function translateEmotion(emotion: string, fromLang: SupportedLanguage, toLang: SupportedLanguage): string {
  // Find the English version first
  let englishVersion = emotion;
  
  if (fromLang !== 'en') {
    const fromDict = L2_TRANSLATIONS[fromLang];
    const entry = Object.entries(fromDict).find(([_, translated]) => translated === emotion);
    if (entry) {
      englishVersion = entry[0];
    }
  }
  
  // Then translate to target language
  return L2_TRANSLATIONS[toLang]?.[englishVersion] || emotion;
}
