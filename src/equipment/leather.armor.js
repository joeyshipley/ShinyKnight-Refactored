import { Armor } from './armor';

export class LeatherArmor extends Armor {
  constructor() {
    super();

    this.title = 'Leather';
    this.defense_value = 2;
  }
}
