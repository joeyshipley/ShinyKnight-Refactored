import { Armor } from './armor';

export class FullPlateArmor extends Armor {
  constructor() {
    super();

    this.title = 'Full Plate';
    this.defense_value = 12;
  }
}
