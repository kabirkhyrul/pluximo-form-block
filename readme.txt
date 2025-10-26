=== Pluximo Form Blocks ===
Contributors:      pluximo
Tags:              form, contact, validation, blocks, block
Tested up to:      6.8
Stable tag:        1.0.0
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html
Requires at least: 6.7
Requires PHP:      7.4

Stop struggling with complex form plugins. Build professional forms directly in WordPress block editor with advanced validation and spam protection.

== Description ==

**Tired of complicated form plugins that require separate interfaces?** Pluximo Form Blocks solves the frustration of managing forms outside your content editor. Build forms where you write - directly in WordPress.

= The Problem This Plugin Solves =

**WordPress form building is broken:**
* Most form plugins force you to leave the block editor to build forms
* Complex interfaces that don't match WordPress's modern editing experience
* Heavy plugins that slow down your site with unnecessary features
* Forms that look outdated and don't match your theme
* Weak validation that lets bad data through
* No built-in spam protection leads to inbox flooding
* Form entries scattered across different admin screens

**Pluximo Form Blocks fixes these pain points** by bringing form creation directly into the WordPress block editor with professional-grade features.

= What You Get =

**Native Block Editor Integration**
* Build forms using familiar WordPress blocks
* Drag-and-drop form fields like any other block
* Live preview of exactly how forms will look
* No separate form builder interface to learn

**Advanced Field Types & Validation**
* Text inputs with email, URL, phone, and password types
* Multi-line textarea fields for longer responses
* Real-time validation with custom error messages
* Required fields, character limits, and regex patterns
* Client-side validation for instant feedback

**Enterprise-Grade Security**
* Built-in spam protection with IP-based rate limiting
* WordPress nonce verification for all submissions
* Smart throttling prevents DoS attacks
* Secure REST API endpoints for form processing

**Streamlined Form Management**
* Form entries stored as WordPress custom posts
* View submissions directly in WordPress admin
* Export data using standard WordPress tools
* Clean, organized entry management interface

**Professional Styling**
* Built with Tailwind CSS for modern designs
* Automatically matches your theme
* Responsive forms that work on all devices
* Customizable success/error messages

= Who Should Use This Plugin? =

**Perfect For:**

* **Content Creators** - Build forms without leaving the editor you know
* **Small Business Owners** - Create professional contact forms in minutes
* **Web Designers** - Deliver modern, responsive forms that match site designs
* **WordPress Agencies** - Provide clients with easy-to-manage form solutions
* **Bloggers** - Add newsletter signups and feedback forms seamlessly
* **Non-Profits** - Create donation requests and volunteer signup forms
* **Educational Sites** - Build application forms and feedback surveys
* **Portfolio Sites** - Add professional contact forms that convert

**Not Ideal For:**

* **E-commerce Forms** - Use WooCommerce or dedicated e-commerce plugins instead
* **Payment Processing** - This plugin doesn't handle payments (focus is on data collection)
* **Multi-Step Forms** - Currently supports single-page forms only
* **File Upload Forms** - File uploads are not supported in current version
* **Complex Conditional Logic** - Advanced branching logic not available
* **Email Marketing Integration** - No direct CRM/email service connections (yet)

= Use Cases =

**Business Forms:**
* Contact and inquiry forms
* Quote request forms  
* Customer feedback surveys
* Support ticket submissions
* Lead generation forms

**Website Forms:**
* Newsletter signup forms
* Event registration forms
* Volunteer signups
* Job application forms
* Booking requests

**Personal/Blog Forms:**
* Reader feedback forms
* Guest post submissions
* Interview requests
* Collaboration inquiries

= Technical Features =

* **WordPress Block API v3** - Future-proof block development
* **InnerBlocks Pattern** - Modular, extensible form structure
* **Modern JavaScript** - React-based editor components
* **Performance Optimized** - Loads only necessary assets
* **Security-First** - Enterprise-grade protection built-in
* **Developer Friendly** - Clean code following WordPress standards

**Source Code & Development**
* GitHub Repository: https://github.com/kabirkhyrul/pluximo-form-blocks
* Build from source with npm/bun and webpack
* Contributions welcome!

== Installation ==

**From WordPress Admin:**
1. Go to Plugins → Add New
2. Search for "Pluximo Form Blocks"
3. Click Install Now, then Activate

**Manual Installation:**
1. Download the plugin zip file
2. Upload to `/wp-content/plugins/pluximo-form-blocks/`
3. Activate through the Plugins screen

**Quick Start:**
1. Edit any page/post in block editor
2. Add "Form Wrapper" block
3. Add "Text Input" and "Textarea" blocks inside
4. Configure validation and messages
5. Publish and start receiving submissions

== Frequently Asked Questions ==

= How is this different from other form plugins? =

Unlike traditional form plugins that require separate interfaces, Pluximo Form Blocks works directly in the WordPress block editor. You build forms using familiar blocks, see exactly how they'll look, and manage everything from one place.

= Where are form submissions stored? =

All submissions are stored as WordPress custom posts in your database. View them under "Form Entries" in your admin dashboard. This makes them easy to manage, export, and integrate with other WordPress tools.

= Does it work with my theme? =

Yes! Forms are built with Tailwind CSS and designed to adapt to your theme. The styling is minimal and professional, ensuring forms look great on any well-designed WordPress site.

= Is it secure against spam? =

Absolutely. The plugin includes IP-based rate limiting, WordPress nonce verification, and smart throttling to prevent spam and abuse. All form processing uses secure REST API endpoints.

= Can I customize validation messages? =

Yes! Each field supports custom validation messages. Set your own required field messages, character limit warnings, and pattern validation feedback.

= Does it slow down my site? =

No. The plugin only loads necessary assets and uses modern WordPress performance best practices. Forms are lightweight and built for speed.

= Can I export form data? =

Yes! Since submissions are stored as WordPress posts, you can use WordPress's built-in export tools or any plugin that exports custom post types.

= Is it translation-ready? =

Yes, the plugin is fully prepared for translation with proper text domains and internationalization functions.

== Screenshots ==

1. **Building Forms** - Form Wrapper and Text Input blocks in the WordPress editor
2. **Field Configuration** - Validation options and customization panel  
3. **Live Form** - Professional-looking form on the frontend with Tailwind CSS
4. **Form Entries** - Clean admin interface for managing submissions
5. **Entry Details** - Detailed view of individual form submissions

== Changelog ==

= 1.0.0 =
* **Initial Release**
* Form Wrapper block for creating form containers
* Text Input block with email, URL, tel, password, and text types  
* Textarea block for multi-line input
* Advanced validation system (required, min/max length, regex patterns)
* Real-time client-side validation with custom error messages
* Secure REST API endpoints for form processing
* Custom post type for form entry storage
* IP-based spam protection and rate limiting
* WordPress nonce security verification
* Tailwind CSS integration for professional styling
* Responsive design that works on all devices
* Translation-ready with proper internationalization

== Upgrade Notice ==

= 1.0.0 =
Initial release. Start building professional forms directly in your WordPress block editor.