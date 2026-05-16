// Notion to GitHub Issue Importer (TypeScript)
// Scans a directory for Markdown and CSV files, extracts issues, and creates them on GitHub.
// Usage: ts-node import-issues.ts <OWNER> <REPO> <PATH_TO_EXPORT>

import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import axios from 'axios';


const GITHUB_API = 'https://api.github.com';
// const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_TOKEN = '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';


if (!GITHUB_TOKEN) {
  console.error('Error: GITHUB_TOKEN environment variable is not set. Please set it before running this script.');
  process.exit(1);
}


async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getIssueByTitle(token: string, owner: string, repo: string, title: string): Promise<any | null> {
  try {
    // Search issues by title (state:all to include closed)
    const res = await axios.get(
      `${GITHUB_API}/repos/${owner}/${repo}/issues`,
      {
        headers: { Authorization: `token ${token}` },
        params: { state: 'all', per_page: 100, direction: 'desc', sort: 'created' }
      }
    );
    const found = res.data.find((issue: any) => issue.title === title);
    return found || null;
  } catch (err: any) {
    console.error(`Failed to search issues for title: ${title}`);
    if (err.response) console.error(err.response.data);
    else console.error(err);
    return null;
  }
}

async function createIssue(token: string, owner: string, repo: string, title: string, body: string): Promise<any> {
  try {
    const res = await axios.post(
      `${GITHUB_API}/repos/${owner}/${repo}/issues`,
      { title, body },
      { headers: { Authorization: `token ${token}` } }
    );
    console.log(`Created issue: ${title}`);
    return res.data;
  } catch (err: any) {
    console.error(`Failed to create issue: ${title}`);
    if (err.response) console.error(err.response.data);
    else console.error(err);
  }
}

function parseMarkdownFile(filePath: string): { title: string; body: string } {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  let title = path.basename(filePath, '.md');
  let body = content;
  // Try to use first Markdown heading as title
  for (const line of lines) {
    if (line.startsWith('#')) {
      title = line.replace(/^#+\s*/, '').trim();
      break;
    }
  }
  return { title, body };
}

function parseCSVFile(filePath: string): Promise<Array<{ title: string; body: string }>> {
  return new Promise((resolve) => {
    const issues: Array<{ title: string; body: string }> = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: Record<string, string>) => {
        // Use first column as title, rest as body
        const keys = Object.keys(row);
        if (keys.length > 0) {
          const title = row[keys[0]];
          const body = keys.slice(1).map(k => `${k}: ${row[k]}`).join('\n');
          issues.push({ title, body });
        }
      })
      .on('end', () => resolve(issues));
  });
}

async function processDirectory(dir: string, token: string, owner: string, repo: string): Promise<void> {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let failedLookups = 0;
  const MAX_FAILED_LOOKUPS = 3;
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath, token, owner, repo);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.md')) {
        const { title, body } = parseMarkdownFile(fullPath);
        const existing = await getIssueByTitle(token, owner, repo, title);
        await delay(500);
        if (existing) {
          console.log(`Issue already exists: ${title} (ID: ${existing.number})`);
          failedLookups = 0;
        } else {
          const created = await createIssue(token, owner, repo, title, body);
          if (!created) {
            failedLookups++;
            if (failedLookups >= MAX_FAILED_LOOKUPS) {
              console.error(`Too many consecutive unsuccessful lookups. Exiting gracefully.`);
              process.exit(0);
            }
          } else {
            failedLookups = 0;
          }
        }
        await delay(500);
        fs.unlinkSync(fullPath);
      } else if (entry.name.endsWith('.csv')) {
        const issues = await parseCSVFile(fullPath);
        for (const issue of issues) {
          const existing = await getIssueByTitle(token, owner, repo, issue.title);
          await delay(500);
          if (existing) {
            console.log(`Issue already exists: ${issue.title} (ID: ${existing.number})`);
            failedLookups = 0;
          } else {
            const created = await createIssue(token, owner, repo, issue.title, issue.body);
            if (!created) {
              failedLookups++;
              if (failedLookups >= MAX_FAILED_LOOKUPS) {
                console.error(`Too many consecutive unsuccessful lookups. Exiting gracefully.`);
                process.exit(0);
              }
            } else {
              failedLookups = 0;
            }
          }
          await delay(500);
        }
        fs.unlinkSync(fullPath);
      }
    }
  }
}

async function main() {
  const [,, owner, repo, exportPath] = process.argv;
  console.log('Args:', { owner, repo, exportPath });
  if (!owner || !repo || !exportPath) {
    console.error('Usage: ts-node import-issues.ts <OWNER> <REPO> <PATH_TO_EXPORT>');
    process.exit(1);
  }
  if (!fs.existsSync(exportPath)) {
    console.error('Directory does not exist:', exportPath);
    process.exit(1);
  }
  console.log('Starting import for', { owner, repo, exportPath });
  await processDirectory(exportPath, GITHUB_TOKEN as string, owner, repo);
}

main();
