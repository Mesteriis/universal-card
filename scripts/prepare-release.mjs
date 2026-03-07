#!/usr/bin/env node

import { execSync } from 'node:child_process';
import { appendFileSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const repoRoot = process.cwd();
const manifestPath = path.join(repoRoot, 'manifest.json');
const packageJsonPath = path.join(repoRoot, 'package.json');
const packageLockPath = path.join(repoRoot, 'package-lock.json');
const initPath = path.join(repoRoot, '__init__.py');

function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, value) {
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function bumpPatch(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Unsupported version format: ${version}`);
  }

  const [, major, minor, patch] = match;
  return `${major}.${minor}.${Number(patch) + 1}`;
}

function hasVersionTag(tags, version) {
  return tags.has(`v${version}`) || tags.has(version);
}

function replaceInitVersion(source, version) {
  const pattern = /VERSION:\s*Final\s*=\s*"[^"]+"/;
  if (!pattern.test(source)) {
    throw new Error('Failed to locate VERSION constant in __init__.py');
  }

  return source.replace(pattern, `VERSION: Final = "${version}"`);
}

const manifest = readJson(manifestPath);
const packageJson = readJson(packageJsonPath);
const packageLock = readJson(packageLockPath);
const originalVersion = manifest.version || packageJson.version;
const tags = new Set(
  execSync('git tag --list', { encoding: 'utf8' })
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean),
);

let releaseVersion = originalVersion;
while (hasVersionTag(tags, releaseVersion)) {
  releaseVersion = bumpPatch(releaseVersion);
}

if (releaseVersion !== originalVersion) {
  manifest.version = releaseVersion;
  writeJson(manifestPath, manifest);

  packageJson.version = releaseVersion;
  writeJson(packageJsonPath, packageJson);

  packageLock.version = releaseVersion;
  if (packageLock.packages && packageLock.packages['']) {
    packageLock.packages[''].version = releaseVersion;
  }
  writeJson(packageLockPath, packageLock);

  const initSource = readFileSync(initPath, 'utf8');
  writeFileSync(initPath, replaceInitVersion(initSource, releaseVersion), 'utf8');
}

const output = [
  `original_version=${originalVersion}`,
  `release_version=${releaseVersion}`,
  `tag_name=v${releaseVersion}`,
  `version_changed=${String(releaseVersion !== originalVersion)}`,
].join('\n');

if (process.env.GITHUB_OUTPUT) {
  appendFileSync(process.env.GITHUB_OUTPUT, `${output}\n`, 'utf8');
} else {
  console.log(output);
}
