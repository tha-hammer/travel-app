I’m going to draft a concise v1 plan covering UX, data model, permissions, location tracking, background behavior, persistence, and a dev task checklist so you can start building immediately.

### Product scope (V1)
- **Goal**: Track miles between manual start (“GO”) and stop (“STOP”), save trip with start/end lat/long, distance, and basic details. Let user mark a trip as a “routine trip” to speed up future entry.
- **Out of scope**: Map/route visualization, automatic start/stop, multi-vehicle support, exports, accounts/sync.

### Core user flows
- **Start trip**:
  - User opens app, taps big green “GO”.
  - If location permission not granted, show explainer → prompt.
  - Begin tracking in background while driving; UI toggles to “STOP” with stop sign.
- **Stop trip**:
  - User taps “STOP”.
  - App computes distance, captures start/end coordinates and timestamps.
  - Persist trip immediately.
  - Navigate to “Trip Details” to add purpose/notes and optionally “Save as routine trip”.
- **Next trip speed-up**:
  - On the next stop, “Trip Details” shows a quick “Apply routine” action (from saved templates), or auto-prefills from most recent routine.

### Screens
- **Home**
  - State A: Big green “GO” button.
  - State B: Stop-sign button with “STOP”, distance live counter, small “Pause?” optional for future.
- **Trip Details**
  - Fields: Title/Purpose, Notes, Category/Client (optional), Toggle: “Save as routine trip”.
  - Quick action: “Apply routine” (picker of saved templates).
- **Trips (History)**
  - Simple list (date, miles), detail view for a single trip. Can be v1.1 if you want.

### Permissions and background modes
- **Info.plist strings**:
  - `NSLocationWhenInUseUsageDescription`: “Used to measure trip distance while you drive.”
  - `NSLocationAlwaysAndWhenInUseUsageDescription`: “Needed to keep tracking distance when the app is in the background.”
- **Background Modes**:
  - Enable `Location updates`.
- **Prompt strategy**:
  - Request “When In Use” on first run (from Home).
  - On first “GO”, present in-app explainer, then escalate to “Always Allow” so trips continue if the app backgrounds/phone locks.
  - Fallback: If user declines “Always”, keep the screen on while trip is active (`idleTimerDisabled = true`) and warn that distance may stop if app is backgrounded.

### Location tracking approach
- **API**: `CLLocationManager` with standard updates.
- **Config while trip active**:
  - `desiredAccuracy = kCLLocationAccuracyBest`
  - `activityType = .automotiveNavigation`
  - `distanceFilter = 10` to `20` meters
  - `allowsBackgroundLocationUpdates = true`
  - `pausesLocationUpdatesAutomatically = true`
- **Distance computation**:
  - Sum `CLLocation.distance(from:)` between filtered consecutive points.
  - Filter out points with `horizontalAccuracy > 50m`, `timestamp` older than last, or jumps implying unrealistic speeds (e.g., > 60 m/s).
  - Smooth by ignoring sub-5m segments when speed < 1 m/s to reduce jitter.
- **Start/End capture**:
  - On “GO”: set start coordinate/time at first valid fix.
  - On “STOP”: set end coordinate/time from most recent valid fix.

### State machine
- States: `idle` → `arming` (await first fix) → `tracking` → `stopping` (finalize) → `details`.
- Persist “trip in progress” state so you can recover after app relaunch.

### Data model
- **Trip**
  - `id: UUID`
  - `startAt: Date`
  - `startLat: Double`
  - `startLon: Double`
  - `endAt: Date`
  - `endLat: Double`
  - `endLon: Double`
  - `distanceMeters: Double` (compute miles as needed)
  - `title: String?`
  - `notes: String?`
  - `appliedRoutineId: UUID?` (if template used)
- **RoutineTripTemplate**
  - `id: UUID`
  - `title: String`
  - `notes: String?`
  - Optional: `category/client: String?`
- Storage: Core Data or SwiftData (iOS 17+). If targeting iOS 16, use Core Data.

### Architecture
- **Stack**: Swift 5.x, iOS 16+, SwiftUI, CoreLocation, Core Data/SwiftData.
- **Layers**:
  - `LocationTrackingService`: owns `CLLocationManager`, exposes publisher for distance, state, last location.
  - `TripRecorder`: accumulates locations, applies filtering/smoothing, computes distance, persists Trip.
  - `TripsRepository`: persistence for trips and templates.
  - `AppViewModel`: orchestrates UI state (idle/tracking) and navigation.

