// Notion to GitHub Issue Importer
// Scans a directory for Markdown and CSV files, extracts issues, and creates them on GitHub.
// Usage: node import-issues.js <GITHUB_TOKEN> <OWNER> <REPO> <PATH_TO_EXPORT>

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const axios = require('axios');

const GITHUB_API = 'https://api.github.com';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function createIssue(token, owner, repo, title, body) {
  try {
    const res = await axios.post(
      `${GITHUB_API}/repos/${owner}/${repo}/issues`,
      { title, body },
      { headers: { Authorization: `token ${token}` } }
    );
    console.log(`Created issue: ${title}`);
    return res.data;
  } catch (err) {
    console.error(`Failed to create issue: ${title}`);
    if (err.response) console.error(err.response.data);
    else console.error(err);
  }
}

function parseMarkdownFile(filePath) {
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

function parseCSVFile(filePath) {
  return new Promise((resolve) => {
    const issues = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
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

async function processDirectory(dir, token, owner, repo) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath, token, owner, repo);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.md')) {
        const { title, body } = parseMarkdownFile(fullPath);
        await createIssue(token, owner, repo, title, body);
      } else if (entry.name.endsWith('.csv')) {
        const issues = await parseCSVFile(fullPath);
        for (const issue of issues) {
          await createIssue(token, owner, repo, issue.title, issue.body);
        }
      }
    }
  }
}

async function main() {
  const [,, owner, repo, exportPath] = process.argv;
  console.log('Args:', { owner, repo, exportPath });
  if (!owner || !repo || !exportPath) {
    console.error('Usage: node import-issues.js <OWNER> <REPO> <PATH_TO_EXPORT>');
    process.exit(1);
  }
  if (!fs.existsSync(exportPath)) {
    console.error('Directory does not exist:', exportPath);
    process.exit(1);
  }
  console.log('Starting import for', { owner, repo, exportPath });
  await processDirectory(exportPath, GITHUB_TOKEN, owner, repo);
}

main();
