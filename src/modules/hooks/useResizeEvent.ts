import React, { MutableRefObject } from 'react';

type Action = () => void;
type Hook = (source: MutableRefObject<HTMLElement>, action: Action) => void;

function debounce(callback: Action, latency: number = 500): void {
    let timer: NodeJS.Timeout;

    clearTimeout(timer);
    timer = setTimeout(callback, latency);
}

const useResizeEvent: Hook = (source, action) => {
    function resize() {
        debounce(() => action());
    }

    // The empty array at the end of this call is important
    // because it ensures the effect will only run once, not
    // every time the component this hook is used by renders.
    React.useEffect(() => {
        if (!source.current) {
            return;
        }

        source.current.addEventListener('resize', resize);
        resize();

        return () => {
            source.current.removeEventListener('resize', resize);
        };
    }, []);
};

export default useResizeEvent;
