import { MATH } from './util/math.utils.js';
import { RULES } from './gameRules.constants';

export class ShinyKnight {

  constructor() {
    this.c_name = 'Sir Joseph';
    this.c_class = RULES.CHARACTER_CLASS.KNIGHT;
    this.c_lvl = 2;
    this.c_hp = 20;
    this.c_evade = 5 // 5% chance to reduce damage after resistances/def are calculated by 1/2;
    this.c_counter = 2 // 2% chance to counter an attack;
    this.armor = RULES.ARMOR.LEATHER;
    this.weapon = RULES.WEAPON.LONGSWORD;
  }

  generate_attack(type_of_damage, damage_amount, armor_penatration, is_surprise_attack) {
    // NOTE: out of scope of exercise. Would not pass in surprise if it were real code.
    if(is_surprise_attack) {
      damage_amount = this._adjust_surprise_attack_multipler(damage_amount);
    }
    return {
      type_of_damage: type_of_damage,
      armor_penatration: armor_penatration,
      damage_amount: damage_amount
    }
  }

  defend_against_attack(type_of_damage, damage_amount, armor_penetration) {
    damage_amount = this._adjust_armor_resitances(armor_penetration, damage_amount);
    if(this._has_evaded()) {
      damage_amount = this._adjust_evade_multiplier(damage_amount);
    }
    return this._process_defense(type_of_damage, damage_amount);
  }

  defend_against_surprise_attack(type_of_damage, damage_amount) {
    return this._process_defense(type_of_damage, damage_amount);
  }

  _process_defense(type_of_damage, damage_amount) {
    damage_amount = this._adjust_damage_type_resitances(type_of_damage, damage_amount);
    this._apply_damage_to_character(damage_amount);
    return this._format_response(damage_amount);
  }

  _apply_damage_to_character(damage_amount) {
    const final_damage_amount = this._adjust_appropriate_damage_range(damage_amount);
    this.c_hp -= final_damage_amount;
  }

  _has_evaded() {
    return MATH.evade_chance() > ( RULES.CHECK.BASE_EVADE - this.c_evade );
  }

  _adjust_evade_multiplier(damage_amount) {
    return damage_amount / RULES.MODIFIER.EVADE_REDUCTION;
  }

  _adjust_surprise_attack_multipler(damage_amount) {
    return damage_amount * RULES.MODIFIER.SURPRISE_DAMAGE;
  }

  _adjust_damage_type_resitances(type_of_damage, damage_amount) {
    switch(type_of_damage) {
      case RULES.DAMAGE_TYPE.STANDARD:
        return this.c_class == RULES.CHARACTER_CLASS.KNIGHT ? damage_amount - 10 : damage_amount - RULES.RESIST_TYPE_BASE_VALUE.STANDARD; // Warriors get a special resistance to standard damage
      case RULES.DAMAGE_TYPE.MAGIC:
        return this.c_class == RULES.CHARACTER_CLASS.WIZARD ? damage_amount - 10 : damage_amount - RULES.RESIST_TYPE_BASE_VALUE.MAGIC; // Magi get a special resistance to magic damage
      case RULES.DAMAGE_TYPE.EARTH:
        return damage_amount - RULES.RESIST_TYPE_BASE_VALUE.EARTH;
      case RULES.DAMAGE_TYPE.FIRE:
        return damage_amount - RULES.RESIST_TYPE_BASE_VALUE.FIRE;
      case RULES.DAMAGE_TYPE.WATER:
        return damage_amount - RULES.RESIST_TYPE_BASE_VALUE.WATER;
      case RULES.DAMAGE_TYPE.WIND:
        return damage_amount - RULES.RESIST_TYPE_BASE_VALUE.WIND;
      case RULES.DAMAGE_TYPE.SHADOW:
        return this.c_class == RULES.CHARACTER_CLASS.SHINOBI ? damage_amount - 10 : damage_amount - RULES.RESIST_TYPE_BASE_VALUE.SHADOW; // Rogue get a special resistance to shadow damage
      case RULES.DAMAGE_TYPE.ICE:
        return damage_amount - RULES.RESIST_TYPE_BASE_VALUE.ICE;
      case RULES.DAMAGE_TYPE.LIGHTNING:
        return damage_amount - RULES.RESIST_TYPE_BASE_VALUE.LIGHTNING;
      case RULES.DAMAGE_TYPE.DARK:
        return damage_amount - RULES.RESIST_TYPE_BASE_VALUE.DARK;
      case RULES.DAMAGE_TYPE.LIGHT:
        return damage_amount - RULES.RESIST_TYPE_BASE_VALUE.LIGHT;
      case RULES.DAMAGE_TYPE.PSIONIC:
        return damage_amount - RULES.RESIST_TYPE_BASE_VALUE.PSIONIC;
      default:
        return damage_amount - RULES.RESIST_TYPE_BASE_VALUE.UNKNOWN;
    }
  }

  _adjust_armor_resitances(armor_penetration, damage_amount) {
    if(this.armor == RULES.ARMOR.LEATHER) {
      return damage_amount - (RULES.ARMOR.LEATHER_DEFENSE - armor_penetration);
    } else if(this.armor == RULES.ARMOR.CHAIN_MAIL) {
      return damage_amount - (RULES.ARMOR.CHAIN_MAIL_DEFENSE - armor_penetration);
    } else if(this.armor == RULES.ARMOR.FULL_PLATE) {
      return damage_amount - (RULES.ARMOR.FULL_PLATE_DEFENSE - armor_penetration);
    }
    return damage_amount;
  }

  _adjust_appropriate_damage_range(damage_amount) {
    return (damage_amount < RULES.CHECK.MIN_HEALTH) ? RULES.CHECK.MIN_HEALTH : Math.floor(damage_amount);
  }

  _format_response(damage_amount) {
    const final_damage_amount = this._adjust_appropriate_damage_range(damage_amount);
    if(final_damage_amount == RULES.CHECK.NO_DAMAGE) {
      return 'You suffered no damage from the attack, way to go!';
    } else if(this.c_hp <= RULES.CHECK.MIN_HEALTH) {
      if(this.c_lvl > RULES.CHECK.MIN_LEVEL) { this.c_lvl -= 1 }
      this.c_hp = 20;
      return `You ${ this.c_name } have perished. You respawn back at town square but have suffered loss in level. You are now level ${ this.c_lvl }`;
    } else {
      return `You have suffered ${ final_damage_amount } wounds and now have ${ this.c_hp } health left`;
    }
  }
}
