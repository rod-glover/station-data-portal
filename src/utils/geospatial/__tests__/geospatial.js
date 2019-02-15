import {
  // add, acc, acc2,
  isLeft, isPointInPolygonWn
} from '../geospatial';


// Helpers

const Point = (x, y) => ({ x, y });
const getX = p => p.x;
const getY = p => p.y;

// Tests

describe('isLeft', () => {
  // Bind coordinate accessors for point objects.
  const isLeftXY = isLeft(getX, getY);

  const p0 = Point(0, 0);
  const p1 = Point(1, 1);

  describe('with upward line', () => {
    describe('with point to left of line', () => {
      it('works', () => {
        expect(isLeftXY(p0, p1, Point(-1, 1))).toBeGreaterThan(0);
      });
    });
    describe('with point to right of line', () => {
      it('works', () => {
        expect(isLeftXY(p0, p1, Point(2, 1))).toBeLessThan(0);
      });
    });
    describe('with point on line', () => {
      it('works', () => {
        expect(isLeftXY(p0, p1, Point(0.5, 0.5))).toEqual(0);
      });
    });
  });

  describe('with downward line', () => {
    describe('with point to left of line', () => {
      it('works', () => {
        expect(isLeftXY(p1, p0, Point(-1, 1))).toBeLessThan(0);
      });
    });
    describe('with point to right of line', () => {
      it('works', () => {
        expect(isLeftXY(p1, p0, Point(2, 1))).toBeGreaterThan(0);
      });
    });
    describe('with point on line', () => {
      it('works', () => {
        expect(isLeftXY(p1, p0, Point(0.5, 0.5))).toEqual(0);
      });
    });
  });
});


describe('isPointInPolygonWn', () => {
  // Bind coordinate accessors for point objects.
  const isPointInPolygonWnXY = isPointInPolygonWn(getX, getY);

  describe('for a triangle', () => {
    const triangle = [
      Point(0, 0),
      Point(2, 0),
      Point(1, 1),
      Point(0, 0),
    ];

    describe('for point inside triangle', () => {
      it('works', () => {
        expect(isPointInPolygonWnXY(triangle, Point(1, 0.5))).not.toEqual(0);
      });
    });
    describe('for point outside triangle', () => {
      it('works', () => {
        expect(isPointInPolygonWnXY(triangle, Point(2, 2))).toEqual(0);
      });
    });
  });
});



// const add1 = add(1);
// const accX = acc(o => o.x);
// const acc2XY = acc2(o => o.x, o => o.y);
// describe('accX', () => {
//   it('works', () => {
//     const obj = { x: 3 };
//     expect(accX(obj)).toBe(3);
//   });
// });
//
// describe('acc2XY', () => {
//   it('works', () => {
//     const obj = { x: 4, y: 5 };
//     expect(acc2XY(obj)).toBe(9);
//   });
// });
