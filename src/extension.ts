import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('apexF.formatDocument', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage('No active editor!');
      return;
    }

    const document = editor.document;
    const text = document.getText();
    const formatted = formatApexCode(text);

    const fullRange = new vscode.Range(
      document.positionAt(0),
      document.positionAt(text.length)
    );

    editor.edit(editBuilder => {
      editBuilder.replace(fullRange, formatted);
    });

    vscode.window.showInformationMessage('🫡 Formatted with apex F!');
  });

  context.subscriptions.push(disposable);
}

function formatApexCode(code: string): string {
  // Sort imports alphabetically
  code = code.replace(/(^import .*?;[\r\n]+)/gm, '').trimStart();
  const importLines = Array.from(code.matchAll(/^import .*?;$/gm), m => m[0]).sort();
  const importsBlock = importLines.length ? importLines.join('\n') + '\n\n' : '';

  // Extract single-line string literals that start and end with ' and end in semicolon
  const stringLiterals: string[] = [];
  code = code.replace(/'[^'\n]*?';/g, (match) => {
    const id = `___STR_LIT_${stringLiterals.length}___`;
    stringLiterals.push(match);
    return `${id}`;
  });

  let body = code
    // Normalize spacing and block openings
    .replace(/(if|else if|else|for|while|do|try|catch|finally)\s*\(/g, '$1 (')
    .replace(/\)\s*\{/g, ') {')

    // Ensure catch/finally start on a new line
    .replace(/\}\s*(catch|finally)/g, '}\n$1')

    // Split nested if statements onto new lines
    .replace(/(if\s*\([^\)]*\))\s*(if\s*\([^\)]*\))/g, '$1 {\n  $2')

    // Split inline while/do/for statements
    .replace(/(while|for|do)\s*\((.*?)\)\s*\{([^{}\n]*)\}/g, (_, kw, cond, stmt) => {
      return `${kw} (${cond}) {\n  ${stmt.trim()}\n}`;
    })

    .replace(/else\s*\{/g, 'else {')
    // Expand single-line blocks to multi-line
    .replace(/(if|else if|for|while|do|try|catch|finally)\s*\((.*?)\)\s*\{([^{}\n]*)\}/g, (_, kw, cond, stmt) => {
      return `${kw} (${cond}) {\n  ${stmt.trim()}\n}`;
    })
    // Expand single-line do-while block
    .replace(/do\s*\{([^{}\n]*)\}\s*while\s*\((.*?)\);/g, (_, body, cond) => {
      return `do {\n  ${body.trim()}\n} while (${cond});`;
    })
    // Ensure newlines between methods
    .replace(/\}\s*(public|private|protected)/g, '}\n\n$1')
    // Normalize space before {
    .replace(/([^\s])\s*\{/g, '$1 {')
    // Always newline after {
    .replace(/\{\s*(?![\r\n])/g, '{\n')
    // Always newline before }
    .replace(/([^\n])\}/g, '$1\n}')
    // Always newline after } unless followed by semicolon
    .replace(/\}(?![\r\n;])/g, '}\n')
    // Format new Class(...) initializations with nested indentation
    .replace(/new\s+\w+\s*\(([\s\S]*?)\)\s*;/g, match => {
      const classMatch = match.match(/new\s+(\w+)\s*\(/);
      const className = classMatch ? classMatch[1] : '';
      const argsMatch = match.match(/\(([\s\S]*?)\)/);
      if (!argsMatch) return match;

      const lines = argsMatch[1]
        .split(',')
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);

      if (lines.length === 0) return match;

      const maxFieldLength = Math.max(...lines.map(line => line.split('=')[0].trim().length));
      const formattedLines = lines.map((line: string) => {
        const [key, value] = line.split('=').map(s => s.trim());
        return `    ${key.padEnd(maxFieldLength)} = ${value}`;
      });

      return `new ${className}(\n${formattedLines.join(',\n')}\n  );`;
    })
    // Add newline after ; except in for(...) or after };
    .replace(/;(?![\r\n])(?<!\}\s*;)(?![^()]*\))/g, ';\n')
    // Trim trailing whitespace
    .replace(/ +$/gm, '')
    // Collapse multiple blank lines
    .replace(/\n{3,}/g, '\n\n')
    // Add newline after ),
    .replace(/\),\s*/g, '),\n')
    .replace(/(@\w+(?:\([^\)]*\))?)\s*(?=\w)/g, '$1\n')
    .replace(/\};(?![\r\n])/g, '};\n')
    .replace(/new\s+List<(\w+)>\s*\{([^}]+)\}/g, (_, type, listItems) => {
      const items = listItems.split(',').map((item: string) => item.trim()).filter(Boolean);
      const formatted = items.map((item: string) => `  ${item}`).join(',\n');
      return `new List<${type}> {\n${formatted}\n}`;
    })
    // Fix spacing around : except in http/https
    .replace(/(?<!https?):\s*/g, ' : ')
    // Normalize spacing around =
    .replace(/\s*=\s*/g, ' = ')
    // Normalize spacing around + (ignore ++/-- or inside for)
    .replace(/(?<!\+)\s*\+\s*(?!\+)(?![^()]*\))/g, ' + ')
    // Auto-indent based on nesting level
    .split('\n')
    .reduce<{ lines: string[]; level: number }>((acc, line) => {
      const trimmed = line.trim();
      if (trimmed === '') {
        acc.lines.push('');
        return acc;
      }
      if (trimmed.endsWith('}') || trimmed === '}') acc.level--;
      acc.lines.push('  '.repeat(acc.level) + trimmed);
      if (trimmed.endsWith('{')) acc.level++;
      return acc;
    }, { lines: [], level: 0 }).lines.join('\n');

  // Restore original string literals
  stringLiterals.forEach((str, i) => {
    body = body.replace(`___STR_LIT_${i}___`, str);
  });
  return importsBlock + body;
}

export function deactivate() {}