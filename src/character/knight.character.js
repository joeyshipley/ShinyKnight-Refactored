import { RULES } from '../gameRules.constants';
import { Character } from './character';

export class Knight extends Character {
  constructor(name, level, hp, evade_chance, type_resistances, armor) {
    super(name, level, hp, evade_chance, resistances(type_resistances), armor);
  }
}

function resistances(type_resistances) {
  let standard_resistance = type_resistances.find((r) => { return r.resistance_type == RULES.DAMAGE_TYPE.STANDARD; });
  standard_resistance.resistance_value = 10;
  return type_resistances;
}
