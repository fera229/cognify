import * as ts from 'typescript';
import * as fs from 'fs';
import * as path from 'path';

const knownTypeImports = new Set([
  'Course',
  'Module',
  'User',
  'Lesson',
  'Category',
  'Attachment',
  'MuxData',
  'UserProgress',
  'Session',
  'SearchParams',
  'CourseFormData',
  'VideoUploadResponse',
  'TranscriptSegment',
  'EditCourseFormProps',
]);

function isTypeOnlyImport(
  node: ts.ImportDeclaration,
  typeChecker: ts.TypeChecker,
): boolean {
  let isTypeOnly = true;
  if (ts.isImportDeclaration(node) && node.importClause) {
    const namedBindings = node.importClause.namedBindings;
    if (namedBindings && ts.isNamedImports(namedBindings)) {
      namedBindings.elements.forEach((element) => {
        const symbol = typeChecker.getSymbolAtLocation(element.name);
        if (symbol) {
          const declarations = symbol.declarations;
          if (
            declarations &&
            declarations.some(
              (d) =>
                ts.isVariableDeclaration(d) ||
                ts.isFunctionDeclaration(d) ||
                ts.isClassDeclaration(d),
            )
          ) {
            isTypeOnly = false;
          }
        }
      });
    }
  }
  return isTypeOnly;
}

function processFile(filePath: string, program: ts.Program) {
  const sourceFile = program.getSourceFile(filePath);
  const typeChecker = program.getTypeChecker();

  if (!sourceFile) return;

  let fileContent = sourceFile.getFullText();
  let changes: { pos: number; end: number; newText: string }[] = [];

  // Process all import declarations
  sourceFile.statements.forEach((node) => {
    if (ts.isImportDeclaration(node)) {
      // Skip if already type-only import
      if (node.importClause?.isTypeOnly) return;

      const importClause = node.importClause;
      if (importClause) {
        const namedBindings = importClause.namedBindings;
        if (namedBindings && ts.isNamedImports(namedBindings)) {
          const elements = namedBindings.elements;

          // Group imports into type-only and regular imports
          const typeImports: ts.ImportSpecifier[] = [];
          const regularImports: ts.ImportSpecifier[] = [];

          elements.forEach((element) => {
            if (
              knownTypeImports.has(element.name.text) &&
              isTypeOnlyImport(node, typeChecker)
            ) {
              typeImports.push(element);
            } else {
              regularImports.push(element);
            }
          });

          // Only modify if we found type imports
          if (typeImports.length > 0) {
            const importStart = node.getStart(sourceFile);
            const importText = node.getText(sourceFile);
            const moduleSpecifier = node.moduleSpecifier.getText(sourceFile);

            let newImportText = '';

            // Create separate import statements if needed
            if (regularImports.length > 0) {
              const regularImportNames = regularImports
                .map((imp) => imp.getText(sourceFile))
                .join(', ');
              const typeImportNames = typeImports
                .map((imp) => imp.getText(sourceFile))
                .join(', ');

              newImportText =
                `import { ${regularImportNames} } from ${moduleSpecifier};\n` +
                `import type { ${typeImportNames} } from ${moduleSpecifier}`;
            } else {
              // All imports are type imports
              newImportText = importText.replace('import {', 'import type {');
            }

            changes.push({
              pos: importStart,
              end: importStart + importText.length,
              newText: newImportText,
            });
          }
        }
      }
    }
  });

  // Apply changes in reverse order to not affect other change positions
  changes.sort((a, b) => b.pos - a.pos);
  changes.forEach((change) => {
    fileContent =
      fileContent.substring(0, change.pos) +
      change.newText +
      fileContent.substring(change.end);
  });

  if (changes.length > 0) {
    fs.writeFileSync(filePath, fileContent);
    console.log(`Updated imports in ${path.relative(process.cwd(), filePath)}`);
  }
}

function findTypeScriptFiles(dir: string): string[] {
  let results: string[] = [];
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (
      stat.isDirectory() &&
      !file.startsWith('.') &&
      file !== 'node_modules'
    ) {
      results = results.concat(findTypeScriptFiles(filePath));
    } else if (
      stat.isFile() &&
      (file.endsWith('.ts') || file.endsWith('.tsx')) &&
      !file.endsWith('.d.ts')
    ) {
      results.push(filePath);
    }
  }

  return results;
}

// Create program
const configPath = ts.findConfigFile(
  process.cwd(),
  ts.sys.fileExists,
  'tsconfig.json',
);

if (!configPath) {
  throw new Error('Could not find tsconfig.json');
}

const { config } = ts.readConfigFile(configPath, ts.sys.readFile);
const { options, fileNames } = ts.parseJsonConfigFileContent(
  config,
  ts.sys,
  path.dirname(configPath),
);

// Find all TypeScript files
const files = findTypeScriptFiles(process.cwd());

// Create and use program
const program = ts.createProgram(files, options);

// Process each file
files.forEach((file) => {
  try {
    processFile(file, program);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
});

console.log('Finished processing files');
