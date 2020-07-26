import CubeMesh from '../webgl/CubeMesh';
import LineMesh from "../webgl/LineMesh";
import Point2 from "../math/Point2";

export default class Renderer {
    private _context: WebGLRenderingContext;

    private _cube: CubeMesh;
    private _line: LineMesh;

    constructor(
            context: WebGLRenderingContext) {
        this._context = context;

        this._cube = new CubeMesh(context);
        this._line = new LineMesh(context, 10, new Point2(40, 200), new Point2(800, 400));
    }

    public draw(delta: number) {
        const gl = this._context;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.9, 0.9, 0.9, 1.0);
        gl.clearDepth(1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        this._cube.update(delta);
        this._cube.draw();

        this._line.end = new Point2(800, (this._line.end.y + 1) % 400);
        this._line.update();
        this._line.draw();
    }
}