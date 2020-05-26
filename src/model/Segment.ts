import Point from './Point';

class Segment {
    private _p1: Point;
    private _p2: Point;

    constructor(p1: Point, p2: Point) {
        this._p1 = p1;
        this._p2 = p2;
    }

    public p1() {
        return this._p1;
    }

    public p2() {
        return this._p2;
    }
}

export default Segment;