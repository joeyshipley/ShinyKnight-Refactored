export const RULES = {
  CHECK: {
    BASE_EVADE: 100,
    MIN_LEVEL: 1,
    MIN_HEALTH: 0,
    NO_DAMAGE: 0
  },
  MODIFIER: {
    SURPRISE_DAMAGE: 1.5,
    EVADE_REDUCTION: 1.25
  },
  RESIST_TYPE_BASE_VALUE: {
    UNKNOWN: 0,
    STANDARD: 0,
    MAGIC: 1,
    EARTH: 1,
    FIRE: 1,
    WATER: 1,
    WIND: 1,
    SHADOW: 1,
    ICE: 1,
    LIGHTNING: 1,
    DARK: 1,
    LIGHT: 1,
    PSIONIC: 1
  },
  DAMAGE_TYPE: {
    UNKNOWN: '',
    STANDARD: 'standard',
    MAGIC: 'magic',
    EARTH: 'earth',
    FIRE: 'fire',
    WATER: 'water',
    WIND: 'wind',
    SHADOW: 'shadow',
    ICE: 'ice',
    LIGHTNING: 'lightning',
    DARK: 'dark',
    LIGHT: 'light',
    PSIONIC: 'psionic'
  },
  DEFENSE_RESULT: {
    NO_DAMAGE: 'NO_DAMAGE',
    DAMAGE_TAKEN: 'DAMAGE_TAKEN',
    CHARACTER_DEFEATED: 'CHARACTER_DEFEATED'
  }
}
