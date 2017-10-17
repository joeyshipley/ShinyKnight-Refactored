import { RULES } from '../gameRules.constants';
import { Character } from './character';

export class Wizard extends Character {
  constructor(armor) {
    super(RULES.CHARACTER_CLASS.WIZARD, armor);
  }
}
