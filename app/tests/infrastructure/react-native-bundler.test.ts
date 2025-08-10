/**
 * React Native Bundler Test
 * 
 * This test verifies that Metro bundler can properly handle TypeScript files
 * with path aliases in a React Native environment. This is critical for ensuring
 * our app can actually run in the simulator.
 */

import path from 'path';
import fs from 'fs';

describe('React Native Metro Bundler Configuration', () => {
  const metroConfigPath = path.resolve(__dirname, '../../../metro.config.js');
  
  it('should have Metro config file that exists', () => {
    expect(fs.existsSync(metroConfigPath)).toBe(true);
  });

  it('should have Babel config with module resolver', () => {
    const babelConfigPath = path.resolve(__dirname, '../../../babel.config.js');
    expect(fs.existsSync(babelConfigPath)).toBe(true);
    
    const babelConfig = require(babelConfigPath);
    expect(babelConfig.plugins).toBeDefined();
    
    // Find module-resolver plugin
    const moduleResolverPlugin = babelConfig.plugins.find((plugin: any) => 
      Array.isArray(plugin) && plugin[0] === 'module-resolver'
    );
    expect(moduleResolverPlugin).toBeDefined();
    
    // Verify alias configuration in Babel
    const [, pluginConfig] = moduleResolverPlugin;
    expect(pluginConfig.alias).toBeDefined();
    expect(pluginConfig.alias['@models']).toBeDefined();
    expect(pluginConfig.alias['@services']).toBeDefined();
  });

  it('should have TypeScript files that use path aliases', () => {
    // Verify key files exist and use path aliases
    const appTsxPath = path.resolve(__dirname, '../../App.tsx');
    expect(fs.existsSync(appTsxPath)).toBe(true);
    
    const appContent = fs.readFileSync(appTsxPath, 'utf8');
    expect(appContent).toMatch(/@views\//);
    expect(appContent).toMatch(/@controllers\//);
    expect(appContent).toMatch(/@services\//);
  });

  it('should have correct source extensions for TypeScript', () => {
    const metroConfig = require(metroConfigPath);
    const sourceExts = metroConfig.resolver?.sourceExts || [];
    
    expect(sourceExts).toContain('ts');
    expect(sourceExts).toContain('tsx');
    expect(sourceExts).toContain('js');
    expect(sourceExts).toContain('jsx');
  });

  it('should validate that all path alias targets exist', () => {
    const metroConfig = require(metroConfigPath);
    const aliases = metroConfig.resolver?.alias || {};
    
    Object.entries(aliases).forEach(([aliasKey, aliasPath]) => {
      const exists = fs.existsSync(aliasPath as string);
      if (exists) {
        console.log(`✅ ${aliasKey} -> ${aliasPath}`);
      } else {
        console.log(`❌ ${aliasKey} -> ${aliasPath} (NOT FOUND)`);
      }
      expect(exists).toBe(true);
    });
  });
});