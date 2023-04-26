#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

import { updateScriptFolder } from '../scripts/utils.js';

const CWD = process.cwd();
const NODE_MODULES_PATH = path.resolve(CWD, 'node_modules');
const ELYSIA_PATH = path.resolve(NODE_MODULES_PATH, 'elysia');
const RAIKIRI_PATH = path.resolve(NODE_MODULES_PATH, 'raikiri');

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

if (!fs.existsSync(ELYSIA_PATH)) {
  exitOnMissingFile(ELYSIA_PATH);
}

if (!fs.existsSync(RAIKIRI_PATH)) {
  exitOnMissingFile(RAIKIRI_PATH);
}

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

modifyPackageJson(ELYSIA_PATH);
modifyPackageJson(RAIKIRI_PATH);

for (const extraPath of EXTRA_PATHS) {
  modifyPackageJson(extraPath);
}

console.log('\n');
updateScriptFolder(path.resolve(ELYSIA_PATH, 'dist'));
updateScriptFolder(path.resolve(RAIKIRI_PATH, 'dist'));

for (const extraPath of EXTRA_PATHS) {
  updateScriptFolder(path.resolve(extraPath, 'dist'));
}

console.log('\ndone.');
process.exit(0);

