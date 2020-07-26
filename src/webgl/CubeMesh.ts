import { mat4 } from 'gl-matrix';
import { initShaderProgram } from './Utilities';
import Mesh, { IUniformMatrix4fv } from './Mesh';

const positions = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    
    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,
    
    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,
    
    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,
    
    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,
    
    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,
];

const faceColors = [
    [1.0,  1.0,  1.0,  1.0],    // Front face: white
    [1.0,  0.0,  0.0,  1.0],    // Back face: red
    [0.0,  1.0,  0.0,  1.0],    // Top face: green
    [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    [1.0,  0.0,  1.0,  1.0],    // Left face: purple
];

const indices = [
    0,  1,  2,      0,  2,  3,    // front
    4,  5,  6,      4,  6,  7,    // back
    8,  9,  10,     8,  10, 11,   // top
    12, 13, 14,     12, 14, 15,   // bottom
    16, 17, 18,     16, 18, 19,   // right
    20, 21, 22,     20, 22, 23,   // left
];

const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
`;

const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
`;

export class CubeMesh extends Mesh {
    private readonly _modelViewMatrixUniform: IUniformMatrix4fv;
    private readonly _projectionMatrixUniform: IUniformMatrix4fv;

    private _rotation: number;

    public constructor(
            gl: WebGLRenderingContext) {
        const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
        super(gl, shaderProgram);

        this._rotation = 0;

        // Create attribute buffers.

        this.addBuffer('aVertexPosition', positions, 3);

        let colors: number[] = [];
        for (var j = 0; j < faceColors.length; ++j) {
            const c = faceColors[j];
        
            // Repeat each color four times for the four vertices of the face
            colors = colors.concat(c, c, c, c);
        }

        this.addBuffer('aVertexColor', colors, 4);

        // Set the index buffer.

        this.setIndexBuffer(indices);

        // Create uniforms.

        const modelViewMatrix = mat4.create();
        this._modelViewMatrixUniform = this.createUniformMatrix4fv('uModelViewMatrix', modelViewMatrix);

        const projectionMatrix = mat4.create();
        this._projectionMatrixUniform = this.createUniformMatrix4fv('uProjectionMatrix', projectionMatrix);
    }

    public update(delta: number) {
        const gl = this.gl;

        this._rotation += delta * 0.001;

        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.width / gl.canvas.height;
        const zNear = 0.1;
        const zFar = 100.0;
        const projectionMatrix = mat4.create();   
    
        mat4.perspective(
            projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);
        
        this._projectionMatrixUniform.matrix = projectionMatrix;

        const modelViewMatrix = mat4.create();
    
        mat4.translate(modelViewMatrix,     // destination matrix
            modelViewMatrix,     // matrix to translate
            [-0.0, 0.0, -6.0]);  // amount to translate
        mat4.rotate(modelViewMatrix,  // destination matrix
            modelViewMatrix,  // matrix to rotate
            this._rotation,     // amount to rotate in radians
            [0, 0, 1]);       // axis to rotate around (Z)
        mat4.rotate(modelViewMatrix,  // destination matrix
            modelViewMatrix,  // matrix to rotate
            this._rotation * .7,// amount to rotate in radians
            [0, 1, 0]);       // axis to rotate around (X)
        
        this._modelViewMatrixUniform.matrix = modelViewMatrix;
    }
}

export default CubeMesh;