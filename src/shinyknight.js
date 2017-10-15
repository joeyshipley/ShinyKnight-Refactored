import { MATH } from './util/math.utils.js';

export class ShinyKnight {

  constructor() {
    this.c_name = 'Sir Joseph';
    this.c_class = 'Knight';
    this.c_lvl = 2;
    this.c_hp = 20;
    this.c_evade = 5 // 5% chance to reduce damage after resistances/def are calculated by 1/2;
    this.c_counter = 2 // 2% chance to counter an attack;
    this.armor = 'Leather';
    this.weapon = 'Longsword';
  }

  // d_type = the type of damage
  // dmg = amount of damage attempting to deal
  // ap = how well it penetrates armor
  // srpe_att (bool) = was it a surprise attack?
  // char_att = the attacking character
  dmg( d_type, dmg, ap, srpe_att, char_att ) {
    var d = dmg

    // surprise attacks do more damage
    if(srpe_att) {
      d = d * 1.5
    }

    // when you see it coming, there is a chance that you get to evade part of the damage
    if(!srpe_att && (MATH.evade_chance() > 100 - this.c_evade)) {
      d = d / 1.25; // consider redesigning this feature, the original value was way to strong, temp reducing the divider
    }

    // modify damage based on your resistances to the different types
    switch(d_type) {
      case 'standard':
        d -= this.c_class == 'Knight' ? 10 : 0; // Warriors get a special resistance to standard damage
        break;
      case 'magic':
        d -= this.c_class == 'Wizard' ? 10 : 1; // Magi get a special resistance to magic damage
        break;
      case 'earth':
        d -= 1;
        break;
      case 'fire':
        d -= 1;
        break;
      case 'water':
        d -= 1;
        break;
      case 'wind':
        d -= 1;
        break;
      case 'shadow':
        d -= this.c_class == 'Shinobi' ? 10 : 1; // Rogue get a special resistance to shadow damage
        break;
      case 'ice':
        d -= 1;
        break;
      case 'lightning':
        d -= 1;
        break;
      case 'dark':
        d -= 1;
        break;
      case 'light':
        d -= 1;
        break;
      case 'psionic':
        d -= 1;
        break;
      default:
        d -= 0;
        break;
    }

    // modify damage based on armor worn
    if(this.armor == 'Leather') {
      if(!srpe_att) { // characters don't get to use armor values when surprise attacked
        d -= (2 - ap);
      }
    } else if(this.armor == 'Chain mail') {
      if(!srpe_att) { // characters don't get to use armor values when surprise attacked
        d -= (6 - ap);
      }
    } else if(this.armor == 'Full Plate') {
      if(srpe_att) { // characters don't get to use armor values when surprise attacked
        d -= (12 - ap);
      }
    }

    // make sure we don't give them hp when they block it
    if(d < 0) {
      d = 0;
    }

    d = Math.floor(d);

    // apply the damage
    this.c_hp = this.c_hp - d;

    // NOTE: this is becoming to painful, removing until we figure out
    // how to handle all the different combos for the counter attack
    // if this.c_hp > 0 && !srpe_att && (rand(100) + 1 < this.c_counter)
    //   if(this.c_class == 'Knight' && this.weapon == 'Short Sword') {
    //     char_att.dmg('physical', rand(10) + 2, 0, false)
    //   }
    //   if(this.c_class == 'Knight' && this.weapon == 'Longsword') {
    //     char_att.dmg('physical', rand(20) + 2, 0, false)
    //   }
    //   if(this.c_class == 'Knight' && this.weapon == 'Battle Axe') {
    //     char_att.dmg('physical', rand(11) + 10, 0, false)
    //   }
    //   if(this.c_class == 'Wizard' && this.weapon == 'Fireball') {
    //     char_att.dmg('fire', rand(10) + 6, 0, false)
    //   }
    //   if(this.c_class == 'Wizard' && this.weapon == 'Ice Spikes') {
    //     char_att.dmg('ice', rand(10) + 6, 0, false)
    //   }
    //   if(this.c_class == 'Wizard' && this.weapon == 'Crushing Grasp') {
    //     char_att.dmg('magic', rand(10) + 6, 0, false)
    //   }
    //   if(this.c_class == 'Shinobi' && this.weapon == 'Tanto') {
    //     char_att.dmg('magic', rand(6) + 6, 6, false)
    //   }
    //   if(this.c_class == 'Shinobi' && this.weapon == 'Ninjato') {
    //     char_att.dmg('magic', rand(12) + 6, 3, false)
    //   }
    // }

    // display results
    if(d == 0) {
      return 'You suffered no damage from the attack, way to go!';
    } else if(this.c_hp <= 0) {
      this.c_lvl -= 1
      return `You ${ this.c_name } have perished. You respawn back at town square but have suffered loss in level. You are now level ${ this.c_lvl }`;
    } else {
      return `You have suffered ${ d } wounds and now have ${ this.c_hp } health left`;
    }
  }
}
