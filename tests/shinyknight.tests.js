import 'babel-polyfill';
import sinon from 'sinon';
import { expect } from 'chai';

import { MATH } from '../src/util/math.utils';
import { RULES } from '../src/gameRules.constants';
import { Knight } from '../src/character/knight.character.js';
import { Wizard } from '../src/character/wizard.character.js';
import { Shinobi } from '../src/character/shinobi.character.js';
import { ChainMailArmor } from '../src/equipment/chainmail.armor';
import { FullPlateArmor } from '../src/equipment/fullplate.armor';
import { LeatherArmor } from '../src/equipment/leather.armor';

let CUT, OPPONENT;
let roll_100;

beforeEach(() => {
  CUT = new Knight(null);
  roll_100 = sinon.stub(MATH, "roll_100");
  roll_100.callsFake(() => { return 1; });

  OPPONENT = new Knight();
});

afterEach(() => {
  roll_100.restore();
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Young Squire is concerned about how much damage they take', () => {

    describe('and they received a weak attack,', () => {
      it('it does not apply damage', () => {
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 0, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });
    });

    describe('and they received an overpowering attack,', () => {
      it('it defeats the ShinyKnight', () => {
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 100, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You Sir Joseph have perished. You respawn back at town square but have suffered loss in level. You are now level 1');
      });

      it('it reduces the character level by 1', () => {
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 100, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(CUT.c_lvl).to.equal(1);
      });

      it('it resets the hit points to 20', () => {
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 100, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(CUT.c_hp).to.equal(20);
      });

      it('it does not allow the characters level to go below 1', () => {
        CUT.c_lvl = 1;
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 100, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(CUT.c_lvl).to.equal(1);
      });
    });

  });
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Wise Defender is concerned about armor', () => {

    describe('and they are not wearing armor,', () => {
      it('it applies damage without armor reduction', () => {
        CUT.armor = null;
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 8, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 8 wounds and now have 12 health left');
      });

      it('it does not take armor penetration into account', () => {
        CUT.armor = new LeatherArmor();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 8, 2, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 8 wounds and now have 12 health left');
      });
    });

    describe('and they are wearing armor and armor penetration is above the defense value,', () => {
      it('it does not decrease damage past armor value', () => {
        CUT.armor = new LeatherArmor();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 8, 999, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 8 wounds and now have 12 health left');
      });
    });

    describe('and they are wearing leather armor,', () => {
      it('it applies reduced damage', () => {
        CUT.armor = new LeatherArmor();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 15, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 13 wounds and now have 7 health left');
      });

      it('it does not protect when surprised', () => {
        CUT.armor = new LeatherArmor();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 10, null, true);
        const result = CUT.defend_against_surprise_attack(attack.type_of_damage, attack.damage_amount);
        expect(result).to.equal('You have suffered 15 wounds and now have 5 health left');
      });

      it('it\'s effectiveness is reduced from armor penetration', () => {
        CUT.armor = new LeatherArmor();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 15, 2, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 15 wounds and now have 5 health left');
      });
    });

    describe('and they are wearing chain mail,', () => {
      it('it applies reduced damage', () => {
        CUT.armor = new ChainMailArmor();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 15, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 9 wounds and now have 11 health left');
      });

      it('it does not protect when surprised', () => {
        CUT.armor = new ChainMailArmor();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 10, null, true);
        const result = CUT.defend_against_surprise_attack(attack.type_of_damage, attack.damage_amount);
        expect(result).to.equal('You have suffered 15 wounds and now have 5 health left');
      });

      it('it\'s effectiveness is reduced from armor penetration', () => {
        CUT.armor = new ChainMailArmor();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 15, 2, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 11 wounds and now have 9 health left');
      });
    });

    describe('and they are wearing full plate,', () => {
      it('it applies reduced damage', () => {
        CUT.armor = new FullPlateArmor();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 15, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 3 wounds and now have 17 health left');
      });

      it('it does not protect when surprised', () => {
        CUT.armor = new FullPlateArmor();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 10, null, true);
        const result = CUT.defend_against_surprise_attack(attack.type_of_damage, attack.damage_amount);
        expect(result).to.equal('You have suffered 15 wounds and now have 5 health left');
      });

      it('it\'s effectiveness is reduced from armor penetration', () => {
        CUT.armor = new FullPlateArmor();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 15, 2, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 5 wounds and now have 15 health left');
      });
    });

  });
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Perceptive Sentry is concerned about surprise attacks', () => {

    describe('and they were surprised by the attack,', () => {
      it('it applies damage extra damage', () => {
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 8, null, true);
        const result = CUT.defend_against_surprise_attack(attack.type_of_damage, attack.damage_amount);
        expect(result).to.equal('You have suffered 12 wounds and now have 8 health left');
      });
    });

    describe('and they were not surprised by the attack,', () => {
      it('it does not increase the damage', () => {
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 8, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 8 wounds and now have 12 health left');
      });
    });

  });
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Versatile Champion is concerned about the type of an attack', () => {

    describe('and they are a Knights receiving an attack,', () => {
      it('it\'s standard attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('standard', 11, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 1 wounds and now have 19 health left');
      });

      it('it\'s magic attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('magic', 11, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 10 wounds and now have 10 health left');
      });

      it('it\'s shadow attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('shadow', 11, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 10 wounds and now have 10 health left');
      });

      it('it\'s earth attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('earth', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s fire attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('fire', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s water attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('water', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s wind attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('wind', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s ice attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('ice', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s lightning attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('lightning', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s dark attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('dark', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s light attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('light', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s psionic attack reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack('psionic', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('unspecified attack does not reduced damage', () => {
        CUT = new Knight();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 1 wounds and now have 19 health left');
      });
    });

    describe('and they are a Wizard receiving an attack,', () => {
      it('it\'s standard attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('standard', 11, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 11 wounds and now have 9 health left');
      });

      it('it\'s magic attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('magic', 11, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 1 wounds and now have 19 health left');
      });

      it('it\'s shadow attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('shadow', 11, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 10 wounds and now have 10 health left');
      });

      it('it\'s earth attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('earth', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s fire attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('fire', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s water attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('water', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s wind attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('wind', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s ice attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('ice', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s lightning attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('lightning', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s dark attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('dark', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s light attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('light', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s psionic attack reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack('psionic', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('unspecified attack does not reduced damage', () => {
        CUT = new Wizard();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 1 wounds and now have 19 health left');
      });
    });

    describe('and they are a Shinobi receiving an attack,', () => {
      it('it\'s standard attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('standard', 11, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 11 wounds and now have 9 health left');
      });

      it('it\'s magic attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('magic', 11, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 10 wounds and now have 10 health left');
      });

      it('it\'s shadow attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('shadow', 11, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 1 wounds and now have 19 health left');
      });

      it('it\'s earth attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('earth', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s fire attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('fire', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s water attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('water', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s wind attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('wind', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s ice attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('ice', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s lightning attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('lightning', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s dark attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('dark', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s light attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('light', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('it\'s psionic attack reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack('psionic', 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });

      it('unspecified attack does not reduced damage', () => {
        CUT = new Shinobi();
        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 1, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 1 wounds and now have 19 health left');
      });
    });

  });
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Spry Hero is concerned about evading attacks', () => {

    describe('and they did not evade,', () => {
      it('it applies damage without evade reduction', () => {
        roll_100.callsFake(() => { return 1; });

        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 8, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 8 wounds and now have 12 health left');
      });
    });

    describe('and they evaded some of the attack,', () => {
      it('it applies reduced damage', () => {
        roll_100.callsFake(() => { return 100; });

        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 8, 0, false);
        const result = CUT.defend_against_attack(attack.type_of_damage, attack.damage_amount, attack.armor_penatration);
        expect(result).to.equal('You have suffered 6 wounds and now have 14 health left');
      });
    });

    describe('and they would have evaded but it was a surprise attack,', () => {
      it('it applies damage without evade reduction', () => {
        roll_100.callsFake(() => { return 100; });

        const attack = OPPONENT.generate_attack(RULES.DAMAGE_TYPE.UNKNOWN, 8, null, true);
        const result = CUT.defend_against_surprise_attack(attack.type_of_damage, attack.damage_amount);
        expect(result).to.equal('You have suffered 12 wounds and now have 8 health left');
      });
    });

  });
});
