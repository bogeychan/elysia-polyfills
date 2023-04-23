#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

import { updateScriptFolder } from '../scripts/utils.js';

const CWD = process.cwd();
const NODE_MODULES_PATH = path.resolve(CWD, 'node_modules');
const ELYSIA_PATH = path.resolve(NODE_MODULES_PATH, 'elysia');
const RAIKIRI_PATH = path.resolve(NODE_MODULES_PATH, 'raikiri');
const TARGET_FILE_EXTENSION = '.js';

/**
 * @param {string} filename
 */
function exitOnMissingFile(filename) {
  console.error(`❌ "${CWD}" doesn't contain '${filename}'`);
  process.exit(1);
}

if (!fs.existsSync(NODE_MODULES_PATH)) {
  exitOnMissingFile('node_modules');
}

if (!fs.existsSync(ELYSIA_PATH)) {
  exitOnMissingFile('elysia');
}

if (!fs.existsSync(RAIKIRI_PATH)) {
  exitOnMissingFile('raikiri');
}

console.log("Let's goo\n");

/**
 * @param {string} folderPath
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

console.log('\n');
updateScriptFolder(path.resolve(ELYSIA_PATH, 'dist'));
updateScriptFolder(path.resolve(RAIKIRI_PATH, 'dist'));

console.log('\ndone.');
process.exit(0);
