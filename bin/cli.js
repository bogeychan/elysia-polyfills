#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

import { updateScriptFolder } from '../scripts/utils.js';

const CWD = process.cwd();
const NODE_MODULES_PATH = path.resolve(CWD, 'node_modules');
const ELYSIA_PATH = path.resolve(NODE_MODULES_PATH, 'elysia');
const RAIKIRI_PATH = path.resolve(NODE_MODULES_PATH, 'raikiri');
const DENO_NESTED_MODULES_PATH = path.resolve(NODE_MODULES_PATH, '.deno');

const EXTRA_PATHS = process.argv
  .slice(2)
  .map((extraPath) => path.resolve(NODE_MODULES_PATH, extraPath));

/**
 * @param {string} filePath
 */
function exitOnMissingFile(filePath) {
  console.error(
    `❌ "${path.dirname(filePath)}" doesn't contain '${path.basename(
      filePath
    )}'`
  );
  process.exit(1);
}

if (!fs.existsSync(NODE_MODULES_PATH)) {
  exitOnMissingFile(NODE_MODULES_PATH);
}

/**
 * @type {string[]}
 */
let denoModules = [];

if (fs.existsSync(DENO_NESTED_MODULES_PATH)) {
  denoModules = fs.readdirSync(DENO_NESTED_MODULES_PATH);
}

/**
 * @param {string} folderPath
 * @returns {string}
 */
function resolveFolderPath(folderPath) {
  if (!fs.existsSync(folderPath)) {
    const folderName = path.basename(folderPath);

    for (const moduleName of denoModules) {
      if (moduleName.startsWith(`${folderName}@`)) {
        return path.resolve(
          DENO_NESTED_MODULES_PATH,
          moduleName,
          'node_modules',
          folderName
        );
      }
    }

    exitOnMissingFile(folderPath);
  }

  return folderPath;
}

const elysiaPath = resolveFolderPath(ELYSIA_PATH);
const raikiriPath = resolveFolderPath(RAIKIRI_PATH);

console.log("Let's goo\n");

/**
 * @param {string} folderPath
 * @see https://github.com/denoland/deno/issues/17784#issuecomment-1445195226
 */
function modifyPackageJson(folderPath) {
  const filePath = path.resolve(folderPath, 'package.json');
  const json = JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));

  json['type'] = 'module';

  fs.writeFileSync(filePath, JSON.stringify(json));
  console.log(`✅ Updated package for "${filePath}"`);
}

modifyPackageJson(elysiaPath);
modifyPackageJson(raikiriPath);

const extraPaths = EXTRA_PATHS.map((extraPath) => resolveFolderPath(extraPath));

for (const extraPath of extraPaths) {
  modifyPackageJson(extraPath);
}

console.log('\n');
updateScriptFolder(path.resolve(elysiaPath, 'dist'));
updateScriptFolder(path.resolve(raikiriPath, 'dist'));

for (const extraPath of extraPaths) {
  updateScriptFolder(path.resolve(extraPath, 'dist'));
}

console.log('\ndone.');
process.exit(0);

