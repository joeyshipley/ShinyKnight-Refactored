import { RULES } from '../gameRules.constants';
import { defend_action, defend_surprise_attack_action } from './actions/defend.action';

export class Character {

  constructor( name, level, hp, evade_chance, type_resistances, armor ) {
    this.name = name;
    this.level = level;
    this.health_points = hp;
    this.base_health_points = hp;
    this.evade_chance = evade_chance;
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
    return defend_action(this, type_of_damage, damage_amount, armor_penetration);
  }

  defend_against_surprise_attack(type_of_damage, damage_amount) {
    return defend_surprise_attack_action(this, type_of_damage, damage_amount);
  }

  apply_damage(damage_amount) {
    this.health_points -= damage_amount;
    if(this.health_points < RULES.CHECK.MIN_HEALTH) { this.health_points = RULES.CHECK.MIN_HEALTH; }
  }

  defeat_character() {
    if(this.level > RULES.CHECK.MIN_LEVEL) { this.level -= 1 }
    this.health_points = this.base_health_points;
  }
}
