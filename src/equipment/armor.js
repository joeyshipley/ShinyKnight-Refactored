export class Armor {
  constructor() {
    this.title = 'No Armor';
    this.defense_value = 0;
  }

  protect_from_attack(armor_penetration, damage_amount) {
    let adjusted_defense_value = this.defense_value - armor_penetration;
    if(adjusted_defense_value < 0) { adjusted_defense_value = 0; }
    return damage_amount - adjusted_defense_value;
  }
}
