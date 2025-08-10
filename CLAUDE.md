# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React Native travel app MVP for manual trip tracking with distance calculation, routine trip templates, and comprehensive persistence. **Backend architecture is production-ready with 54 tests passing.**

## Development Commands

```bash
# Testing
npm test                 # Run all tests
npm run test:watch      # Run tests in watch mode  
npm run test:coverage   # Run with coverage report

# Code Quality
npm run typecheck       # TypeScript type checking
npm run lint           # ESLint code analysis
```

## Architecture Status

### ✅ **Completed (Production Ready)**
- **Domain Logic**: Distance calculation with Haversine formula, GPS filtering, trip state machine
- **Controllers**: TripRecorder with full state management (idle→arming→tracking→stopping)  
- **Persistence**: SQLite repositories with migration system and transaction safety
- **Testing**: Comprehensive TDD infrastructure with contract tests ensuring implementation consistency

### 🔲 **Next Phase: React Native UI**
- Initialize React Native project structure
- Implement LocationProvider using react-native-geolocation-service
- Build UI screens (Home with GO/STOP, Trip Details, History)
- Platform-specific permissions (iOS/Android)

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