Example service interface:
```swift
protocol LocationTrackingService {
  var authorizationStatusPublisher: AnyPublisher<CLAuthorizationStatus, Never> { get }
  var latestLocationPublisher: AnyPublisher<CLLocation, Never> { get }
  func requestWhenInUse()
  func requestAlways()
  func startTracking()
  func stopTracking()
}
```

### Persistence and lifecycle
- Save a “trip stub” at start with start time/coord when first fix arrives.
- Update it as distance accumulates.
- On stop, finalize end coord/time/distance.
- Open Trip Details editing the saved record; saving updates the existing record.
- If app is killed, on next launch detect “trip in progress” and offer to resume or stop-and-save.

### Accuracy, battery, and edge cases
- Start only after first stable fix (e.g., accuracy ≤ 50m or after a 3-second window).
- Ignore the first minute’s small jitter with speed < 1 m/s.
- Clamp abnormal jumps and drop stale points.
- If GPS unavailable (tunnels), keep last fix; distance won’t advance until signal returns.
- Battery: only high accuracy while tracking; stop updates immediately when user taps STOP.

### Telemetry and logging (dev only)
- Lightweight debug log for received points, filtered points, and distance deltas (toggle in Settings or via compile flag).

### Settings (optional for v1.1)
- Units: Miles/Kilometers.
- Allow screen to sleep while tracking (default off if Always granted).
- Diagnostics toggle.

### Future backlog
- Map and route polyline.
- Auto start/stop using `CMMotionActivity` and geofencing.
- Widgets/Live Activities for ongoing trip.
- CSV/PDF export and tax integrations.
- Multi-vehicle/categories and rates.

### Dev task checklist
- Project setup (SwiftUI app target, iOS 16+).
- Info.plist keys for location usage; enable Background Modes → Location updates.
- Implement `LocationTrackingService` and `TripRecorder` with filtering and distance sum.
- Implement `AppViewModel` with state machine.
- UI:
  - Home with “GO”/“STOP” states and live distance.
  - Trip Details form with “Save as routine trip” and “Apply routine”.
  - Simple Trips list (optional v1.1).
- Persistence with Core Data/SwiftData; models and migrations.
- Permission flows and escalation to Always.
- Trip-in-progress recovery on launch.
- Unit tests:
  - Distance calculation/filtering with synthetic tracks.
  - Persistence roundtrip.
  - State machine transitions.
- Manual QA:
  - Foreground and background tracking for 5–20 minute drives.
  - Declined Always permission fallback behavior.
  - Airplane mode / GPS loss handling.

Would you like me to scaffold the SwiftUI project with the Info.plist entries, background mode, and empty services/views to get you started? I can generate that next.

- Defined concise v1 scope, flows, screens, data model, tracking configuration, background/permission strategy, and a dev checklist so you can start building immediately.

