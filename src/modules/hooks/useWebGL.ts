import React, { MutableRefObject } from 'react';

type Hook = (canvasRef: MutableRefObject<HTMLCanvasElement>) => MutableRefObject<WebGLRenderingContext>;

const useWebGL: Hook = canvasRef => {
    const contextRef = React.useRef<WebGLRenderingContext>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        if (!canvas.getContext) {
            return;
        }

        const gl = canvas.getContext('webgl') as WebGLRenderingContext;
        if (!gl) {
            return;
        }

        contextRef.current = gl;
    }, []);

    return contextRef;
};

export default useWebGL;