# Publishing to NPM

## Prerequisites

1. **NPM Account**: Create one at https://www.npmjs.com/signup
2. **NPM CLI**: Comes with Node.js installation
3. **Git Repository**: Recommended for version control

## Step-by-Step Publishing Guide

### 1. Login to NPM

```bash
npm login
```

Enter your:
- Username
- Password
- Email
- One-time password (if 2FA is enabled)

Verify login:
```bash
npm whoami
```

### 2. Update Package Information

Edit `package.json` and update:

```json
{
  "name": "openclaw-splunk-logger",
  "version": "1.0.0",
  "description": "OpenClaw hook for logging to Splunk",
  "author": "Your Name <your.email@example.com>",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/openclaw-splunk-logger.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/openclaw-splunk-logger/issues"
  },
  "homepage": "https://github.com/yourusername/openclaw-splunk-logger#readme"
}
```

### 3. Build the Package

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### 4. Test the Package Locally (Optional)

```bash
# Create a tarball
npm pack

# This creates openclaw-splunk-logger-1.0.0.tgz
# Test install it locally:
npm install ./openclaw-splunk-logger-1.0.0.tgz
```

### 5. Publish to NPM

```bash
# Dry run to see what will be published
npm publish --dry-run

# Actually publish
npm publish
```

If the package name is already taken, you can publish under a scope:

```bash
# Update package.json name to "@yourname/openclaw-splunk-logger"
npm publish --access public
```

### 6. Verify Publication

Visit: `https://www.npmjs.com/package/openclaw-splunk-logger`

## Updating the Package

### 1. Make Your Changes

Edit code, update documentation, etc.

### 2. Update Version

```bash
# Patch release (1.0.0 -> 1.0.1) - bug fixes
npm version patch

# Minor release (1.0.0 -> 1.1.0) - new features
npm version minor

# Major release (1.0.0 -> 2.0.0) - breaking changes
npm version major
```

This automatically:
- Updates `package.json` version
- Creates a git commit
- Creates a git tag

### 3. Rebuild and Publish

```bash
npm run build
npm publish
```

### 4. Push to Git

```bash
git push
git push --tags
```

## Best Practices

### 1. Use Semantic Versioning

- **MAJOR** (1.0.0 -> 2.0.0): Breaking changes
- **MINOR** (1.0.0 -> 1.1.0): New features, backward compatible
- **PATCH** (1.0.0 -> 1.0.1): Bug fixes

### 2. Keep README Updated

Ensure README.md has:
- Clear installation instructions
- Usage examples
- Configuration options
- License information

### 3. Add a CHANGELOG.md

```markdown
# Changelog

## [1.0.0] - 2024-01-16
### Added
- Initial release
- Support for all OpenClaw events
- Splunk HEC integration
```

### 4. Test Before Publishing

```bash
# Run tests if you have them
npm test

# Check for issues
npm run build
```

### 5. Use .npmignore

Already created, but ensure it excludes:
- Source files (`src/`)
- Tests
- Development configs
- `.git` directory

## Troubleshooting

### "Package name already exists"

Use a scoped package:
```bash
# In package.json, change name to:
"name": "@yourusername/openclaw-splunk-logger"

# Publish with:
npm publish --access public
```

### "You must verify your email"

Check your email and verify your NPM account.

### "You need to authorize this machine"

Enable 2FA on your NPM account and use an authentication token:
```bash
npm login --auth-type=legacy
```

### "Permission denied"

Make sure you're logged in:
```bash
npm whoami
npm login
```

## Unpublishing (Use with Caution)

```bash
# Unpublish a specific version (within 72 hours)
npm unpublish openclaw-splunk-logger@1.0.0

# Unpublish entire package (within 72 hours, if no other versions)
npm unpublish openclaw-splunk-logger --force
```

⚠️ **Warning**: Unpublishing is permanent and can break dependent projects!

## Making the Package Private

If you want to keep it private initially:

```json
{
  "private": true
}
```

Remove this field when ready to publish publicly.

## Quick Checklist

- [ ] NPM account created and verified
- [ ] Logged in via `npm login`
- [ ] Package name is unique (check npmjs.com)
- [ ] Version number is correct
- [ ] Author and repository info updated
- [ ] README.md is complete
- [ ] Code is built (`npm run build`)
- [ ] Tested locally
- [ ] `npm publish --dry-run` looks good
- [ ] Published with `npm publish`
- [ ] Verified on npmjs.com

## After Publishing

Users can install your hook with:

```bash
# Install from NPM
openclaw hooks install openclaw-splunk-logger

# Or with a specific version
openclaw hooks install openclaw-splunk-logger@1.0.0

# Enable the hook
openclaw hooks enable splunk-logger
```
