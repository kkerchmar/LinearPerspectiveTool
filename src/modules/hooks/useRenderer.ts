import React, { MutableRefObject } from 'react';

import { useAnimationFrame } from '@kkerchmar/react-gl';

import Renderer from '../../renderer/Renderer';
import Model from '../../model/Model';

type Hook = (contextRef: MutableRefObject<WebGLRenderingContext>, modelRef: MutableRefObject<Model>) => void;

const useRenderer: Hook = (contextRef, modelRef) => {
    const rendererRef = React.useRef<Renderer>(null);

    React.useEffect(() => {
        rendererRef.current = new Renderer(
            contextRef.current);
    }, []);

    useAnimationFrame(delta => rendererRef.current?.draw(delta));
};

export default useRenderer;