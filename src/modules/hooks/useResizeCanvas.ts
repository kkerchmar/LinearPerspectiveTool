import React, { MutableRefObject } from 'react';

import useAnimationFrame from './useAnimationFrame';

type Action = () => void;

function debounce(callback: Action, latency: number = 500): void {
    let timer: NodeJS.Timeout;

    clearTimeout(timer);
    timer = setTimeout(callback, latency);
}

type Hook = (canvasRef: MutableRefObject<HTMLCanvasElement>) => void;

const useResizeCanvas: Hook = canvasRef => {
    function resize() {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }
    
        const cssToRealPixels = window.devicePixelRatio || 1;
    
        const newWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
        const newHeight = Math.floor(canvas.clientHeight * cssToRealPixels);
    
        if (canvas.width !== newWidth || canvas.height !== newHeight) {
            debounce(() => {
                canvas.width = newWidth;
                canvas.height = newHeight;
            });
        }
    }

    useAnimationFrame(resize);
};

export default useResizeCanvas;