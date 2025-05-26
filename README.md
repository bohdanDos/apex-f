# Apex F — Format Apex Code Instantly 🧼⚡

**Apex F** is a fast, opinionated Apex code formatter for Visual Studio Code, designed to keep your code clean, readable, and consistent — all at the press of a shortcut.

---

## ✨ Features

- 🔨 Format Apex code instantly with `Cmd+Option+F` / `Ctrl+Alt+F`
- 🎯 Auto-indents based on nesting level
- 🧠 Smart block expansion (`if (...) { ... }` → multiline)
- 🎯 Consistent whitespace around `=`, `+`, `:` (with context-aware exceptions)
- 🧩 Preserves string literals and Salesforce-style JSON blobs
- 💡 Special formatting for:
  - `if / else if / else`
  - `try / catch / finally`
  - `for / while / do`
  - annotations like `@future`, `@isTest`, etc.
- 🧹 Cleans up unnecessary blank lines, trailing spaces, and inline chaos
- 📑 Formats inline lists:  
  `new List<Account> { a, b, c }` → nicely aligned and readable

---

## 🚀 Usage

1. Open any `.cls` file (or Apex content).
2. Press your shortcut:
   - `Cmd + Option + F` (Mac)
   - `Ctrl + Alt + F` (Windows/Linux)
3. Done. Your code is clean, honored, and respected.

---

## 📸 Preview

_coming soon_ – animated formatting preview

---

## ⚙️ Requirements

- VS Code 1.85+
- Salesforce Apex language support (usually comes with Salesforce Extension Pack)

---

## 🧪 Extension Settings

_No additional settings needed — works out of the box._

---

## 🚧 Known Issues

- Complex multi-line string blocks (`'''`) are not formatted — and are preserved as-is.
- Some deeply nested constructs may be formatted conservatively.

---

## 📝 Release Notes

See [CHANGELOG.md](./CHANGELOG.md) for full history.

---

## 💙 Inspired by

- Prettier (for the experience)
- Salesforce CLI devs who’ve seen too much ugly code
- Developers who hit `F` to pay respect to bad indentation

---

**Enjoy using Apex F — because you deserve a clean class.**
