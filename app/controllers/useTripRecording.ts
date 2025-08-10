import { useEffect, useMemo, useRef, useState } from 'react';
import { TripRecorder } from '@controllers/TripRecorder';

export interface TripRecordingViewState {
  isTracking: boolean;
  distanceMeters: number;
}

export interface TripRecordingController extends TripRecordingViewState {
  start(): Promise<void>;
  stop(): Promise<void>;
}

export function useTripRecording(recorder: TripRecorder | null): TripRecordingController {
  const [state, setState] = useState<TripRecordingViewState>({ isTracking: false, distanceMeters: 0 });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!recorder) return;
    
    // poll recorder state to reflect updates (scaffold; can switch to event-driven later)
    intervalRef.current = setInterval(() => {
      const s = recorder.getState();
      if (s.kind === 'tracking' || s.kind === 'signal_lost' || s.kind === 'stopping') {
        setState({ isTracking: s.kind !== 'stopping', distanceMeters: s.distanceMeters });
      } else {
        setState({ isTracking: false, distanceMeters: 0 });
      }
    }, 500);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [recorder]);

  return useMemo(
    () => ({
      isTracking: state.isTracking,
      distanceMeters: state.distanceMeters,
      start: () => recorder?.start() || Promise.resolve(),
      stop: () => recorder?.stop() || Promise.resolve(),
    }),
    [state.isTracking, state.distanceMeters, recorder]
  );
}
