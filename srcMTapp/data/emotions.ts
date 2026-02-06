export const emotions = {
  "high-pleasant": [
    "Joyful", "Excited", "Energized", "Enthusiastic", "Elated",
    "Thrilled", "Optimistic", "Cheerful", "Inspired", "Motivated",
    "Passionate", "Confident", "Proud", "Empowered", "Hopeful",
    "Amazed", "Ecstatic", "Delighted", "Uplifted", "Alive",
    "Playful", "Creative", "Adventurous", "Vibrant", "Grateful"
  ],
  "high-unpleasant": [
    "Angry", "Frustrated", "Anxious", "Stressed", "Irritated",
    "Worried", "Tense", "Nervous", "Overwhelmed", "Panicked",
    "Furious", "Annoyed", "Agitated", "Fearful", "Alarmed",
    "Threatened", "Hostile", "Defensive", "Restless", "Shocked",
    "Apprehensive", "Distressed", "Uneasy", "Terrified", "Enraged"
  ],
  "low-pleasant": [
    "Calm", "Peaceful", "Relaxed", "Content", "Serene",
    "Comfortable", "Satisfied", "Tranquil", "Mellow", "Secure",
    "Restful", "Balanced", "Harmonious", "Easygoing", "Centered",
    "Cozy", "Gentle", "Soft", "Soothed", "Grounded",
    "Carefree", "Stable", "Pleasant", "At ease", "Thoughtful"
  ],
  "low-unpleasant": [
    "Sad", "Tired", "Lonely", "Depressed", "Exhausted",
    "Disappointed", "Discouraged", "Hopeless", "Drained", "Bored",
    "Numb", "Empty", "Withdrawn", "Melancholy", "Defeated",
    "Isolated", "Gloomy", "Lethargic", "Apathetic", "Resigned",
    "Down", "Despondent", "Blah", "Sluggish", "Detached"
  ]
};

export type QuadrantId = keyof typeof emotions;
