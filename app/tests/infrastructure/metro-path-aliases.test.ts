/**
 * Metro Path Alias Resolution Tests
 * 
 * These tests verify that Metro bundler can correctly resolve TypeScript path aliases
 * like @models/*, @services/*, etc. This ensures our clean architecture is maintained.
 */

import path from 'path';

describe('Metro Path Alias Resolution', () => {
  const metroConfig = require('../../../metro.config.js');
  
  it('should have Metro config with path aliases defined', () => {
    expect(metroConfig).toBeDefined();
    expect(metroConfig.resolver).toBeDefined();
    expect(metroConfig.resolver.alias).toBeDefined();
  });

  it('should resolve @models path alias correctly', () => {
    const alias = metroConfig.resolver.alias['@models'];
    expect(alias).toBeDefined();
    expect(alias).toContain('app/models');
    
    // Verify the path exists
    const fs = require('fs');
    expect(fs.existsSync(alias)).toBe(true);
  });

  it('should resolve @services path alias correctly', () => {
    const alias = metroConfig.resolver.alias['@services'];
    expect(alias).toBeDefined();
    expect(alias).toContain('app/services');
    
    // Verify the path exists
    const fs = require('fs');
    expect(fs.existsSync(alias)).toBe(true);
  });

  it('should resolve @controllers path alias correctly', () => {
    const alias = metroConfig.resolver.alias['@controllers'];
    expect(alias).toBeDefined();
    expect(alias).toContain('app/controllers');
    
    // Verify the path exists  
    const fs = require('fs');
    expect(fs.existsSync(alias)).toBe(true);
  });

  it('should resolve @views path alias correctly', () => {
    const alias = metroConfig.resolver.alias['@views'];
    expect(alias).toBeDefined();
    expect(alias).toContain('app/views');
    
    // Verify the path exists
    const fs = require('fs');
    expect(fs.existsSync(alias)).toBe(true);
  });

  it('should include TypeScript file extensions', () => {
    expect(metroConfig.resolver.sourceExts).toContain('ts');
    expect(metroConfig.resolver.sourceExts).toContain('tsx');
    expect(metroConfig.resolver.sourceExts).toContain('js');
    expect(metroConfig.resolver.sourceExts).toContain('jsx');
  });

  it('should resolve specific module paths that exist in the project', () => {
    const fs = require('fs');
    const rootDir = path.resolve(__dirname, '../../../');
    
    // Test specific modules that should exist
    const testPaths = [
      path.join(metroConfig.resolver.alias['@models'], 'entities/Trip.ts'),
      path.join(metroConfig.resolver.alias['@services'], 'location/LocationProvider.ts'),
      path.join(metroConfig.resolver.alias['@controllers'], 'TripRecorder.ts'),
      path.join(metroConfig.resolver.alias['@views'], 'HomeScreen.tsx')
    ];

    testPaths.forEach(testPath => {
      expect(fs.existsSync(testPath)).toBe(true);
    });
  });
});