# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native travel app MVP for manual trip tracking with distance calculation, routine trip templates, and comprehensive persistence. **Backend architecture is production-ready with 54 tests passing. React Native UI is now functional with working iOS setup.**

## Development Commands

```bash
# Testing
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode  
npm run test:coverage   # Run with coverage report

# Code Quality
npm run typecheck       # TypeScript type checking
npm run lint           # ESLint code analysis

# iOS Development (Run Metro in separate terminal)
npx react-native start  # Start Metro bundler (run in separate terminal window)
npx react-native run-ios --simulator="iPhone 15"  # Build and run iOS app
```

## Architecture Status

### ✅ **Completed (Production Ready)**
- **Domain Logic**: Distance calculation with Haversine formula, GPS filtering, trip state machine
- **Controllers**: TripRecorder with full state management (idle→arming→tracking→stopping)  
- **Persistence**: SQLite repositories with migration system and transaction safety
- **Testing**: Comprehensive TDD infrastructure with contract tests ensuring implementation consistency
- **React Native Setup**: iOS development environment configured and working
- **UI Foundation**: React Native Paper integrated with SafeAreaProvider

### 🔲 **Next Phase: Full Travel App UI**
- Restore complete travel app functionality from minimal test app
- Integrate TripRecorder with React Native UI components
- Implement LocationProvider using react-native-geolocation-service  
- Build full UI screens (Home with GO/STOP, Trip Details, History)
- Add platform-specific permissions (iOS/Android)

## Architecture (MVC + Repository Pattern)

```
app/
  models/           # Domain entities, use-cases, repository interfaces
    entities/       # Trip, RoutineTripTemplate  
    use-cases/      # computeDistance, filterFixes
    repositories/   # TripRepository, TemplateRepository, TripFixesRepository
  controllers/      # TripRecorder (orchestrates business logic)
  services/         # Platform adapters (LocationProvider, PermissionsService)
    storage/sqlite/ # SQLite implementations with migrations
  views/           # React Native UI components (TO BE IMPLEMENTED)
  tests/           # Contract tests, fakes, domain logic tests
```

## Key Files

- `app/controllers/TripRecorder.ts` - Core trip recording state machine
- `app/models/use-cases/ComputeDistance.ts` - Haversine distance calculation
- `app/services/storage/sqlite/SQLiteDatabase.ts` - Database wrapper with migrations
- `app/tests/contracts/` - Repository contract tests ensuring consistency
- `PROJECT_STATUS.md` - Detailed status and remaining work

## Development Notes

- All repository implementations must pass contract tests in `app/tests/contracts/`
- Use dependency injection pattern - controllers accept repository interfaces
- SQLite migration system handles schema changes automatically
- Path aliases configured: `@models/*`, `@services/*`, `@controllers/*`, `@views/*`, `@tests/*`

## React Native iOS Setup (Critical Configuration)

### Version Requirements
- **React Native**: 0.80.2
- **React**: ^19.1.0 (CRITICAL: RN 0.80.2 requires React 19, not 18)
- **Node.js**: Compatible with RN 0.80.2

### Required Dependencies
```bash
npm install react@^19.1.0 --legacy-peer-deps
npm install react-native-safe-area-context --legacy-peer-deps
```

### iOS Native Dependencies
```bash
cd ios && pod install
```

### Troubleshooting iOS Issues

#### Metro Bundler Issues
- Always run Metro in separate terminal: `npx react-native start`
- Clear cache when needed: `npx react-native start --reset-cache`

#### Xcode Build Failures ("PIF transfer session" errors)
```bash
# Complete cleanup sequence:
killall Xcode                                           # Close Xcode
rm -rf ios/build                                        # Remove build artifacts
cd ios && xcodebuild clean -workspace TravelApp.xcworkspace -scheme TravelApp  # Clean workspace
pod deintegrate && pod install                          # Rebuild CocoaPods
cd .. && rm -rf ~/Library/Developer/Xcode/DerivedData  # Clear derived data
```

#### Import/Module Resolution Issues
- Use relative imports for test fakes: `'./tests/fakes'` instead of `'@tests/fakes'`
- Ensure all exports are present in `app/tests/fakes/index.ts`
- For dynamic imports, prefer static imports in React Native

### Current App State
- **index.js**: Contains minimal working React Native Paper app with SafeAreaProvider
- **app/App.tsx**: Renamed to `app/App-broken.tsx` (contains complex travel app logic)
- **Metro**: Working with proper React 19 compatibility
- **iOS Build**: Clean and functional