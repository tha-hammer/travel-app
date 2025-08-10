"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTripRecording = useTripRecording;
const react_1 = require("react");
function useTripRecording(recorder) {
    const [state, setState] = (0, react_1.useState)({ isTracking: false, distanceMeters: 0 });
    const intervalRef = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(() => {
        // poll recorder state to reflect updates (scaffold; can switch to event-driven later)
        intervalRef.current = setInterval(() => {
            const s = recorder.getState();
            if (s.kind === 'tracking' || s.kind === 'signal_lost' || s.kind === 'stopping') {
                setState({ isTracking: s.kind !== 'stopping', distanceMeters: s.distanceMeters });
            }
            else {
                setState({ isTracking: false, distanceMeters: 0 });
            }
        }, 500);
        return () => {
            if (intervalRef.current)
                clearInterval(intervalRef.current);
        };
    }, [recorder]);
    return (0, react_1.useMemo)(() => ({
        isTracking: state.isTracking,
        distanceMeters: state.distanceMeters,
        start: () => recorder.start(),
        stop: () => recorder.stop(),
    }), [state.isTracking, state.distanceMeters, recorder]);
}