Here is Claude's plan:                                                                                           │
│ ╭──────────────────────────────────────────────────────────────────────────────────────────────────────────────╮ │
│ │ TDD Development Plan for React Native Travel App MVP                                                         │ │
│ │                                                                                                              │ │
│ │ Phase 1: Core Business Logic & Models (Test First)                                                           │ │
│ │                                                                                                              │ │
│ │ 1. Trip Model Tests - Test trip creation, distance calculations, validation using Jest                       │ │
│ │ 2. Distance Calculation Tests - Test GPS point filtering, smoothing, and distance computation with mock      │ │
│ │ location data                                                                                                │ │
│ │ 3. State Machine Tests - Test idle→arming→tracking→stopping→details state transitions                        │ │
│ │ 4. Utility Functions Tests - Test coordinate validation, speed filtering, and accuracy checks                │ │
│ │                                                                                                              │ │
│ │ Phase 2: Services & Data Layer (Test First)                                                                  │ │
│ │                                                                                                              │ │
│ │ 1. LocationService Tests - Mock react-native-geolocation-service, test permission requests                   │ │
│ │ 2. TripRecorder Tests - Test trip persistence with AsyncStorage/SQLite, distance accumulation                │ │
│ │ 3. StorageService Tests - Test trip and routine template CRUD operations                                     │ │
│ │ 4. BackgroundTask Tests - Mock @react-native-async-storage/async-storage for state persistence               │ │
│ │                                                                                                              │ │
│ │ Phase 3: Hooks & State Management (Test First)                                                               │ │
│ │                                                                                                              │ │
│ │ 1. useLocationTracking Hook Tests - Test location updates, permission handling                               │ │
│ │ 2. useTripRecording Hook Tests - Test trip start/stop, distance updates                                      │ │
│ │ 3. Context/Redux Tests - Test app state management and navigation flows                                      │ │
│ │ 4. useBackgroundPermissions Tests - Test iOS/Android background location permission flows                    │ │
│ │                                                                                                              │ │
│ │ Phase 4: Components & Integration                                                                            │ │
│ │                                                                                                              │ │
│ │ 1. Component Tests - Test GO/STOP button states, trip details form, routine templates                        │ │
│ │ 2. Navigation Tests - Test screen transitions and state preservation                                         │ │
│ │ 3. Manual QA - Real device testing with GPS tracking                                                         │ │
│ │                                                                                                              │ │
│ │ React Native Specific Considerations:                                                                        │ │
│ │ - Use Jest + React Native Testing Library for component/hook testing                                         │ │
│ │ - Mock platform-specific modules (react-native-geolocation-service,                                          │ │
│ │ @react-native-async-storage/async-storage)                                                                   │ │
│ │ - Test both iOS and Android permission flows separately                                                      │ │
│ │ - Use mock location providers for consistent distance calculation testing                                    │ │
│ │ - Test background task behavior with react-native-background-job or similar                                  │ │
│ │                                                                                                              │ │
│ │ Key Dependencies to Mock:                                                                                    │ │
│ │ - react-native-geolocation-service for GPS tracking                                                          │ │
│ │ - @react-native-async-storage/async-storage for persistence                                                  │ │
│ │ - react-native-background-timer for background location updates                                              │ │
│ │ - Platform-specific permission modules                                                                       │ │
│ │                                                                                                              │ │
│ │ Testing Strategy:                                                                                            │ │
│ │ - Unit tests for pure functions (distance calculation, filtering)                                            │ │
│ │ - Hook tests for location/trip management logic                                                              │ │
│ │ - Component tests for UI behavior                                                                            │ │
│ │ - Integration tests for complete user flows

### React Native MVP: Architecture (MVC) and modularity

This section defines a concrete, React Native–friendly MVC architecture with strict modular boundaries and testing guidance.

#### MVC definitions (React Native)
- **Model**: Domain entities, pure functions (e.g., distance, filtering), and repository interfaces. No React or platform APIs.
- **View**: Presentational components/screens. Pure UI; no business logic or side-effects.
- **Controller**: Hooks/containers that orchestrate flows, call services/use-cases, and feed state/handlers to Views.

Allowed dependency direction: `View → Controller → Model`. Controllers may depend on platform adapters under Services that implement Model-layer interfaces.

#### Folder structure (with path aliases)
```
app/
  models/                 # domain types and pure logic (no RN imports)
    entities/
    value-objects/
    use-cases/            # e.g., computeDistance, filterFixes
    repositories/         # TripRepository.ts (interface), TemplateRepository.ts
  services/               # adapters to platform/libs; implement repository/service interfaces
    location/
    storage/
    permissions/
  controllers/            # hooks/containers orchestrating flows (e.g., useTripRecording)
  views/                  # pure UI components/screens
  navigation/
  state/                  # context or store wiring (if needed)
  utils/
  tests/
```

Recommended TS path aliases for clarity and linting rules:
- Aliases: `@models/*`, `@services/*`, `@controllers/*`, `@views/*`, `@utils/*`.
- Lint enforcement: `eslint-plugin-import` or `eslint-plugin-boundaries` to prevent illegal cross-layer imports (e.g., Views importing Services directly).

