import Point from './Point';
import Line from './Line';
import Ray from './Ray';
import Segment from './Segment';

class Model {
    private _begin: Point;

    private _points: Point[] = [];
    private _lines: Line[] = [];
    private _rays: Ray[] = [];
    private _segments: Segment[] = [];

    public addPoint(point: Point) {
        this._points.push(point);
    }

    public begin(point: Point) {
        this._begin = point;
    }

    public endLine(point: Point) {
        this._lines.push(new Line(this._begin, point));
        this._begin = null;
    }

    public endRay(point: Point) {
        this._rays.push(new Ray(this._begin, point));
        this._begin = null;
    }

    public endSegment(point: Point) {
        this._segments.push(new Segment(this._begin, point));
        this._begin = null;
    }

    public cancel() {
        this._begin = null;
    }

    public isOngoing(): boolean {
        return this._begin !== null;
    }

    public getPoints(): Point[] {
        return Array.from(this._points);
    }

    public getLines(): Line[] {
        return Array.from(this._lines);
    }

    public getRays(): Ray[] {
        return Array.from(this._rays);
    }

    public getSegments(): Segment[] {
        return Array.from(this._segments);
    }
}

export default Model;