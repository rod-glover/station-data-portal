import { curry, concat, isEqual } from 'lodash/fp';

// Geospatial tools
//
// Adapted from http://geomalgorithms.com/
// Copyright 2000 softSurfer, 2012 Dan Sunday
//
// Comments are copied from geomalgorithms code.


// isLeft(): tests if a point is Left|On|Right of an infinite line.
//    Input:  three points P0, P1, and P2
//    Return: >0 for P2 left of the line through P0 and P1
//            =0 for P2  on the line
//            <0 for P2  right of the line
//    See: Algorithm 1 "Area of Triangles and Polygons"
//
// Testing has revealed that this desccription is incomplete:
// The description is correct for an upward line, but signs are reversed
// for a downward line.

/* Original code in C++

inline int
isLeft( Point P0, Point P1, Point P2 )
{
    return ( (P1.x - P0.x) * (P2.y - P0.y)
            - (P2.x -  P0.x) * (P1.y - P0.y) );
}
*/

export const isLeft = curry(
  (
    getX, getY,   // Point coordinate accessor functions
    P0,           // Origin point for line
    P1,           // Terminus point for line
    P2            // Point to be tested
  ) => {
    return ( (getX(P1) - getX(P0)) * (getY(P2) - getY(P0))
      - (getX(P2) -  getX(P0)) * (getY(P1) - getY(P0)) );
  }
);
/*


// wn_PnPoly(): winding number test for a point in a polygon
//      Input:   P = a point,
//               V[] = vertex points of a polygon V[n+1] with V[n]=V[0]
//      Return:  wn = the winding number (=0 only when P is outside)
int
wn_PnPoly( Point P, Point* V, int n )
{
    int    wn = 0;    // the  winding number counter

    // loop through all edges of the polygon
    for (int i=0; i<n; i++) {   // edge from V[i] to  V[i+1]
        if (V[i].y <= P.y) {          // start y <= P.y
            if (V[i+1].y  > P.y)      // an upward crossing
                 if (isLeft( V[i], V[i+1], P) > 0)  // P left of  edge
                     ++wn;            // have  a valid up intersect
        }
        else {                        // start y > P.y (no test needed)
            if (V[i+1].y  <= P.y)     // a downward crossing
                 if (isLeft( V[i], V[i+1], P) < 0)  // P right of  edge
                     --wn;            // have  a valid down intersect
        }
    }
    return wn;
}
//===================================================================
 */


export const  isPointInPolygonWn = curry(
  (
    getX, getY,   // Point coordinate accessor functions
    polygon,
    point
  ) => {
    // Ensure a vertex list with V[0] = V[n]
    const V =
      isEqual(polygon[0], polygon[polygon.length-1]) ?
        polygon :
        concat(polygon, polygon[0]);
    const n = V.length - 1;

    console.log('isPointInPolygonWn:', 'poly =', polygon);
    console.log('isPointInPolygonWn:', 'isEqual =', isEqual(polygon[0], polygon[polygon.length-1]));

    console.log('isPointInPolygonWn:', 'V =', V);
    console.log('isPointInPolygonWn:', 'n =', n);

    console.log('isPointInPolygonWn:', 'point =', point);

    let wn = 0;

    const Py = getY(point);

    for (let i = 0; i < n; i++) {   // edge from V[i] to  V[i+1]
      console.log('i =', i);
      if (getY(V[i]) <= Py) {
        // start y <= getY(point)
        console.log('// start y <= getY(point)');
        if (getY(V[i+1])  > Py) {
          // an upward crossing
          console.log('// an upward crossing');
          if (isLeft(getX, getY, V[i], V[i+1], point) > 0) {
            // point left of  edge
            console.log('// point left of  edge');
            wn += 1;
            // have  a valid up intersect
          }
        }
      } else {
        // start y > getY(point) (no test needed)
        console.log('// start y > getY(point) (no test needed)');
        if (getY(V[i+1])  <= Py) {
          // a downward crossing
          console.log('// a downward crossing');
          if (isLeft(getX, getY, V[i], V[i+1], point) < 0) {
            // point right of  edge
            console.log('// point right of  edge');
            wn -= 1;
            // have  a valid down intersect
          }
        }
      }
    }

    // for (let i = 0; i < n; i++) {
    //   // edge from V[i] to  V[i+1]
    //   if (getY(V[i]) <= Py) {
    //     // start y <= P.y
    //     if (getY(V[i+1]) > Py) {
    //       // an upward crossing
    //       if (isLeft(V[i], V[i+1], point) > 0) {
    //         // have a valid up intersect
    //         wn += 1;
    //       }
    //     }
    //   } else {
    //     if (getY(V[i+1]) <= Py) {
    //       // start y > P.y (no test needed)
    //       // a downward crossing
    //       if (isLeft(V[i], V[i+1], point) > 0) {
    //         // have a valid down intersect
    //         wn -= 1;
    //       }
    //     }
    //   }
    // }

    return wn;
  }
);


// export const add = curry((x, y) => x + y);
// export const acc = curry((accessor, object) => accessor(object));
// export const acc2 = curry((getX, getY, object) => {
//   return getX(object) + getY(object);
// });

