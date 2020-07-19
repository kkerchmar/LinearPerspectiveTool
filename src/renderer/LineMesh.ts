import { mat4 } from 'gl-matrix';
import { initShaderProgram } from '../webgl/Utilities';
import Line from '../model/Line';
import Point from '../model/Point';
import Vector2 from './Vector2';

interface IProgramInfo {
    program: WebGLProgram,
    attribLocations: {
        position: number,
        pointIndex: number,
        color: number
    },
    uniformLocations: {
        lineWidth: WebGLUniformLocation,
        normal: WebGLUniformLocation,
        points: WebGLUniformLocation[]
        modelViewMatrix: WebGLUniformLocation,
        projectionMatrix: WebGLUniformLocation
    }
}

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

class LineMesh {
    private _gl: WebGLRenderingContext;
    private _programInfo: IProgramInfo;
    private _positionBuffer: WebGLBuffer;
    private _colorBuffer: WebGLBuffer;
    private _indexBuffer: WebGLBuffer;
    private _pointIndexBuffer: WebGLBuffer;

    private _width: number;
    private _point1: Point;
    private _point2: Point;

    constructor(
            gl: WebGLRenderingContext,
            line: Line,
            width: number) {
        this._gl = gl;

        this._point1 = line.p1();
        this._point2 = line.p2();

        this._width = width;

        this.createResources();
    }

    public get point1(): Point {
        return this._point1;
    }

    public set point1(point: Point) {
        this._point1 = point;
    }

    public get point2(): Point {
        return this._point2;
    }

    public set point2(point: Point) {
        this._point2 = point;
    }

    public draw() {
        const gl = this._gl;

        // The "model" is always at the origin, the points are what moves. An
        // optimization could be to remove there even being a modelview matrix.
        const modelViewMatrix = mat4.create();

        const projectionMatrix = mat4.create();

        mat4.ortho(
            projectionMatrix,
            0,
            gl.drawingBufferWidth,
            0,
            gl.drawingBufferHeight,
            0.1,
            100);

        let error: number;

        // Use the shader program

        gl.useProgram(this._programInfo.program);

        // Set position attribute array

        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        gl.vertexAttribPointer(
            this._programInfo.attribLocations.position,
            1, // The number of array values per vertex
            gl.FLOAT,
            false,
            0,
            0);
        gl.enableVertexAttribArray(this._programInfo.attribLocations.position);

        // Set vertex color attribute array

        gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
        gl.vertexAttribPointer(
            this._programInfo.attribLocations.color,
            4, // The number of array values per vertex
            gl.FLOAT,
            false,
            0,
            0);
        gl.enableVertexAttribArray(this._programInfo.attribLocations.color);

        // Set the index buffer array

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);

        // Set point index attribute array

        gl.bindBuffer(gl.ARRAY_BUFFER, this._pointIndexBuffer);
        gl.vertexAttribPointer(
            this._programInfo.attribLocations.pointIndex,
            1, // The number of array values per vertex
            gl.FLOAT,
            false,
            0,
            0);
        gl.enableVertexAttribArray(this._programInfo.attribLocations.pointIndex);

        // Set line width uniform

        gl.uniform1f(
            this._programInfo.uniformLocations.lineWidth,
            this._width);

        // Flip Y-axis (app Y origin is the top of the canvas. webgl
        // orthographic Y origin is the bottom).

        const point1X = this._point1.x();
        const point1Y = gl.canvas.height - this._point1.y();
        const point2X = this._point2.x();
        const point2Y = gl.canvas.height - this._point2.y();

        // Calculate normal for normal uniform

        const vector = new Vector2(
            point2X - point1X,
            point2Y - point1Y
        );

        const normal = new Vector2(
            -vector.y(),
            vector.x()
        );

        const normalized = normal.normalized();

        // Set normal uniform

        gl.uniform2f(
            this._programInfo.uniformLocations.normal,
            normalized.x(),
            normalized.y());

        // Set point uniforms

        gl.uniform3f(
            this._programInfo.uniformLocations.points[0],
            point1X,
            point1Y,
            -0.5); // 'z' is supported by the shader program

        gl.uniform3f(
            this._programInfo.uniformLocations.points[1],
            point2X,
            point2Y,
            -0.5); // 'z' is supported by the shader program

        // Set matrix uniforms

        gl.uniformMatrix4fv(
            this._programInfo.uniformLocations.projectionMatrix,
            false,
            projectionMatrix);

        gl.uniformMatrix4fv(
            this._programInfo.uniformLocations.modelViewMatrix,
            false,
            modelViewMatrix);

        // Draw the line

        gl.drawElements(
            gl.TRIANGLES,
            6, // The number of vertices
            gl.UNSIGNED_SHORT,
            0);
    }

    private createResources() {
        const gl = this._gl;

        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

        this._programInfo = {
            program: shaderProgram,
            attribLocations: {
                position: gl.getAttribLocation(shaderProgram, 'aPosition'),
                pointIndex: gl.getAttribLocation(shaderProgram, 'aPointIndex'),
                color: gl.getAttribLocation(shaderProgram, 'aColor')
            },
            uniformLocations: {
                lineWidth: gl.getUniformLocation(shaderProgram, 'uLineWidth'),
                normal: gl.getUniformLocation(shaderProgram, 'uNormal'),
                points: [
                    gl.getUniformLocation(shaderProgram, 'uPoints[0]'),
                    gl.getUniformLocation(shaderProgram, 'uPoints[1]')
                ],
                modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
                projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
              }
        };

        this._positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        this._colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

        this._indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        this._pointIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this._pointIndexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointIndices), gl.STATIC_DRAW);
    }
}

export default LineMesh;