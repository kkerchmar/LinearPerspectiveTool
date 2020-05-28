import Model from "../model/Model";
import Cube from '../webgl/Cube';

class Renderer {
    private _context: WebGLRenderingContext;
    private _model: Model;

    private _cube: Cube;

    constructor(
            context: WebGLRenderingContext,
            model: Model) {
        this._context = context;
        this._model = model;

        this._cube = new Cube(context);
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
    }
}

export default Renderer;