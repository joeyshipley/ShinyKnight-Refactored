export class Armor {
  constructor() {
    this.title = 'No Armor';
    this.defense_value = 0;
  }

  protect_from_attack(armor_penetration, damage_amount) {
    const adjusted_defense_value = this.defense_value - armor_penetration;
    // TODO: fix when AP is much larger than DEF?
    return damage_amount - adjusted_defense_value;
  }
}
