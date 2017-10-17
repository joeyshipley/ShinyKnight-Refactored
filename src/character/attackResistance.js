export class AttackResistance {
  constructor(resistance_type, resistance_value) {
    this.resistance_type = resistance_type;
    this.resistance_value = resistance_value;
  }

  adjust_damage_for_type(damage_amount) {
    return damage_amount - this.resistance_value;
  }
}
