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

  determine_damage_amount_and_apply_damage_from_attack_whether_suprise_or_not_and_possibly_counter_attack(
    type_of_damage, // NOTE: magic string value
    damage_amount,
    armor_penetration,
    is_surprise_attack //, // NOTE: boolean value
    // attacking_character // NOTE: not currently used
  ) {
    // TODO: Explore if there is temporal coupling with these internals?

    if(is_surprise_attack) {
      // NOTE: this feels like it belongs to the attacker, not the defender
      damage_amount = this._adjust_surprise_attack_multipler(damage_amount);
    }
    if(this._has_evaded(is_surprise_attack)) {
      damage_amount = this._adjust_evade_multiplier(damage_amount);
    }
    damage_amount = this._adjust_damage_type_resitances(type_of_damage, damage_amount);
    if(!is_surprise_attack) {
      damage_amount = this._adjust_armor_resitances(armor_penetration, damage_amount);
    }
    damage_amount = this._adjust_appropriate_damage_range(damage_amount);

    this._apply_damage_to_character(damage_amount);

    this._UNUSED_check_perform_counter_attack();

    return this._format_response(damage_amount);
  }

  _apply_damage_to_character(final_damage_amount) {
    this.c_hp -= final_damage_amount;
  }

  _has_evaded(is_surprise_attack) {
    return !is_surprise_attack
      && MATH.evade_chance() > ( RULES.CHECK.BASE_EVADE - this.c_evade );
  }

  _adjust_evade_multiplier(damage_amount) {
    // TODO: move this note into backlog and out of codebase
    // NOTE: consider redesigning this feature, the original value was way to strong, temp reducing the divider
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

  _UNUSED_check_perform_counter_attack() {
    // NOTE: this is becoming to painful, removing until we figure out
    // how to handle all the different combos for the counter attack
    // if this.c_hp > 0 && !srpe_att && (rand(100) + 1 < this.c_counter)
    //   if(this.c_class == RULES.CHARACTER_CLASS.KNIGHT && this.weapon == 'Short Sword') {
    //     char_att.dmg('physical', rand(10) + 2, 0, false)
    //   }
    //   if(this.c_class == RULES.CHARACTER_CLASS.KNIGHT && this.weapon == 'Longsword') {
    //     char_att.dmg('physical', rand(20) + 2, 0, false)
    //   }
    //   if(this.c_class == RULES.CHARACTER_CLASS.KNIGHT && this.weapon == 'Battle Axe') {
    //     char_att.dmg('physical', rand(11) + 10, 0, false)
    //   }
    //   if(this.c_class == RULES.CHARACTER_CLASS.WIZARD && this.weapon == 'Fireball') {
    //     char_att.dmg('fire', rand(10) + 6, 0, false)
    //   }
    //   if(this.c_class == RULES.CHARACTER_CLASS.WIZARD && this.weapon == 'Ice Spikes') {
    //     char_att.dmg('ice', rand(10) + 6, 0, false)
    //   }
    //   if(this.c_class == RULES.CHARACTER_CLASS.WIZARD && this.weapon == 'Crushing Grasp') {
    //     char_att.dmg('magic', rand(10) + 6, 0, false)
    //   }
    //   if(this.c_class == RULES.CHARACTER_CLASS.SHINOBI && this.weapon == 'Tanto') {
    //     char_att.dmg('magic', rand(6) + 6, 6, false)
    //   }
    //   if(this.c_class == RULES.CHARACTER_CLASS.SHINOBI && this.weapon == 'Ninjato') {
    //     char_att.dmg('magic', rand(12) + 6, 3, false)
    //   }
    // }
  }

  _format_response(damage_amount) {
    if(damage_amount == RULES.CHECK.NO_DAMAGE) {
      return 'You suffered no damage from the attack, way to go!';
    } else if(this.c_hp <= RULES.CHECK.MIN_HEALTH) {
      if(this.c_lvl > RULES.CHECK.MIN_LEVEL) { this.c_lvl -= 1 }
      this.c_hp = 20;
      return `You ${ this.c_name } have perished. You respawn back at town square but have suffered loss in level. You are now level ${ this.c_lvl }`;
    } else {
      return `You have suffered ${ damage_amount } wounds and now have ${ this.c_hp } health left`;
    }
  }
}
