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
    is_surprise_attack, // NOTE: boolean value
    attacking_character // NOTE: not currently used
  ) {
    // NOTE: temp binding to reduce impact of refactor
    var d = damage_amount;
    var d_type = type_of_damage;
    var ap = armor_penetration;
    var srpe_att = is_surprise_attack;
    var char_att = attacking_character;

    // surprise attacks do more damage
    if(srpe_att) {
      d = d * RULES.MODIFIER.SURPRISE_DAMAGE;
    }

    // when you see it coming, there is a chance that you get to evade part of the damage
    if(!srpe_att && (MATH.evade_chance() > RULES.CHECK.BASE_EVADE - this.c_evade)) {
      d = d / RULES.MODIFIER.EVADE_REDUCTION; // consider redesigning this feature, the original value was way to strong, temp reducing the divider
    }

    // modify damage based on your resistances to the different types
    switch(d_type) {
      case RULES.DAMAGE_TYPE.STANDARD:
        d -= this.c_class == RULES.CHARACTER_CLASS.KNIGHT ? 10 : RULES.RESIST_TYPE_BASE_VALUE.STANDARD; // Warriors get a special resistance to standard damage
        break;
      case RULES.DAMAGE_TYPE.MAGIC:
        d -= this.c_class == RULES.CHARACTER_CLASS.WIZARD ? 10 : RULES.RESIST_TYPE_BASE_VALUE.MAGIC; // Magi get a special resistance to magic damage
        break;
      case RULES.DAMAGE_TYPE.EARTH:
        d -= RULES.RESIST_TYPE_BASE_VALUE.EARTH;
        break;
      case RULES.DAMAGE_TYPE.FIRE:
        d -= RULES.RESIST_TYPE_BASE_VALUE.FIRE;
        break;
      case RULES.DAMAGE_TYPE.WATER:
        d -= RULES.RESIST_TYPE_BASE_VALUE.WATER;
        break;
      case RULES.DAMAGE_TYPE.WIND:
        d -= RULES.RESIST_TYPE_BASE_VALUE.WIND;
        break;
      case RULES.DAMAGE_TYPE.SHADOW:
        d -= this.c_class == RULES.CHARACTER_CLASS.SHINOBI ? 10 : RULES.RESIST_TYPE_BASE_VALUE.SHADOW; // Rogue get a special resistance to shadow damage
        break;
      case RULES.DAMAGE_TYPE.ICE:
        d -= RULES.RESIST_TYPE_BASE_VALUE.ICE;
        break;
      case RULES.DAMAGE_TYPE.LIGHTNING:
        d -= RULES.RESIST_TYPE_BASE_VALUE.LIGHTNING;
        break;
      case RULES.DAMAGE_TYPE.DARK:
        d -= RULES.RESIST_TYPE_BASE_VALUE.DARK;
        break;
      case RULES.DAMAGE_TYPE.LIGHT:
        d -= RULES.RESIST_TYPE_BASE_VALUE.LIGHT;
        break;
      case RULES.DAMAGE_TYPE.PSIONIC:
        d -= RULES.RESIST_TYPE_BASE_VALUE.PSIONIC;
        break;
      default:
        d -= RULES.RESIST_TYPE_BASE_VALUE.UNKNOWN;
        break;
    }

    // modify damage based on armor worn
    if(this.armor == RULES.ARMOR.LEATHER) {
      if(!srpe_att) { // characters don't get to use armor values when surprise attacked
        d -= (RULES.ARMOR.LEATHER_DEFENSE - ap);
      }
    } else if(this.armor == RULES.ARMOR.CHAIN_MAIL) {
      if(!srpe_att) { // characters don't get to use armor values when surprise attacked
        d -= (RULES.ARMOR.CHAIN_MAIL_DEFENSE - ap);
      }
    } else if(this.armor == RULES.ARMOR.FULL_PLATE) {
      if(!srpe_att) { // characters don't get to use armor values when surprise attacked
        d -= (RULES.ARMOR.FULL_PLATE_DEFENSE - ap);
      }
    }

    // make sure we don't give them hp when they block it
    if(d < RULES.CHECK.MIN_HEALTH) {
      d = RULES.CHECK.MIN_HEALTH;
    }

    d = Math.floor(d);

    // apply the damage
    this.c_hp = this.c_hp - d;

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

    // display results
    if(d == RULES.CHECK.NO_DAMAGE) {
      return 'You suffered no damage from the attack, way to go!';
    } else if(this.c_hp <= RULES.CHECK.MIN_HEALTH) {
      if(this.c_lvl > RULES.CHECK.MIN_LEVEL) { this.c_lvl -= 1 }
      this.c_hp = 20;
      return `You ${ this.c_name } have perished. You respawn back at town square but have suffered loss in level. You are now level ${ this.c_lvl }`;
    } else {
      return `You have suffered ${ d } wounds and now have ${ this.c_hp } health left`;
    }
  }
}
