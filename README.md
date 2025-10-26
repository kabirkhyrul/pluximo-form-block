# Pluximo Form Blocks

[![WordPress Plugin Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/kabirkhyrul/pluximo-form-blocks)
[![WordPress](https://img.shields.io/badge/WordPress-6.7%2B-blue.svg)](https://wordpress.org/)
[![PHP Version](https://img.shields.io/badge/PHP-7.4%2B-purple.svg)](https://php.net/)
[![License](https://img.shields.io/badge/license-GPL--2.0--or--later-green.svg)](https://www.gnu.org/licenses/gpl-2.0.html)

A dynamic form builder block for the WordPress block editor with advanced field types and validation capabilities. Build professional forms directly in the Gutenberg editor without leaving your content creation workflow.

## Features

### Native Block Editor Integration

- Build forms using familiar WordPress blocks
- Drag-and-drop form fields like any other block
- Live preview of exactly how forms will look
- No separate form builder interface to learn

### Advanced Field Types & Validation

- **Text Input Block** - Support for email, URL, phone, password, and text types
- **Textarea Block** - Multi-line input fields for longer responses
- Real-time client-side validation with custom error messages
- Required fields, character limits, and regex pattern validation
- Custom validation messages per field

### Enterprise-Grade Security

- Built-in spam protection with IP-based rate limiting
- WordPress nonce verification for all submissions
- Smart throttling to prevent DoS attacks
- Secure REST API endpoints for form processing

### Streamlined Form Management

- Form entries stored as WordPress custom posts
- View submissions directly in WordPress admin
- Export data using standard WordPress tools
- Clean, organized entry management interface

### Professional Styling

- Built with Tailwind CSS v4 for modern designs
- Automatically adapts to your theme
- Responsive forms that work on all devices
- Customizable success/error messages

## Installation

### From WordPress Admin

1. Go to **Plugins → Add New**
2. Search for "Pluximo Form Blocks"
3. Click **Install Now**, then **Activate**

### Manual Installation

1. Download the plugin zip file
2. Upload to `/wp-content/plugins/pluximo-form-blocks/`
3. Extract the files
4. Activate through the **Plugins** screen in WordPress

### Quick Start

1. Edit any page/post in the block editor
2. Add the **Form Wrapper** block
3. Add **Text Input** and **Textarea** blocks inside the wrapper
4. Configure validation rules and messages in block settings
5. Publish and start receiving submissions

## Usage

### Creating a Contact Form

```plaintext
1. Add "Form Wrapper" block to your page
2. Inside the wrapper, add field blocks:
   - Text Input (Name) - mark as required
   - Text Input (Email) - set type to "email", mark as required
   - Textarea (Message) - set minimum length
3. Configure success/error messages in Form Wrapper settings
4. Publish your page
```

### Viewing Form Submissions

- Navigate to **Form Entries** in your WordPress admin dashboard
- View detailed submission information
- Export data using WordPress export tools

## Development

### Prerequisites

- WordPress 6.7 or higher
- PHP 7.4 or higher
- Node.js 18+ and npm (or Bun)
- Composer

### Setup Development Environment

```bash
# Clone the repository
git clone https://github.com/kabirkhyrul/pluximo-form-blocks.git
git config user.email kabir.signup@gmail.com
git config user.name "Kabir Khyrul"
cd pluximo-form-blocks

# Install PHP dependencies
composer install

# Install JavaScript dependencies
npm install
# or using Bun
bun install

# Start development build with watch mode
npm run start
# or
bun run start
```

### Available Scripts

#### JavaScript/Build Scripts

```bash
npm run start         # Development build with watch mode
npm run build         # Production build
npm run format        # Format code with Prettier
npm run lint:css      # Lint CSS/SCSS files
npm run lint:js       # Lint JavaScript files
npm run plugin-zip    # Create distributable plugin zip
```

#### PHP Quality Scripts

```bash
composer lint         # Run PHP CodeSniffer
composer fix          # Auto-fix PHP coding standards
composer phpmd        # Run PHP Mess Detector
composer quality      # Run all quality checks
```

### Project Structure

```bash
pluximo-form-blocks/
├── src/                          # Source files for blocks
│   ├── form-wrapper/            # Form container block
│   ├── text-input/              # Text input field block
│   └── textarea/                # Textarea field block
├── includes/                     # PHP backend classes
│   ├── class-pluximo-form-blocks-handler.php
│   ├── class-pluximo-form-blocks-validator.php
│   ├── class-pluximo-form-blocks-post-type.php
│   └── ...
├── build/                        # Compiled assets (generated)
├── vendor/                       # PHP dependencies
├── node_modules/                 # Node dependencies
├── pluximo-form-blocks.php       # Main plugin file
├── constants.php                 # Plugin constants
├── autoloader.php               # Class autoloader
└── uninstall.php                # Cleanup on uninstall
```

## Technical Stack

### Frontend

- **React** - Block editor components
- **WordPress Block API v3** - Modern block development
- **Tailwind CSS v4** - Utility-first styling
- **Lucide React** - Icon library
- **PostCSS** - CSS processing

### Backend

- **WordPress REST API** - Form submission handling
- **Custom Post Types** - Form entry storage
- **WordPress Nonce** - Security verification
- **Rate Limiting** - Spam protection

### Build Tools

- **@wordpress/scripts** - Official WordPress build tooling
- **Webpack** - Module bundling
- **Babel** - JavaScript transpilation

### Code Quality

- **PHP_CodeSniffer** - WordPress coding standards
- **PHPMD** - PHP Mess Detector
- **ESLint** - JavaScript linting
- **Stylelint** - CSS/SCSS linting

## Requirements

- **WordPress:** 6.7 or higher
- **PHP:** 7.4 or higher
- **Node.js:** 18+ (for development)
- **Browser Support:** Modern browsers (Chrome, Firefox, Safari, Edge)

## Security Features

- IP-based rate limiting to prevent spam
- WordPress nonce verification on all form submissions
- Secure REST API endpoints with proper authentication
- Server-side validation for all submitted data
- Pattern-based validation for email, URL, and phone fields
- XSS protection through WordPress sanitization functions

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow [WordPress PHP Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/php/)
- Follow [WordPress JavaScript Coding Standards](https://developer.wordpress.org/coding-standards/wordpress-coding-standards/javascript/)
- Run `composer quality` before submitting PRs
- Run `npm run lint:js` and `npm run lint:css` for frontend code

## License

This project is licensed under the GPL-2.0-or-later License - see the [LICENSE](https://www.gnu.org/licenses/gpl-2.0.html) file for details.

## Author

**Pluximo**

## Links

- [GitHub Repository](https://github.com/kabirkhyrul/pluximo-form-blocks)
- [WordPress Plugin Directory](https://wordpress.org/plugins/pluximo-form-blocks/) (coming soon)
- [Issue Tracker](https://github.com/kabirkhyrul/pluximo-form-blocks/issues)

## Changelog

### 1.0.0 - Initial Release

- Form Wrapper block for creating form containers
- Text Input block with email, URL, tel, password, and text types
- Textarea block for multi-line input
- Advanced validation system (required, min/max length, regex patterns)
- Real-time client-side validation with custom error messages
- Secure REST API endpoints for form processing
- Custom post type for form entry storage
- IP-based spam protection and rate limiting
- WordPress nonce security verification
- Tailwind CSS integration for professional styling
- Responsive design that works on all devices
- Translation-ready with proper internationalization

---

Made with ❤️ for the WordPress community
