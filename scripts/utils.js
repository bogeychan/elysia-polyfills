import path from 'path';
import fs from 'fs';

import { globSync } from 'glob';
import * as acorn from 'acorn';
import * as walk from 'acorn-walk';
import * as astring from 'astring';

/**
 * @param {string} filePath
 * @param {string} fileExtension
 */
export function updateScript(filePath, fileExtension = '.js') {
  const folderPath = path.dirname(filePath);
  const script = fs.readFileSync(filePath, { encoding: 'utf-8' });

  const ast = acorn.parse(script, {
    ecmaVersion: 'latest',
    sourceType: 'module'
  });

  walk.simple(ast, {
    // import {} from "./file"
    // https://github.com/estree/estree/blob/749e8f0bf3de3c04708e3250c92641b3eeefbb15/experimental/import-attributes.md
    ImportDeclaration(node) {
      // @ts-ignore
      ensureUpdateImportNode({ node, fileExtension, folderPath });
    },
    // export * from "./file"
    // https://github.com/estree/estree/blob/749e8f0bf3de3c04708e3250c92641b3eeefbb15/experimental/import-attributes.md
    ExportAllDeclaration(node) {
      // @ts-ignore
      ensureUpdateImportNode({ node, fileExtension, folderPath });
    },
    // export {} from "./file"
    // https://github.com/estree/estree/blob/749e8f0bf3de3c04708e3250c92641b3eeefbb15/experimental/import-attributes.md
    ExportNamedDeclaration(node) {
      // @ts-ignore
      ensureUpdateImportNode({ node, fileExtension, folderPath });
    }
  });

  fs.writeFileSync(filePath, astring.generate(ast));

  console.log(`✅ Updated import for "${filePath}"`);
}

/**
 * @param {string} folderPath
 * @param {string} fileExtension
 */
export function updateScriptFolder(folderPath, fileExtension = '.js') {
  const files = globSync(
    path
      .resolve(folderPath, '**', '*.js')
      //! -> windows
      .replace(/\\/g, '/')
  );

  for (const file of files) {
    updateScript(file, fileExtension);
  }
}

/**
 * TODO: cache scriptPath's lstat -> folder or not
 *
 * @param {{ node: typeof acorn.Node & { source: { value: string, raw: string } }, fileExtension: string, folderPath: string }} options
 */
function ensureUpdateImportNode({ node, fileExtension, folderPath }) {
  const value = node?.source?.value;

  if (
    typeof value === 'string' &&
    value.startsWith('.') &&
    !value.endsWith(fileExtension)
  ) {
    const scriptPath = path.resolve(folderPath, value);

    const lstat = fs.lstatSync(scriptPath, { throwIfNoEntry: false });
    if (lstat && lstat.isDirectory()) {
      node.source.value = `${node.source.value}/index`;
    }

    node.source.raw = `"${node.source.value}${fileExtension}"`;
  }
}
