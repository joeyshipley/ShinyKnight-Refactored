import { RULES } from '../gameRules.constants';
import { Character } from './character';

export class Knight extends Character {
  constructor(name, level, hp, evade_chance, type_resistances, armor) {
    super(name, level, hp, evade_chance, type_resistances, armor);
  }
}
