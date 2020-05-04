import React, { MutableRefObject } from 'react';

type Hook = (canvasRef: MutableRefObject<HTMLCanvasElement>, contextRef: MutableRefObject<WebGLRenderingContext>) => void;

const useWebGL: Hook = (canvasRef, contextRef) => {
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