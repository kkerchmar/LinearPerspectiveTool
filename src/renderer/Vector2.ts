class Vector2 {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    public x(): number {
        return this._x;
    }

    public y(): number {
        return this._y;
    }

    public length(): number {
        const x = Math.abs(this._x);
        const y = Math.abs(this._y);

        return Math.sqrt(x * x + y * y);
    }

    public normalized(): Vector2 {
        const length = this.length();
        return new Vector2(
            this._x / length,
            this._y / length
        );
    }
}

export default Vector2;