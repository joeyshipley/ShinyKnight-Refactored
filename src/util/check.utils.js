import { RULES } from '../gameRules.constants';
import { MATH } from './math.utils';

export const CHECK = {

  has_evaded: (evade_chance) => {
    return MATH.roll_100() > ( RULES.CHECK.BASE_EVADE - evade_chance );
  },

  is_defeated: (character) => {
    return character.health_points <= RULES.CHECK.MIN_HEALTH;
  }

};
