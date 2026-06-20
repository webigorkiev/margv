import { execSync } from 'node:child_process';
import { existsSync, rmSync, renameSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const dist = resolve(root, 'dist');
const src = resolve(root, 'src', 'index.ts');
const tmpEsmDir = resolve(dist, 'esm');

function run(cmd) {
    execSync(cmd, { stdio: 'inherit' });
}

function copyArtifacts() {
    copyFileSync(resolve(root, 'README.md'), resolve(dist, 'README.md'));
    copyFileSync(resolve(root, 'package.json'), resolve(dist, 'package.json'));
    copyFileSync(resolve(root, 'LICENSE'), resolve(dist, 'LICENSE'));
}

console.log('> build CJS');
run(`tsc "${src}" --declaration --outDir "${dist}"`);
run(`terser "${dist}/index.js" --output "${dist}/index.js"`);

console.log('> build ESM');
run(`tsc "${src}" --declaration false --outDir "${tmpEsmDir}" --module ES2020`);

const esmJs = resolve(tmpEsmDir, 'index.js');
const esmMjs = resolve(dist, 'index.mjs');

if (!existsSync(esmJs)) {
    throw new Error('ESM build failed: dist/esm/index.js not found');
}

renameSync(esmJs, esmMjs);
run(`terser "${esmMjs}" --output "${esmMjs}"`);

console.log('> cleanup');
if (existsSync(tmpEsmDir)) {
    rmSync(tmpEsmDir, { recursive: true, force: true });
}

console.log('> copy artifacts');
copyArtifacts();

console.log('Done');