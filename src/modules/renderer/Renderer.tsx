import './renderer.scss'

import React, { FunctionComponent } from 'react';

import useWebGL from '../hooks/useWebGL';
import useResizeCanvas from '../hooks/useResizeCanvas';
import useCube from '../hooks/useCube';

interface IRendererProps {
}

const Renderer: FunctionComponent<IRendererProps> = (props: IRendererProps) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const contextRef = useWebGL(canvasRef);

    useCube(contextRef);
    useResizeCanvas(canvasRef);

    return (
        <div className="renderer-component container">
            <canvas ref={canvasRef}/>
        </div>
    );
};

export default Renderer;