# Form Builder Block

A dynamic WordPress block for creating and managing forms with advanced field types and validation.

## Description

This WordPress plugin provides a custom block for the Gutenberg editor that allows users to build dynamic forms with various field types and validation options. The block uses modern WordPress development practices and APIs for optimal performance and compatibility.

## Requirements

- WordPress 6.7 or higher
- PHP 7.4 or higher
- Node.js (for development)

## Installation

1. Upload the plugin files to `/wp-content/plugins/form-builder-block/`
2. Activate the plugin through the WordPress admin interface
3. The Form Builder Block will be available in the block editor under the Widgets category

## Development

### Prerequisites

- Node.js and bun installed
- WordPress development environment

### Setup

1. Clone or download the plugin to your WordPress plugins directory
2. Navigate to the plugin directory:

   ```bash
   cd wp-content/plugins/form-builder-block
   git config user.email "kabir.signup@gmail.com"
   git config user.name "Kabir Khyrul"
   ```

3. Install dependencies:

   ```bash
   bun install
   ```

### Development Commands

#### Building and Development

```bash
# Start development mode with watch and hot reloading
bun run start

# Build production files
bun run build
```

#### Code Quality

```bash
# Lint JavaScript files
bun run lint:js

# Lint CSS/SCSS files
bun run lint:css

# Format code
bun run format
```

#### Maintenance

```bash
# Update WordPress packages
bun run packages-update

# Create plugin zip for distribution
bun run plugin-zip
```

### Development Workflow

1. Run `bun run start` to begin development
2. Make changes to files in the `src/` directory
3. The build process will automatically compile and copy files to `build/`
4. Test your changes in a WordPress environment
5. Run linting and formatting before committing changes

### File Structure

```bash
form-builder-block/
├── src/form-builder-block/     # Source files
│   ├── block.json             # Block metadata
│   ├── index.js               # Block registration
│   ├── edit.js                # Editor component
│   ├── view.js                # Frontend JavaScript
│   ├── render.php             # Server-side rendering
│   └── *.scss                 # Styles
├── build/                     # Compiled files (auto-generated)
├── form-builder-block.php     # Main plugin file
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

### Block Development

This plugin follows WordPress block development best practices:

- Uses WordPress Block API version 3
- Implements dynamic blocks with server-side rendering
- Follows WordPress coding standards
- Uses React for the block editor interface
- Implements proper internationalization (i18n)

### Contributing

1. Follow WordPress coding standards
2. Use tabs for indentation (as defined in `.editorconfig`)
3. Run linting and formatting tools before submitting changes
4. Test in multiple WordPress environments when possible

## License

GPL-2.0-or-later

## Support

For issues and feature requests, please refer to the plugin documentation or WordPress support forums.