#### Key interfaces (seams)
```ts
// app/models/entities/Trip.ts
export interface Trip {
  id: string;
  startAt: Date;
  startLat: number;
  startLon: number;
  endAt?: Date;
  endLat?: number;
  endLon?: number;
  distanceMeters: number;
  title?: string;
  notes?: string;
  appliedRoutineId?: string;
}

// app/models/entities/RoutineTripTemplate.ts
export interface RoutineTripTemplate {
  id: string;
  title: string;
  notes?: string;
  category?: string;
}

// app/models/repositories/TripRepository.ts
export interface TripRepository {
  create(trip: Trip): Promise<Trip>;
  update(trip: Trip): Promise<Trip>;
  findById(id: string): Promise<Trip | null>;
  list(): Promise<Trip[]>;
}

// app/models/repositories/TemplateRepository.ts
export interface TemplateRepository {
  list(): Promise<RoutineTripTemplate[]>;
  upsert(t: RoutineTripTemplate): Promise<RoutineTripTemplate>;
}

// app/services/location/LocationProvider.ts
export interface LocationFix {
  lat: number;
  lon: number;
  accuracy: number;      // meters
  timestamp: number;     // ms
}
export interface LocationProvider {
  requestWhenInUse(): Promise<'granted' | 'denied' | 'prompt'>;
  requestAlways(): Promise<'granted' | 'denied' | 'prompt'>;
  start(onFix: (fix: LocationFix) => void): void;
  stop(): void;
}
```

#### Domain use-cases (pure functions)
```ts
// app/models/use-cases/ComputeDistance.ts
import { LocationFix } from '@services/location/LocationProvider';
export function computeDistanceMeters(points: LocationFix[]): number { /* pure */ }

// app/models/use-cases/FilterLocationFixes.ts
import { LocationFix } from '@services/location/LocationProvider';
export function filterFixes(points: LocationFix[]): LocationFix[] { /* accuracy/speed filters */ }
```

#### Controllers (hooks) orchestrate flows
```ts
// app/controllers/useTripRecording.ts
// Accepts dependencies (repo, location) to keep testable and modular
```

Views must consume only controllers; they should not import Services or Models directly.

#### React Native background tracking decision (iOS)
- Background GPS on iOS via timers is unreliable. Choose one for MVP:
  - Foreground-only tracking (keep screen awake while tracking) with clear UX; or
  - Use a maintained library capable of background geolocation and wrap it behind `LocationProvider`.
- The architecture above isolates this choice in `services/location`, keeping Models/Controllers unchanged.

#### TDD mapping to MVC
- **Model**
  - Unit: `computeDistanceMeters`, `filterFixes` with synthetic tracks
  - Contract: repository interfaces with a shared test suite (in-memory/fake impl must pass)
- **Services**
  - Adapter tests using fakes/mocks for platform libs (no real GPS)
- **Controller**
  - Hook tests with mocked `TripRepository` and `LocationProvider`: start/stop, distance updates, error paths
- **View**
  - Component tests for rendering and callbacks only (no business logic assertions)
- **Integration**
  - Compose Controller + in-memory repo + fake location to verify user flows

#### Enforcement and tooling
- Add ESLint rules to restrict imports by layer.
- Configure Jest with path aliases and moduleNameMapper for clean test imports.
- Provide in-memory fakes for repositories and location provider to support fast unit/integration tests.

### Operational persistence and state management (in-depth)

This section covers how data is persisted during recording, what states we track, fault handling (GPS loss, battery death), and how data is stored and retrieved.

#### Storage technology and approach
- **Primary store**: SQLite (e.g., `react-native-sqlite-storage` or `expo-sqlite`). Rationale: append-heavy writes, atomic transactions, queryable history, and reliability under app crashes/OS kills.
- **Fast key-value checkpoints (optional)**: `react-native-mmkv` for small, frequently updated flags (e.g., `activeTripId`, `lastCheckpoint`). Not required if SQLite writes are per-fix.
- **Write strategy**: Append on every accepted location fix inside a short transaction to guarantee durability and consistency. Favor safety over batching. Optionally batch every 2–3 fixes if profiling shows OK battery/IO tradeoffs.

#### Data schema (initial)
```
trips (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,                 -- 'active' | 'completed' | 'abandoned'
  startAt INTEGER NOT NULL,             -- ms epoch
  startLat REAL NOT NULL,
  startLon REAL NOT NULL,
  endAt INTEGER,                        -- ms epoch
  endLat REAL,
  endLon REAL,
  distanceMeters REAL NOT NULL DEFAULT 0,
  title TEXT,
  notes TEXT,
  appliedRoutineId TEXT,
  lastFixAt INTEGER,                    -- ms epoch of last accepted fix
  totalFixes INTEGER NOT NULL DEFAULT 0
);

trip_fixes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tripId TEXT NOT NULL,
  ts INTEGER NOT NULL,                  -- ms epoch
  lat REAL NOT NULL,
  lon REAL NOT NULL,
  accuracy REAL NOT NULL,               -- meters
  speedMps REAL,                        -- optional, computed
  source TEXT,                          -- 'gps' | 'sig' | 'manual'
  FOREIGN KEY(tripId) REFERENCES trips(id)
);

templates (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  notes TEXT,
  category TEXT
);

CREATE INDEX IF NOT EXISTS idx_trip_fixes_trip_ts ON trip_fixes(tripId, ts);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
```

