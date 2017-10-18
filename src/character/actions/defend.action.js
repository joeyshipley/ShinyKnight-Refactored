import { MATH } from '../../util/math.utils.js';
import { CHECK } from '../../util/check.utils.js';
import { RULES } from '../../gameRules.constants';

export function defend_action(defender, type_of_damage, damage_amount, armor_penetration) {
  if(CHECK.has_evaded(defender.evade_chance)) {
    damage_amount = _adjust_evade_multiplier(damage_amount);
  }
  damage_amount = _adjust_armor_resitances(defender, armor_penetration, damage_amount);

  return _base_action(defender, type_of_damage, damage_amount);
}

export function defend_surprise_attack_action(defender, type_of_damage, damage_amount) {
  return _base_action(defender, type_of_damage, damage_amount);
}

function _base_action(defender, type_of_damage, damage_amount) {
  damage_amount = _adjust_damage_type_resitances(defender, type_of_damage, damage_amount);
  const final_damage_amount = Math.floor(damage_amount);
  const action_result = _process_action(defender, final_damage_amount);

  return _format_response(defender, action_result, final_damage_amount);
}

function _process_action(defender, final_damage_amount) {
  defender.apply_damage(final_damage_amount);
  const action_result = _determine_action_result(defender, final_damage_amount);

  if(CHECK.is_defeated(defender)) {
    defender.defeat_character();
  }

  return action_result;
}

function _determine_action_result(defender, final_damage_amount) {
  if(final_damage_amount == RULES.CHECK.NO_DAMAGE) {
    return RULES.DEFENSE_RESULT.NO_DAMAGE;
  } else if(CHECK.is_defeated(defender)) {
    return RULES.DEFENSE_RESULT.CHARACTER_DEFEATED;
  } else {
    return RULES.DEFENSE_RESULT.DAMAGE_TAKEN;
  }
}

function _format_response(defender, action_result, final_damage_amount) {
  switch(action_result) {
    case RULES.DEFENSE_RESULT.NO_DAMAGE:
      return 'You suffered no damage from the attack, way to go!';
    case RULES.DEFENSE_RESULT.DAMAGE_TAKEN:
      return `You have suffered ${ final_damage_amount } wounds and now have ${ defender.health_points } health left`;
    case RULES.DEFENSE_RESULT.CHARACTER_DEFEATED:
      return `You ${ defender.name } have perished. You respawn back at town square but have suffered loss in level. You are now level ${ defender.level }`;
  }
}

function _adjust_evade_multiplier(damage_amount) {
  return damage_amount / RULES.MODIFIER.EVADE_REDUCTION;
}

function _adjust_armor_resitances(defender, armor_penetration, damage_amount) {
  if(!defender.armor) { return damage_amount; }

  return defender.armor.protect_from_attack(armor_penetration, damage_amount);
}

function _adjust_damage_type_resitances(defender, type_of_damage, damage_amount) {
  const resistance = defender.type_resistances.find((r) => { return r.resistance_type == type_of_damage });
  return (resistance) ? resistance.adjust_damage_for_type(damage_amount) : damage_amount;
}
