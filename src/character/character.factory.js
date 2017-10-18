import { RULES } from '../gameRules.constants';
import { Knight } from './knight.character';
import { Wizard } from './wizard.character';
import { Shinobi } from './shinobi.character';
import { AttackResistance } from './attackResistance';

// NOTE: fake values for exercise, factory would handle this or have them passed in.
const name = 'Sir Joseph';
const level = 2;
const hp = 20;
const evade_chance = 5;

export function build_knight( armor ) {
  const resistances = build_resistances(RULES.CHARACTER_CLASS.KNIGHT);
  let character = new Knight(name, level, hp, evade_chance, resistances, armor);
  return character;
}

export function build_wizard( armor ) {
  const resistances = build_resistances(RULES.CHARACTER_CLASS.WIZARD);
  let character = new Wizard(name, level, hp, evade_chance, resistances, armor);
  return character;
}

export function build_shinobi( armor ) {
  const resistances = build_resistances(RULES.CHARACTER_CLASS.SHINOBI);
  let character = new Shinobi(name, level, hp, evade_chance, resistances, armor);
  return character;
}

function build_resistances(character_class) {
  let resistances = [];

  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.STANDARD, RULES.RESIST_TYPE_BASE_VALUE.STANDARD));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.MAGIC, RULES.RESIST_TYPE_BASE_VALUE.MAGIC));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.EARTH, RULES.RESIST_TYPE_BASE_VALUE.EARTH));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.FIRE, RULES.RESIST_TYPE_BASE_VALUE.FIRE));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.WATER, RULES.RESIST_TYPE_BASE_VALUE.WATER));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.WIND, RULES.RESIST_TYPE_BASE_VALUE.WIND));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.SHADOW, RULES.RESIST_TYPE_BASE_VALUE.SHADOW));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.ICE, RULES.RESIST_TYPE_BASE_VALUE.ICE));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.LIGHTNING, RULES.RESIST_TYPE_BASE_VALUE.LIGHTNING));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.DARK, RULES.RESIST_TYPE_BASE_VALUE.DARK));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.LIGHT, RULES.RESIST_TYPE_BASE_VALUE.LIGHT));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.PSIONIC, RULES.RESIST_TYPE_BASE_VALUE.PSIONIC));
  resistances.push(new AttackResistance(RULES.DAMAGE_TYPE.UNKNOWN, RULES.RESIST_TYPE_BASE_VALUE.UNKNOWN));

  return resistances;
}
