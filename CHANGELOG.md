# Change Log

All notable changes to this extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-11-30

### Added

- 🌙 **Elegant Dark Theme** - GitHub Dark-inspired styling for comfortable viewing
- ⚡ **Live Updates** - Changes reflect instantly as you type, no save required
- 🎨 **Full Syntax Highlighting** - Code blocks with GitHub Dark color scheme for 190+ programming languages
- ✅ **Task Lists** - Native checkbox rendering with proper styling
- 🔄 **Bidirectional Synchronization** - Double-click any text in preview to jump to source location
- ⌨️ **Keyboard Shortcut** - Quick access with `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac)
- 📝 **Full Markdown Support**:
  - Headers (H1-H6)
  - Bold, italic, and strikethrough text
  - Ordered and unordered lists
  - Task lists (checkboxes)
  - Links and images
  - Code blocks with syntax highlighting
  - Inline code
  - Blockquotes
  - Tables
  - Horizontal rules
- 🚀 **Performance Optimizations**:
  - Debouncing (150ms) to prevent excessive rendering
  - Content caching to avoid unnecessary updates
  - Efficient parsing with markdown-it
  - Smart updates for visible previews only
- 🎯 **Precise Navigation** - Smart text matching for accurate cursor positioning

### Technical Details

- Built with `markdown-it` - Powerful and extensible Markdown parser
- Syntax highlighting powered by `highlight.js` - Support for 190+ languages
- Task list support via `markdown-it-task-lists` plugin
- TypeScript implementation with full type safety
- Optimized rendering pipeline with debouncing and caching

### Theme Colors

The preview uses the official GitHub Dark theme colors:

- Background: `#0d1117`
- Text: `#e6edf3`
- Keywords: `#ff7b72`
- Strings: `#a5d6ff`
- Functions: `#d2a8ff`
- Variables: `#79c0ff`
- Comments: `#8b949e`

---

**Initial Release** - Enjoy your Markdown editing with a beautiful dark preview! 🌙
