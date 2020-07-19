import './webglcanvas.scss'

import React, { FunctionComponent, MutableRefObject } from 'react';

import { useResizeCanvas, useWebGL } from '@kkerchmar/react-gl';

interface IWebGLCanvasProps {
    contextRef: MutableRefObject<WebGLRenderingContext>;
}

const WebGLCanvas: FunctionComponent<IWebGLCanvasProps> = (props: IWebGLCanvasProps) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    
    useWebGL(canvasRef, props.contextRef);
    useResizeCanvas(canvasRef);

    return (
        <div className="webglcanvas-component container">
            <canvas ref={canvasRef}/>
        </div>
    );
};

export default WebGLCanvas;