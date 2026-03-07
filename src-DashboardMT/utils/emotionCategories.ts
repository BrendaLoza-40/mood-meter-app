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
