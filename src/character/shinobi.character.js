import { RULES } from '../gameRules.constants';
import { Character } from './character';

export class Shinobi extends Character {
  constructor(name, level, hp, evade_chance, type_resistances, armor) {
    super(name, RULES.CHARACTER_CLASS.SHINOBI, level, hp, evade_chance, type_resistances, armor);
  }
}
