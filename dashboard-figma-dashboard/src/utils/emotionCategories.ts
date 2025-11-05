// L1 Categories: Energy and Pleasantness dimensions
export type L1Category = 
  | 'high_energy_pleasant'    // Yellow quadrant
  | 'high_energy_unpleasant'  // Red quadrant
  | 'low_energy_unpleasant'   // Blue quadrant
  | 'low_energy_pleasant';    // Green quadrant

export const L1_LABELS: Record<L1Category, string> = {
  high_energy_pleasant: 'High Energy Pleasant',
  high_energy_unpleasant: 'High Energy Unpleasant',
  low_energy_unpleasant: 'Low Energy Unpleasant',
  low_energy_pleasant: 'Low Energy Pleasant'
};

// Translated L1 Labels
export const L1_LABELS_TRANSLATED = {
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
  ru: {
    high_energy_pleasant: 'Высокая Энергия Приятная',
    high_energy_unpleasant: 'Высокая Энергия Неприятная',
    low_energy_unpleasant: 'Низкая Энергия Неприятная',
    low_energy_pleasant: 'Низкая Энергия Приятная'
  }
} as const;

// Function to get translated L1 label
export function getTranslatedL1Label(category: L1Category, language: 'en' | 'es' | 'ru' = 'en'): string {
  return L1_LABELS_TRANSLATED[language][category];
}

export const L1_COLORS: Record<L1Category, string> = {
  high_energy_pleasant: '#facc15',    // Yellow
  high_energy_unpleasant: '#ef4444',  // Red
  low_energy_unpleasant: '#3b82f6',   // Blue
  low_energy_pleasant: '#10b981'      // Green
};

// Sample L2 emotions for each L1 category (representing 100 total per category)
// In production, this would contain all 100 emotions per category
export const L2_EMOTIONS: Record<L1Category, string[]> = {
  high_energy_pleasant: [
    'Joyful', 'Excited', 'Energetic', 'Enthusiastic', 'Thrilled', 'Elated', 
    'Ecstatic', 'Cheerful', 'Lively', 'Vibrant', 'Optimistic', 'Hopeful',
    'Inspired', 'Passionate', 'Exhilarated', 'Delighted', 'Happy', 'Playful',
    'Adventurous', 'Confident', 'Proud', 'Amazed', 'Eager', 'Motivated',
    'Determined', 'Ambitious', 'Creative', 'Innovative', 'Bold', 'Brave',
    'Courageous', 'Spirited', 'Dynamic', 'Active', 'Alert', 'Awake',
    'Refreshed', 'Invigorated', 'Stimulated', 'Animated', 'Buoyant', 'Radiant',
    'Sparkling', 'Glowing', 'Zestful', 'Perky', 'Zippy', 'Bouncy',
    'Uplifted', 'Elevated'
  ],
  high_energy_unpleasant: [
    'Angry', 'Frustrated', 'Anxious', 'Stressed', 'Irritated', 'Annoyed',
    'Furious', 'Enraged', 'Hostile', 'Agitated', 'Tense', 'Nervous',
    'Worried', 'Panicked', 'Fearful', 'Scared', 'Terrified', 'Alarmed',
    'Startled', 'Shocked', 'Overwhelmed', 'Frantic', 'Hysterical', 'Defensive',
    'Rebellious', 'Defiant', 'Resentful', 'Bitter', 'Outraged', 'Offended',
    'Indignant', 'Appalled', 'Disgusted', 'Repulsed', 'Horrified', 'Disturbed',
    'Uncomfortable', 'Uneasy', 'Restless', 'Edgy', 'Jittery', 'Flustered',
    'Impatient', 'Jealous', 'Envious', 'Suspicious', 'Paranoid', 'Threatened',
    'Insecure', 'Vulnerable'
  ],
  low_energy_unpleasant: [
    'Sad', 'Depressed', 'Lonely', 'Tired', 'Exhausted', 'Drained',
    'Dejected', 'Miserable', 'Hopeless', 'Helpless', 'Powerless', 'Defeated',
    'Discouraged', 'Disappointed', 'Heartbroken', 'Grief-stricken', 'Sorrowful', 'Melancholic',
    'Gloomy', 'Despondent', 'Forlorn', 'Alienated', 'Isolated', 'Abandoned',
    'Neglected', 'Rejected', 'Worthless', 'Ashamed', 'Guilty', 'Embarrassed',
    'Humiliated', 'Remorseful', 'Regretful', 'Fatigued', 'Weary', 'Lethargic',
    'Sluggish', 'Apathetic', 'Indifferent', 'Numb', 'Empty', 'Hollow',
    'Lost', 'Confused', 'Uncertain', 'Doubtful', 'Insecure', 'Fragile',
    'Vulnerable', 'Broken'
  ],
  low_energy_pleasant: [
    'Calm', 'Relaxed', 'Peaceful', 'Content', 'Satisfied', 'Serene',
    'Tranquil', 'Comfortable', 'At ease', 'Rested', 'Refreshed', 'Mellow',
    'Soothed', 'Relieved', 'Secure', 'Safe', 'Protected', 'Grateful',
    'Thankful', 'Blessed', 'Appreciative', 'Loving', 'Affectionate', 'Tender',
    'Compassionate', 'Kind', 'Gentle', 'Patient', 'Understanding', 'Accepting',
    'Forgiving', 'Mindful', 'Present', 'Centered', 'Grounded', 'Balanced',
    'Harmonious', 'Settled', 'Still', 'Quiet', 'Meditative', 'Reflective',
    'Thoughtful', 'Contemplative', 'Introspective', 'Cozy', 'Warm', 'Snug',
    'Pleasant', 'Agreeable'
  ]
};

