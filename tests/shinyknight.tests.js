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
  describe('#dmg => When dealing damage to a ShinyKnight', () => {

    describe('and our mighty templar recieved a weak attack,', () => {
      it('it does not apply damage', () => {
        const result = CUT.dmg('unknown', 0, 0, false, OPPONENT);
        expect(result).to.equal('You suffered no damage from the attack, way to go!');
      });
    });

    describe('and our young squire recieved an overpowering attack,', () => {
      it('it defeats the ShinyKnight', () => {
        const result = CUT.dmg('unknown', 100, 0, false, OPPONENT);
        expect(result).to.equal('You Sir Joseph have perished. You respawn back at town square but have suffered loss in level. You are now level 1');
      });
    });

    describe('and our epic captain recieves a standard attack,', () => {
      it('it applies reduced damage', () => {
        const result = CUT.dmg('standard', 11, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 1 wounds and now have 19 health left');
      });
    });

    describe('and our mystic guardian recieves a magic attack,', () => {
      it('it applies reduced damage', () => {
        const result = CUT.dmg('magic', 11, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 10 wounds and now have 10 health left');
      });
    });

    describe('and our friendly warrior was not wearing armor,', () => {
      it('it applies damage without armor reduction', () => {
        CUT.armor = null;
        const result = CUT.dmg('unknown', 7, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 7 wounds and now have 13 health left');
      });
    });

    describe('and our wise defender was wearing leather armor,', () => {
      it('it applies reduced damage', () => {
        CUT.armor = 'Leather';
        const result = CUT.dmg('unknown', 7, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 5 wounds and now have 15 health left');
      });
    });

    describe('and our bright champion did not evade,', () => {
      it('it applies damage without evade reduction', () => {
        evade_chance.callsFake(() => { return 1; });

        const result = CUT.dmg('unknown', 7, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 7 wounds and now have 13 health left');
      });
    });

    describe('and our peerless hero evaded some of the attack,', () => {
      it('it applies reduced damage', () => {
        evade_chance.callsFake(() => { return 100; });

        const result = CUT.dmg('unknown', 7, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 5 wounds and now have 15 health left');
      });
    });

    describe('and our stalwart protector was suprised by the attack,', () => {
      it('it applies damage extra damage', () => {
        const result = CUT.dmg('unknown', 7, 0, true, OPPONENT);
        expect(result).to.equal('You have suffered 10 wounds and now have 10 health left');
      });
    });

    describe('and our perceptive sentry was not suprised by the attack,', () => {
      it('it does not increase the damage', () => {
        const result = CUT.dmg('unknown', 7, 0, false, OPPONENT);
        expect(result).to.equal('You have suffered 7 wounds and now have 13 health left');
      });
    });

  });
});
