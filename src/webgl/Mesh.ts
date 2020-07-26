import { mat4 } from 'gl-matrix';

class BufferInfo {
    private readonly _attribLocation: number;
    private readonly _buffer: WebGLBuffer;
    private readonly _numValuesPerVertex: number;

    constructor(
            attribLocation: number,
            buffer: WebGLBuffer,
            numValuesPerVertex: number) {
        this._attribLocation = attribLocation;
        this._buffer = buffer;
        this._numValuesPerVertex = numValuesPerVertex;
    }

    public get attribLocation(): number {
        return this._attribLocation;
    }

    public get buffer(): WebGLBuffer {
        return this._buffer;
    }

    public get numValuesPerVertex(): number {
        return this._numValuesPerVertex;
    }
}

export interface IUniform1f {
    f1: number
}

export interface IUniform2f {
    f1: number,
    f2: number
}

export interface IUniform3f {
    f1: number,
    f2: number,
    f3: number
}

export interface IUniformMatrix4fv {
    matrix: mat4
}

abstract class Uniform {
    protected readonly gl: WebGLRenderingContext;
    protected readonly uniformLocation: WebGLUniformLocation;

    protected constructor(
            gl: WebGLRenderingContext,
            uniformLocation: WebGLUniformLocation) {
        this.gl = gl;
        this.uniformLocation = uniformLocation;
    }

    public abstract activate(): void;
}

class Uniform1f extends Uniform implements IUniform1f {
    public f1: number;

    public constructor(
            gl: WebGLRenderingContext,
            uniformLocation: WebGLUniformLocation,
            f1: number) {
        super(gl, uniformLocation);

        this.f1 = f1;
    }

    public activate(): void {
        this.gl.uniform1f(this.uniformLocation, this.f1);
    }
}

class Uniform2f extends Uniform implements IUniform2f {
    public f1: number;
    public f2: number;

    public constructor(
            gl: WebGLRenderingContext,
            uniformLocation: WebGLUniformLocation,
            f1: number,
            f2: number) {
        super(gl, uniformLocation);

        this.f1 = f1;
        this.f2 = f2;
    }

    public activate(): void {
        this.gl.uniform2f(this.uniformLocation, this.f1, this.f2);
    }
}

class Uniform3f extends Uniform implements IUniform3f {
    public f1: number;
    public f2: number;
    public f3: number;

    public constructor(
            gl: WebGLRenderingContext,
            uniformLocation: WebGLUniformLocation,
            f1: number,
            f2: number,
            f3: number) {
        super(gl, uniformLocation);

        this.f1 = f1;
        this.f2 = f2;
        this.f3 = f3;
    }

    public activate(): void {
        this.gl.uniform3f(this.uniformLocation, this.f1, this.f2, this.f3);
    }
}

class UniformMatrix4fv extends Uniform implements IUniformMatrix4fv {
    public matrix: mat4;

    public constructor(
            gl: WebGLRenderingContext,
            uniformLocation: WebGLUniformLocation,
            matrix: mat4) {
        super(gl, uniformLocation);

        this.matrix = matrix;
    }

    public activate(): void {
        this.gl.uniformMatrix4fv(this.uniformLocation, false, this.matrix);
    }
}

export default abstract class Mesh {
    private readonly _gl: WebGLRenderingContext;
    private readonly _program: WebGLProgram;
    private _buffers: BufferInfo[] = [];
    private _uniforms: Uniform[] = [];

    private _indexBuffer: WebGLBuffer = null;
    private _indicesCount: number;

    protected constructor(
            gl: WebGLRenderingContext,
            program: WebGLProgram) {
        this._gl = gl;
        this._program = program;
    }

    protected get gl(): WebGLRenderingContext {
        return this._gl;
    }

    public draw(): void {
        const gl = this._gl;

        gl.useProgram(this._program);

        for (const info of this._buffers) {
            gl.bindBuffer(gl.ARRAY_BUFFER, info.buffer);
            gl.vertexAttribPointer(
                info.attribLocation,
                info.numValuesPerVertex,
                gl.FLOAT,
                false,
                0,
                0);
            gl.enableVertexAttribArray(info.attribLocation);
        }

        for (const uniform of this._uniforms) {
            uniform.activate();
        }

        if (this._indexBuffer === null) {
            throw 'No index buffer is set.';
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._indexBuffer);
        gl.drawElements(gl.TRIANGLES, this._indicesCount, gl.UNSIGNED_SHORT, 0);

        for (const info of this._buffers) {
            gl.disableVertexAttribArray(info.attribLocation);
        }
    }

    public dispose() {
        const gl = this._gl;

        for (const buffer in this._buffers) {
            gl.deleteBuffer(buffer);
        }

        this._buffers = [];

        if(this._indexBuffer !== null) {
            gl.deleteBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }
    }

    public createUniform1f(
            name: string,
            f1: number): IUniform1f {
        const gl = this._gl;

        const location: WebGLUniformLocation = gl.getUniformLocation(this._program, name);

        const uniform = new Uniform1f(gl, location, f1);
        this._uniforms.push(uniform);
        return uniform;
    }

    public createUniform2f(
            name: string,
            f1: number,
            f2: number): IUniform2f {
        const gl = this._gl;

        const location: WebGLUniformLocation = gl.getUniformLocation(this._program, name);

        const uniform = new Uniform2f(gl, location, f1, f2);
        this._uniforms.push(uniform);
        return uniform;
    }

    public createUniform3f(
            name: string,
            f1: number,
            f2: number,
            f3: number): IUniform3f {
        const gl = this._gl;

        const location: WebGLUniformLocation = gl.getUniformLocation(this._program, name);

        const uniform = new Uniform3f(gl, location, f1, f2, f3);
        this._uniforms.push(uniform);
        return uniform;
    }

    public createUniformMatrix4fv(
            name: string,
            matrix: mat4): IUniformMatrix4fv {
        const gl = this._gl;

        const location: WebGLUniformLocation = gl.getUniformLocation(this._program, name);

        const uniform = new UniformMatrix4fv(gl, location, matrix);
        this._uniforms.push(uniform);
        return uniform;
    }

    protected addBuffer(
            name: string,
            data: number[],
            numValuesPerVertex: number): void {
        const gl = this._gl;

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

        const attribLocation: number = gl.getAttribLocation(this._program, name);

        const info = new BufferInfo(
            attribLocation,
            buffer,
            numValuesPerVertex);

        this._buffers.push(info);
    }

    protected setIndexBuffer(
            data: number[]): void {
        const gl = this._gl;

        if (this._indexBuffer !== null) {
            gl.deleteBuffer(this._indexBuffer);
            this._indexBuffer = null;
        }

        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data), gl.STATIC_DRAW);

        this._indexBuffer = buffer;
        this._indicesCount = data.length;
    }
}