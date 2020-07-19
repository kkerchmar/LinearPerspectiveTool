import Model from "../model/Model";
import Cube from '../webgl/Cube';
import LineMesh from "./LineMesh";
import Line from "../model/Line";
import Point from "../model/Point";

class Renderer {
    private _context: WebGLRenderingContext;
    private _model: Model;

    private _cube: Cube;
    private _line: LineMesh;

    constructor(
            context: WebGLRenderingContext,
            model: Model) {
        this._context = context;
        this._model = model;

        this._cube = new Cube(context);
        this._line = new LineMesh(context, new Line(new Point(40, 200), new Point(800, 400)), 10);
    }

    public draw(delta: number) {
        const gl = this._context;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.9, 0.9, 0.9, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this._cube.draw(delta);

        this._line.point2 = new Point(800, (this._line.point2.y() + 1) % 400);
        this._line.draw();
    }
}

export default Renderer;