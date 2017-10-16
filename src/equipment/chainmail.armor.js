import { Armor } from './armor';

export class ChainMailArmor extends Armor {
  constructor() {
    super();

    this.title = 'Chain Mail';
    this.defense_value = 6;
  }
}