// Get a random L2 emotion from a given L1 category
export function getRandomL2Emotion(l1Category: L1Category): string {
  const emotions = L2_EMOTIONS[l1Category];
  return emotions[Math.floor(Math.random() * emotions.length)];
}

// Determine L1 category from L2 emotion
export function getL1FromL2(l2Emotion: string): L1Category | null {
  for (const [l1, emotions] of Object.entries(L2_EMOTIONS)) {
    if (emotions.includes(l2Emotion)) {
      return l1 as L1Category;
    }
  }
  return null;
}

// L2 Emotion translations
export const L2_EMOTION_TRANSLATIONS: Record<string, Record<string, string>> = {
  // High Energy Pleasant emotions
  'Joyful': { en: 'Joyful', es: 'Alegre', ru: 'Радостный' },
  'Excited': { en: 'Excited', es: 'Emocionado', ru: 'Взволнованный' },
  'Energetic': { en: 'Energetic', es: 'Enérgico', ru: 'Энергичный' },
  'Enthusiastic': { en: 'Enthusiastic', es: 'Entusiasta', ru: 'Восторженный' },
  'Thrilled': { en: 'Thrilled', es: 'Emocionado', ru: 'Взволнованный' },
  'Elated': { en: 'Elated', es: 'Eufórico', ru: 'Ликующий' },
  'Ecstatic': { en: 'Ecstatic', es: 'Extático', ru: 'Экстатичный' },
  'Cheerful': { en: 'Cheerful', es: 'Alegre', ru: 'Веселый' },
  'Happy': { en: 'Happy', es: 'Feliz', ru: 'Счастливый' },
  'Confident': { en: 'Confident', es: 'Confiado', ru: 'Уверенный' },
  'Optimistic': { en: 'Optimistic', es: 'Optimista', ru: 'Оптимистичный' },
  'Hopeful': { en: 'Hopeful', es: 'Esperanzado', ru: 'Полный надежд' },
  'Inspired': { en: 'Inspired', es: 'Inspirado', ru: 'Вдохновленный' },
  'Passionate': { en: 'Passionate', es: 'Apasionado', ru: 'Страстный' },
  'Creative': { en: 'Creative', es: 'Creativo', ru: 'Творческий' },
  'Motivated': { en: 'Motivated', es: 'Motivado', ru: 'Мотивированный' },
  
  // High Energy Unpleasant emotions
  'Angry': { en: 'Angry', es: 'Enojado', ru: 'Злой' },
  'Frustrated': { en: 'Frustrated', es: 'Frustrado', ru: 'Расстроенный' },
  'Anxious': { en: 'Anxious', es: 'Ansioso', ru: 'Тревожный' },
  'Stressed': { en: 'Stressed', es: 'Estresado', ru: 'Напряженный' },
  'Irritated': { en: 'Irritated', es: 'Irritado', ru: 'Раздраженный' },
  'Annoyed': { en: 'Annoyed', es: 'Molesto', ru: 'Раздосадованный' },
  'Furious': { en: 'Furious', es: 'Furioso', ru: 'Яростный' },
  'Worried': { en: 'Worried', es: 'Preocupado', ru: 'Обеспокоенный' },
  'Nervous': { en: 'Nervous', es: 'Nervioso', ru: 'Нервный' },
  'Scared': { en: 'Scared', es: 'Asustado', ru: 'Испуганный' },
  'Fearful': { en: 'Fearful', es: 'Temeroso', ru: 'Боязливый' },
  'Overwhelmed': { en: 'Overwhelmed', es: 'Abrumado', ru: 'Подавленный' },
  'Defensive': { en: 'Defensive', es: 'Defensivo', ru: 'Оборонительный' },
  'Jealous': { en: 'Jealous', es: 'Celoso', ru: 'Ревнивый' },
  'Insecure': { en: 'Insecure', es: 'Inseguro', ru: 'Неуверенный' },
  
  // Low Energy Unpleasant emotions
  'Sad': { en: 'Sad', es: 'Triste', ru: 'Грустный' },
  'Depressed': { en: 'Depressed', es: 'Deprimido', ru: 'Подавленный' },
  'Lonely': { en: 'Lonely', es: 'Solo', ru: 'Одинокий' },
  'Tired': { en: 'Tired', es: 'Cansado', ru: 'Усталый' },
  'Exhausted': { en: 'Exhausted', es: 'Agotado', ru: 'Истощенный' },
  'Disappointed': { en: 'Disappointed', es: 'Decepcionado', ru: 'Разочарованный' },
  'Hopeless': { en: 'Hopeless', es: 'Sin esperanza', ru: 'Безнадежный' },
  'Helpless': { en: 'Helpless', es: 'Indefenso', ru: 'Беспомощный' },
  'Defeated': { en: 'Defeated', es: 'Derrotado', ru: 'Побежденный' },
  'Ashamed': { en: 'Ashamed', es: 'Avergonzado', ru: 'Пристыженный' },
  'Guilty': { en: 'Guilty', es: 'Culpable', ru: 'Виноватый' },
  'Empty': { en: 'Empty', es: 'Vacío', ru: 'Пустой' },
  'Lost': { en: 'Lost', es: 'Perdido', ru: 'Потерянный' },
  'Confused': { en: 'Confused', es: 'Confundido', ru: 'Смущенный' },
  'Vulnerable': { en: 'Vulnerable', es: 'Vulnerable', ru: 'Уязвимый' },
  
  // Low Energy Pleasant emotions
  'Calm': { en: 'Calm', es: 'Tranquilo', ru: 'Спокойный' },
  'Relaxed': { en: 'Relaxed', es: 'Relajado', ru: 'Расслабленный' },
  'Peaceful': { en: 'Peaceful', es: 'Pacífico', ru: 'Мирный' },
  'Content': { en: 'Content', es: 'Contento', ru: 'Довольный' },
  'Satisfied': { en: 'Satisfied', es: 'Satisfecho', ru: 'Удовлетворенный' },
  'Serene': { en: 'Serene', es: 'Sereno', ru: 'Безмятежный' },
  'Comfortable': { en: 'Comfortable', es: 'Cómodo', ru: 'Комфортный' },
  'Secure': { en: 'Secure', es: 'Seguro', ru: 'Защищенный' },
  'Grateful': { en: 'Grateful', es: 'Agradecido', ru: 'Благодарный' },
  'Loving': { en: 'Loving', es: 'Amoroso', ru: 'Любящий' },
  'Kind': { en: 'Kind', es: 'Amable', ru: 'Добрый' },
  'Patient': { en: 'Patient', es: 'Paciente', ru: 'Терпеливый' },
  'Mindful': { en: 'Mindful', es: 'Consciente', ru: 'Внимательный' },
  'Balanced': { en: 'Balanced', es: 'Equilibrado', ru: 'Сбалансированный' },
  'Cozy': { en: 'Cozy', es: 'Acogedor', ru: 'Уютный' }
};

// Get translated L2 emotion label
export function getTranslatedL2Label(l2Emotion: string, language: string = 'en'): string {
  const translations = L2_EMOTION_TRANSLATIONS[l2Emotion];
  if (translations && translations[language]) {
    return translations[language];
  }
  return l2Emotion; // Return original if no translation found
}
