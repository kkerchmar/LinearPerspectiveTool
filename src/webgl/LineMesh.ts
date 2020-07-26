// Useful reference material:
// https://mattdesl.svbtle.com/drawing-lines-is-hard
// https://blog.mapbox.com/drawing-antialiased-lines-with-opengl-8766f34192dc
// https://www.npmjs.com/package/polyline-normals

import { mat4 } from 'gl-matrix';
import { initShaderProgram } from './Utilities';
import Point2 from '../Math/Point2';
import Vector2 from '../Math/Vector2';
import Mesh, { IUniform1f, IUniform2f, IUniform3f, IUniformMatrix4fv } from './Mesh';

// These points will be moved by uniforms, as it is cheaper to update two vec2
// uniforms than to update this buffer each draw, provided there are more than
// two values per end of the line.
const positions = [
    // Point 1
    1.0, -1.0,

    // Point 2
    -1.0, 1.0
];

const colors = [
    0, 0, 0, 1,
    0, 0, 0, 1,
    0, 0, 0, 1,
    0, 0, 0, 1
    //1.0,  0.0,  0.0,  1.0, // red
    //0.0,  1.0,  0.0,  1.0, // green
    //0.0,  0.0,  1.0,  1.0, // blue
    //1.0,  1.0,  0.0,  1.0, // yellow
];

const indices = [
    0, 1, 2,
    0, 2, 3
];

const pointIndices = [
    0, 0, 1, 1
];

const vsSource = `
    attribute float aPosition;
    attribute float aPointIndex;

    attribute vec4 aColor;

    uniform float uLineWidth;
    uniform vec2 uNormal;

    uniform vec3 uPoints[2];

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main() {
        vec2 normal = uNormal * aPosition;
        vec4 delta = vec4(normal * uLineWidth, 0, 0);
        vec3 pointPosition = uPoints[int(aPointIndex)];
        vec4 position = uModelViewMatrix * vec4(pointPosition, 1);
        gl_Position = uProjectionMatrix * (position + delta);
        vColor = aColor;
    }
`;

const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
`;

export class LineMesh extends Mesh {
    private readonly _widthUniform: IUniform1f;
    private readonly _normalUniform: IUniform2f;

    private readonly _startUniform: IUniform3f;
    private readonly _endUniform: IUniform3f;

    private readonly _modelViewMatrixUniform: IUniformMatrix4fv;
    private readonly _projectionMatrixUniform: IUniformMatrix4fv;

    public start: Point2;
    public end: Point2;

    constructor(
            gl: WebGLRenderingContext,
            width: number,
            start: Point2,
            end: Point2) {
        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        super(gl, shaderProgram);

        this.start = start;
        this.end = end;

        // Create attribute buffers.

        this.addBuffer('aPosition', positions, 1);
        this.addBuffer('aColor', colors, 4);
        this.addBuffer('aPointIndex', pointIndices, 1);

        // Set the index buffer.

        this.setIndexBuffer(indices);

        // Create uniforms.

        this._widthUniform = this.createUniform1f('uLineWidth', width);
        this._normalUniform = this.createUniform2f('uNormal', 0, 0);
        this._startUniform = this.createUniform3f('uPoints[0]', 0, 0, -0.5);
        this._endUniform = this.createUniform3f('uPoints[1]', 0, 0, -0.5);

        // The "model" is always at the origin, the points are what moves. An
        // optimization could be to remove there even being a modelview matrix.
        const modelViewMatrix = mat4.create();
        this._modelViewMatrixUniform = this.createUniformMatrix4fv('uModelViewMatrix', modelViewMatrix);

        const projectionMatrix = mat4.create();
        this._projectionMatrixUniform = this.createUniformMatrix4fv('uProjectionMatrix', projectionMatrix);
    }

    public get width(): number {
        return this._widthUniform.f1;
    }

    public set width(f1: number) {
        this._widthUniform.f1 = f1;
    }

    public update() {
        const gl = this.gl;

        // Flip Y-axis (app Y origin is the top of the canvas. webgl
        // orthographic Y origin is the bottom).

        const startX = this.start.x;
        const startY = gl.canvas.height - this.start.y;
        const endX = this.end.x;
        const endY = gl.canvas.height - this.end.y;

        // Calculate normal for normal uniform

        const vector = new Vector2(
            endX - startX,
            endY - startY
        );

        const normal = new Vector2(
            -vector.y,
            vector.x
        );

        const normalized: Vector2 = normal.normalized();

        this._normalUniform.f1 = normalized.x;
        this._normalUniform.f2 = normalized.y;

        this._startUniform.f1 = startX;
        this._startUniform.f2 = startY;
        this._endUniform.f1 = endX;
        this._endUniform.f2 = endY;

        const projectionMatrix = mat4.create();
        mat4.ortho(
            projectionMatrix,
            0,
            gl.drawingBufferWidth,
            0,
            gl.drawingBufferHeight,
            0.1,
            100);
        this._projectionMatrixUniform.matrix = projectionMatrix;
    }
}

export default LineMesh;