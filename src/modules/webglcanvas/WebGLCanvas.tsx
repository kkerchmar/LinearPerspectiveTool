import './webglcanvas.scss'

import React, { FunctionComponent } from 'react';

import useWebGL from '../hooks/useWebGL';
import useResizeCanvas from '../hooks/useResizeCanvas';
import useCube from '../hooks/useCube';

interface IWebGLCanvasProps {
}

const WebGLCanvas: FunctionComponent<IWebGLCanvasProps> = (props: IWebGLCanvasProps) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const contextRef = useWebGL(canvasRef);

    useCube(contextRef);
    useResizeCanvas(canvasRef);

    return (
        <div className="webglcanvas-component container">
            <canvas ref={canvasRef}/>
        </div>
    );
};

export default WebGLCanvas;