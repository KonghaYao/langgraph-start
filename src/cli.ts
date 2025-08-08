#!/usr/bin/env node

import { create } from 'create-create-app';
import type { Options } from 'create-create-app';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';

const toolName = 'create-agent';

const templateRoot = resolve(__dirname, '..', 'templates');

function getTemplateChoices(root: string): string[] {
    try {
        return readdirSync(root)
            .filter((name) => statSync(resolve(root, name)).isDirectory())
            .sort();
    } catch {
        return [];
    }
}

const caveat = `\nThanks for using create-agent!\n\nNext steps:\n1. cd <project-name>\n2. pnpm install (or npm install)\n3. pnpm dev\n\n`;

const templateChoices = getTemplateChoices(templateRoot);
const envTemplate = process.env.CREATE_AGENT_TEMPLATE;
const envPM = process.env.CREATE_AGENT_PM; // pnpm | bun

const config: Options = {
    templateRoot,
    promptForDescription: true,
    promptForAuthor: true,
    promptForEmail: true,
    promptForLicense: true,
    skipNpmInstall: true,
    skipGitInit: true,
    extra: {
        template: {
            type: 'list',
            describe: 'Choose a template',
            choices: templateChoices.length > 0 ? templateChoices : ['agent-template'],
            default: envTemplate && templateChoices.includes(envTemplate) ? envTemplate : undefined,
            prompt: 'if-no-arg',
        },
        packageManager: {
            type: 'list',
            describe: 'Choose a package manager',
            choices: ['pnpm', 'npm', 'yarn', 'bun'],
            default: envPM && ['pnpm', 'npm', 'yarn', 'bun'].includes(envPM) ? envPM : 'pnpm',
            prompt: 'if-no-arg',
        },
    },
    after: ({ name, answers }) => {
        const pm = (answers as { packageManager?: string }).packageManager ?? 'pnpm';
        console.log(`\nCreated ${name}.\nUse ${pm} to install and run the project.`);
    },
    caveat,
};

// See https://github.com/uetchy/create-create-app#readme for options reference.
create(toolName, config);
