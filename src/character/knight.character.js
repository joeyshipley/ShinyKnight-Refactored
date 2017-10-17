import { RULES } from '../gameRules.constants';
import { Character } from './character';

export class Knight extends Character {
  constructor(armor) {
    super(RULES.CHARACTER_CLASS.KNIGHT, armor);
  }
}
