# Change Log

All notable changes to the "apex-f" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.1.0] - 2025-05-26
### Added
- Initial release of Apex F — a lightweight Apex code formatter for VS Code.
- Shortcut integration (`Cmd+Option+F` / `Ctrl+Alt+F`) for instant code formatting.
- Automatic indentation based on nesting level.
- Smart brace alignment and block expansion (e.g., `if (...) { ... }` → multiline).
- Clean handling of control flow constructs: `if`, `else`, `for`, `while`, `do`, `try/catch/finally`.
- Whitespace normalization around operators (`=`, `+`, `:`), excluding safe cases (e.g., `i++`, `https:`).
- Block separation between class members and methods.
- Special handling of annotations (e.g., `@future` formatting).
- Preservation of string literals (e.g., `String json = '{...}';`) without formatting.
- Inline list formatting (e.g., `new List<Account> { ... }` → expanded form).

### Fixed
- Prevented formatting inside `for (...)` clauses to avoid line breaks and operator corruption.
- Resolved unwanted line breaks in multi-level control structures.