#### States to track (app- and trip-level)
- **App/global** (persisted): `activeTripId`, `lastAppVersionMigrated`.
- **Trip** (persisted): `status`, `startAt`, `startLat/Lon`, `lastFixAt`, `distanceMeters`, `totalFixes`.
- **Controller/ephemeral** (memory only): current filtered fix buffer, computed live speed, UI state machine.

UI/logic state machine (persisted `status` where relevant):
- `idle` → `arming` (await first valid fix) → `tracking` → (`signal_lost` transient) → `stopping` → `details` → `idle`
- `recovering`: on cold start if `activeTripId` exists.

#### In-flight persistence flow
1. On Start:
   - Create `trips` row with `status='active'` at first valid fix; store `start*`, set `activeTripId`.
2. On each accepted fix:
   - Insert into `trip_fixes`.
   - Recompute incremental distance and update `trips.distanceMeters`, `lastFixAt`, `end*` preview (last coords), `totalFixes += 1` in the same transaction.
3. On Stop:
   - Finalize `endAt/endLat/endLon`, keep final `distanceMeters`, set `status='completed'`, clear `activeTripId`.
4. On Abandon/Crash Recovery:
   - On app launch, if `activeTripId` exists with `status='active'`, enter `recovering`. Offer Resume or Stop-and-save.

#### Handling GPS signal loss
- Detect loss when no accepted fix for N seconds (e.g., 20–60s) or only high-accuracy fixes arrive (`accuracy > 50m`).
- Transition to `signal_lost` UI hint; continue recording session without adding distance.
- On first fix after loss, apply conservative re-entry filter: ignore the first point if it implies unrealistic speed or accuracy; then resume normal accumulation.
- Never estimate distance during gaps; distance only from measured segments.

#### Battery dying / OS kill mid-journey
- Because we write on every accepted fix and checkpoint `distanceMeters` and `lastFixAt`, data loss is limited to the last in-flight fix (at most one point).
- On next launch, detect `activeTripId` and show recovery prompt: Resume or Stop-and-save with last known end point/time.
- Optional auto-finalize: if `lastFixAt` is older than a threshold (e.g., 2 hours), mark trip as `completed` on launch and label as "auto-stopped (device off)".

#### User forgets to tap STOP
- Soft auto-stop heuristic:
  - If speed ≈ 0 and no significant movement for 10–15 minutes, send a local notification: "Still recording—stop trip?" with actions.
  - If no response and no movement for a longer window (e.g., 45–60 minutes), auto-stop with a flag `autoStopped=true` so the user can review.
- Foreground-only MVP: instead of auto-stop, keep screen on and show prominent banner; still send notification if backgrounded briefly.
- All prompts/auto-stops are implemented in Controller using `LocationProvider` and `NotificationsService` abstractions for testability.

#### Where data is stored and how it’s retrieved
- All trip data and fixes live in SQLite. Templates live in SQLite.
- Repositories hide SQL behind interfaces:
  - `TripRepository`:
    - `getActive(): Promise<Trip | null>`
    - `create(trip: Trip): Promise<Trip>`
    - `update(trip: Trip): Promise<Trip>`
    - `list({ limit, offset, from, to }): Promise<Trip[]>`
  - `TripFixesRepository` (can be merged into TripRepository for simplicity):
    - `appendFix(tripId, fix)`
    - `listByTrip(tripId): Promise<Fix[]>`
  - `TemplateRepository`: CRUD for templates.
- Common queries:
  - Home: `getActive()` to resume state; `distanceMeters` for live counter.
  - History: `list()` ordered by `startAt DESC`.
  - Details: load by `id`; fixes optional (MVP may omit route rendering).

#### Testing the persistence and recovery
- Unit: pure distance/filtering functions with synthetic tracks.
- Contract: run the same TripRepository test suite against the SQLite implementation and an in-memory fake.
- Integration: simulate recording with fake `LocationProvider`, crash (no `stop()` call), relaunch, and ensure recovery path works and data is intact.
- Edge: long GPS gaps, first-fix after gap spike, duplicate timestamps, very bad accuracy.
