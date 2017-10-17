import { RULES } from '../gameRules.constants';
import { Character } from './character';

export class Shinobi extends Character {
  constructor(armor) {
    super(RULES.CHARACTER_CLASS.SHINOBI, armor);
  }
}
