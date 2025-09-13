# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a WordPress plugin that provides a dynamic form builder block for the WordPress block editor (Gutenberg). The plugin creates custom blocks for building forms with advanced field types and validation capabilities.

## Development Commands

### Build and Development
- `npm run start` - Start development mode with watch mode and hot reloading
- `npm run build` - Build production files with webpack, copy PHP files, and generate blocks manifest

### Code Quality
- `npm run lint:js` - Lint JavaScript/JSX files
- `npm run lint:css` - Lint CSS/SCSS files  
- `npm run format` - Format code using wp-scripts formatter

### Maintenance
- `npm run packages-update` - Update WordPress packages
- `npm run plugin-zip` - Create a distributable zip file of the plugin

## Architecture

### WordPress Block Structure
The plugin follows WordPress block development standards using `@wordpress/scripts`:

- **Block Registration**: Uses modern WordPress 6.7+ block registration APIs with `blocks-manifest.php` for improved performance
- **Block Metadata**: Defined in `block.json` files following the WordPress block.json schema
- **Dynamic Rendering**: Server-side rendering via PHP render files for dynamic content

### File Structure
- `src/form-builder-block/` - Source files for the main block
  - `block.json` - Block metadata and configuration
  - `index.js` - Block registration and editor setup
  - `edit.js` - Block editor component (React)
  - `view.js` - Frontend JavaScript (currently placeholder)
  - `render.php` - Server-side rendering template
  - `*.scss` - Styling for editor and frontend
- `build/` - Compiled/built files (auto-generated)
- `form-builder-block.php` - Main plugin file with WordPress hooks

### Block Development Pattern
- Follows WordPress Block API version 3
- Uses React for the block editor interface
- Implements dynamic blocks with server-side rendering
- Utilizes WordPress i18n for internationalization
- Uses SCSS for styling with separate editor and frontend styles

### WordPress Integration
- Compatible with WordPress 6.7+, PHP 7.4+
- Uses WordPress coding standards (tabs for indentation, specific formatting)
- Integrates with WordPress block editor ecosystem
- Follows WordPress plugin development best practices