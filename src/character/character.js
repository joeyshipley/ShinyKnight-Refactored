import { MATH } from '../util/math.utils.js';
import { CHECK } from '../util/check.utils.js';
import { RULES } from '../gameRules.constants';

export class Character {

  constructor( name, character_class, level, hp, evade_chance, type_resistances, armor ) {
    this.c_class = character_class
    this.c_name = name;
    this.c_lvl = level;
    this.c_hp = hp;
    this.c_evade = evade_chance;
    this.armor = armor;
    this.type_resistances = type_resistances;
  }

  generate_attack(type_of_damage, damage_amount, armor_penatration, is_surprise_attack) {
    // NOTE: Out of scope of exercise. Quick/Inline code for this.
    if(is_surprise_attack) {
      damage_amount = damage_amount * RULES.MODIFIER.SURPRISE_DAMAGE;
    }
    return {
      type_of_damage: type_of_damage,
      armor_penatration: armor_penatration,
      damage_amount: damage_amount
    }
  }

  defend_against_attack(type_of_damage, damage_amount, armor_penetration) {
    if(CHECK.has_evaded(this.c_evade)) {
      damage_amount = this._adjust_evade_multiplier(damage_amount);
    }
    damage_amount = this._adjust_armor_resitances(armor_penetration, damage_amount);

    return this._process_defense(type_of_damage, damage_amount);
  }

  defend_against_surprise_attack(type_of_damage, damage_amount) {
    return this._process_defense(type_of_damage, damage_amount);
  }

  _process_defense(type_of_damage, damage_amount) {
    damage_amount = this._adjust_damage_type_resitances(type_of_damage, damage_amount);
    const final_damage_amount = this._adjust_appropriate_damage_range(damage_amount);
    this._apply_damage_to_character(final_damage_amount);
    const action_result = this._process_result(final_damage_amount);

    return this._format_response(action_result, final_damage_amount);
  }

  _apply_damage_to_character(damage_amount) {
    this.c_hp -= damage_amount;
  }

  _adjust_evade_multiplier(damage_amount) {
    return damage_amount / RULES.MODIFIER.EVADE_REDUCTION;
  }

  _adjust_damage_type_resitances(type_of_damage, damage_amount) {
    const resistance = this.type_resistances.find((r) => { return r.resistance_type == type_of_damage });
    return (resistance) ? resistance.adjust_damage_for_type(damage_amount) : damage_amount;
  }

  _adjust_armor_resitances(armor_penetration, damage_amount) {
    if(!this.armor) { return damage_amount; }

    return this.armor.protect_from_attack(armor_penetration, damage_amount);
  }

  _adjust_appropriate_damage_range(damage_amount) {
    return (damage_amount < RULES.CHECK.MIN_HEALTH)
      ? RULES.CHECK.MIN_HEALTH
      : Math.floor(damage_amount);
  }

  _determine_action_result(final_damage_amount) {
    if(final_damage_amount == RULES.CHECK.NO_DAMAGE) {
      return RULES.DEFENSE_RESULT.NO_DAMAGE;
    } else if(CHECK.is_defeated(this)) {
      return RULES.DEFENSE_RESULT.CHARACTER_DEFEATED;
    } else {
      return RULES.DEFENSE_RESULT.DAMAGE_TAKEN;
    }
  }

  _process_result(final_damage_amount) {
    const action_result = this._determine_action_result(final_damage_amount);

    if(CHECK.is_defeated(this)) {
      if(this.c_lvl > RULES.CHECK.MIN_LEVEL) { this.c_lvl -= 1 }
      this.c_hp = 20;
    }

    return action_result;
  }

  _format_response(action_result, final_damage_amount) {
    switch(action_result) {
      case RULES.DEFENSE_RESULT.NO_DAMAGE:
        return 'You suffered no damage from the attack, way to go!';
      case RULES.DEFENSE_RESULT.DAMAGE_TAKEN:
        return `You have suffered ${ final_damage_amount } wounds and now have ${ this.c_hp } health left`;
      case RULES.DEFENSE_RESULT.CHARACTER_DEFEATED:
        return `You ${ this.c_name } have perished. You respawn back at town square but have suffered loss in level. You are now level ${ this.c_lvl }`;
    }
  }
}
