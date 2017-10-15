import 'babel-polyfill';
import sinon from 'sinon';
import { expect } from 'chai';
import { ShinyKnight } from '../src/shinyknight.js';
import { MATH } from '../src/util/math.utils';

let CUT, OPPONENT;
let evade_chance;

beforeEach(() => {
  CUT = new ShinyKnight();
  CUT.armor = null;
  OPPONENT = new ShinyKnight();
  evade_chance = sinon.stub(MATH, "evade_chance");
  evade_chance.callsFake(() => { return 1; });
});

afterEach(() => {
  evade_chance.restore();
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Young Squire is concerned about how much damage they take', () => {

    describe('and they recieved a weak attack,', () => {
      it('it does not apply damage', () => {
        const result = CUT.dmg('unknown', 0, 0, false, OPPONENT);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });
    });

    describe('and they recieved an overpowering attack,', () => {
      it('it defeats the ShinyKnight', () => {
        const result = CUT.dmg('unknown', 100, 0, false, OPPONENT);
        expect(result).to.equal('You Sir Joseph have perished. You respawn back at town square but have suffered loss in level. You are now level 1');
      });
    });

  });
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Wise Defender is concerned about armor', () => {

    describe('and they are not wearing armor,', () => {
      it('it applies damage without armor reduction', () => {
        CUT.armor = null;
        const result = CUT.dmg('unknown', 7, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 7 wounds and now have 13 health left');
      });
    });

    describe('and they are wearing leather armor,', () => {
      it('it applies reduced damage', () => {
        CUT.armor = 'Leather';
        const result = CUT.dmg('unknown', 7, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 5 wounds and now have 15 health left');
      });
    });

  });
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Perceptive Sentry is concerned about suprise attacks', () => {

    describe('and they were suprised by the attack,', () => {
      it('it applies damage extra damage', () => {
        const result = CUT.dmg('unknown', 7, 0, true, OPPONENT);
        expect(result).to.equal('You have suffered 10 wounds and now have 10 health left');
      });
    });

    describe('and they were not suprised by the attack,', () => {
      it('it does not increase the damage', () => {
        const result = CUT.dmg('unknown', 7, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 7 wounds and now have 13 health left');
      });
    });

  });
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Verstile Champion is concerned about the type of an attack', () => {

    describe('and they recieve a standard attack,', () => {
      it('it applies reduced damage', () => {
        const result = CUT.dmg('standard', 11, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 1 wounds and now have 19 health left');
      });
    });

    describe('and they recieves a magic attack,', () => {
      it('it applies reduced damage', () => {
        const result = CUT.dmg('magic', 11, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 10 wounds and now have 10 health left');
      });
    });

  });
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Sturdy Protector is concerned about the attacks with armor penatration', () => {
  });
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Spry Hero is concerned about evading attacks', () => {

    describe('and they did not evade,', () => {
      it('it applies damage without evade reduction', () => {
        evade_chance.callsFake(() => { return 1; });

        const result = CUT.dmg('unknown', 7, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 7 wounds and now have 13 health left');
      });
    });

    describe('and they evaded some of the attack,', () => {
      it('it applies reduced damage', () => {
        evade_chance.callsFake(() => { return 100; });

        const result = CUT.dmg('unknown', 7, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 5 wounds and now have 15 health left');
      });
    });

  });
});

describe('ShinyKnights Battle Foes', () => {
  describe('#dmg => When our Experienced Templar is concerned about what their profession is', () => {
  });
});
