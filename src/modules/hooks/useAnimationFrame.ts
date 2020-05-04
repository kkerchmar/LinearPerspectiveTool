import React from 'react';

type Callback = (delta: number) => void;
type Hook = (callback: Callback) => void;

const useAnimationFrame: Hook = callback => {
    const animationFrameRequestRef = React.useRef<number | null>(null);
    const lastTimestampRef = React.useRef<DOMHighResTimeStamp | null>(null);

    const animate = (timestamp: DOMHighResTimeStamp) => {
        if (lastTimestampRef.current) {
            const delta: number = timestamp - lastTimestampRef.current;
            callback(delta);
        }

        lastTimestampRef.current = timestamp;
        animationFrameRequestRef.current = requestAnimationFrame(animate);
    }

    // The empty array at the end of this call is important
    // because it ensures the effect will only run once, not
    // every time the component this hook is used by renders.
    React.useEffect(() => {
        animationFrameRequestRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRequestRef.current) {
                cancelAnimationFrame(animationFrameRequestRef.current);
            }
        };
    }, []);
};

export default useAnimationFrame;