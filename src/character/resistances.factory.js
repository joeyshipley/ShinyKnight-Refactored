import { RULES } from '../gameRules.constants';

export function build_resistances(character) {
  let resistances = [];

  const standard_resistance = (character.c_class == RULES.CHARACTER_CLASS.KNIGHT ? 10 : RULES.RESIST_TYPE_BASE_VALUE.STANDARD);
  const magic_resistance = (character.c_class == RULES.CHARACTER_CLASS.WIZARD ? 10 : RULES.RESIST_TYPE_BASE_VALUE.MAGIC);
  const shadow_resistance = (character.c_class == RULES.CHARACTER_CLASS.SHINOBI ? 10 : RULES.RESIST_TYPE_BASE_VALUE.SHADOW);

  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.STANDARD, standard_resistance));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.MAGIC, magic_resistance));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.EARTH, RULES.RESIST_TYPE_BASE_VALUE.EARTH));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.FIRE, RULES.RESIST_TYPE_BASE_VALUE.FIRE));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.WATER, RULES.RESIST_TYPE_BASE_VALUE.WATER));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.WIND, RULES.RESIST_TYPE_BASE_VALUE.WIND));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.SHADOW, shadow_resistance));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.ICE, RULES.RESIST_TYPE_BASE_VALUE.ICE));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.LIGHTNING, RULES.RESIST_TYPE_BASE_VALUE.LIGHTNING));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.DARK, RULES.RESIST_TYPE_BASE_VALUE.DARK));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.LIGHT, RULES.RESIST_TYPE_BASE_VALUE.LIGHT));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.PSIONIC, RULES.RESIST_TYPE_BASE_VALUE.PSIONIC));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.UNKNOWN, RULES.RESIST_TYPE_BASE_VALUE.UNKNOWN));

  return resistances;
}

export class AttackResistance {
  constructor(resistance_type, resistance_value) {
    this.resistance_type = resistance_type;
    this.resistance_value = resistance_value;
  }

  adjust_damage_for_type(damage_amount) {
    return damage_amount - this.resistance_value;
  }
}
