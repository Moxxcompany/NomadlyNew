#!/usr/bin/env node

/**
 * GitHub API Code Push Solution
 * Based on official GitHub REST API documentation
 * https://docs.github.com/en/rest/repos/contents
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

class GitHubAPI {
    constructor(token, owner, repo) {
        this.token = token;
        this.owner = owner;
        this.repo = repo;
        this.baseUrl = 'api.github.com';
    }

    async makeRequest(method, endpoint, data = null) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.baseUrl,
                port: 443,
                path: endpoint,
                method: method,
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28',
                    'User-Agent': 'Replit-Bot'
                }
            };

            if (data) {
                const postData = JSON.stringify(data);
                options.headers['Content-Type'] = 'application/json';
                options.headers['Content-Length'] = Buffer.byteLength(postData);
            }

            const req = https.request(options, (res) => {
                let responseData = '';
                
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                
                res.on('end', () => {
                    try {
                        const response = JSON.parse(responseData);
                        if (res.statusCode >= 400) {
                            reject(new Error(`GitHub API Error: ${response.message || 'Unknown error'}`));
                        } else {
                            resolve(response);
                        }
                    } catch (error) {
                        reject(error);
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }
            req.end();
        });
    }

    async createOrUpdateFile(filePath, content, message, branch = 'main') {
        console.log(`📝 Processing file: ${filePath}`);
        
        try {
            // Step 1: Check if file exists to get SHA for updates
            let existingSha = null;
            try {
                const existing = await this.makeRequest(
                    'GET', 
                    `/repos/${this.owner}/${this.repo}/contents/${filePath}?ref=${branch}`
                );
                existingSha = existing.sha;
                console.log(`   ✅ File exists, will update (SHA: ${existingSha.substring(0, 8)}...)`);
            } catch (error) {
                console.log(`   📄 File doesn't exist, will create new`);
            }

            // Step 2: Encode content to Base64
            const contentBase64 = Buffer.from(content).toString('base64');

            // Step 3: Create/Update file
            const payload = {
                message: message,
                content: contentBase64,
                branch: branch
            };

            if (existingSha) {
                payload.sha = existingSha;
            }

            const result = await this.makeRequest(
                'PUT',
                `/repos/${this.owner}/${this.repo}/contents/${filePath}`,
                payload
            );

            console.log(`   ✅ ${existingSha ? 'Updated' : 'Created'} successfully`);
            return result;

        } catch (error) {
            console.error(`   ❌ Failed to process ${filePath}:`, error.message);
            throw error;
        }
    }

    async pushMultipleFiles(files, message, branch = 'main') {
        console.log(`🚀 Pushing ${files.length} files to ${this.owner}/${this.repo}:${branch}`);
        console.log(`💬 Commit message: "${message}"`);
        console.log('');

        const results = [];
        
        for (const file of files) {
            try {
                const result = await this.createOrUpdateFile(
                    file.path,
                    file.content,
                    message,
                    branch
                );
                results.push({ success: true, file: file.path, result });
            } catch (error) {
                results.push({ success: false, file: file.path, error: error.message });
            }
        }

        // Summary
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        
        console.log('');
        console.log(`📊 Push Summary:`);
        console.log(`   ✅ Successful: ${successful}`);
        console.log(`   ❌ Failed: ${failed}`);
        
        if (failed > 0) {
            console.log('\n❌ Failed files:');
            results.filter(r => !r.success).forEach(r => {
                console.log(`   - ${r.file}: ${r.error}`);
            });
        }

        return results;
    }

    async pushDirectoryRecursive(localDir, repoPath = '', message, branch = 'main') {
        console.log(`📁 Scanning directory: ${localDir}`);
        
        const files = [];
        
        function scanDirectory(dir, currentPath = '') {
            const items = fs.readdirSync(dir);
            
            for (const item of items) {
                const fullPath = path.join(dir, item);
                const relativePath = path.join(currentPath, item).replace(/\\/g, '/');
                
                // Skip hidden files and common ignore patterns
                if (item.startsWith('.') || 
                    item === 'node_modules' || 
                    item === '__pycache__' ||
                    item.endsWith('.log')) {
                    continue;
                }
                
                const stat = fs.statSync(fullPath);
                
                if (stat.isDirectory()) {
                    scanDirectory(fullPath, relativePath);
                } else if (stat.isFile()) {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    const finalPath = repoPath ? `${repoPath}/${relativePath}` : relativePath;
                    files.push({
                        path: finalPath,
                        content: content
                    });
                }
            }
        }
        
        scanDirectory(localDir);
        console.log(`📄 Found ${files.length} files to push`);
        
        return await this.pushMultipleFiles(files, message, branch);
    }
}

// Example usage and CLI interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.length < 3) {
        console.log(`
🚀 GitHub API Push Tool

Usage:
  node github-push-api.js <owner> <repo> <action> [options]

Actions:
  file <path> <content> <message>     - Push single file
  dir <localDir> <message>           - Push entire directory
  current <message>                  - Push current directory

Environment Variables Required:
  GITHUB_TOKEN - Personal Access Token with 'repo' scope

Examples:
  node github-push-api.js username myrepo file README.md "Hello World" "Initial commit"
  node github-push-api.js username myrepo dir ./src "Deploy latest updates"
  node github-push-api.js username myrepo current "Fix runtime errors"
        `);
        process.exit(1);
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        console.error('❌ GITHUB_TOKEN environment variable not set!');
        console.log('📝 Create token at: https://github.com/settings/tokens');
        console.log('🔒 Required scopes: repo, user');
        process.exit(1);
    }

    const [owner, repo, action, ...actionArgs] = args;
    const github = new GitHubAPI(token, owner, repo);

    try {
        switch (action) {
            case 'file':
                if (actionArgs.length < 3) {
                    console.error('❌ file action requires: <path> <content> <message>');
                    process.exit(1);
                }
                const [filePath, content, message] = actionArgs;
                await github.createOrUpdateFile(filePath, content, message);
                break;

            case 'dir':
                if (actionArgs.length < 2) {
                    console.error('❌ dir action requires: <localDir> <message>');
                    process.exit(1);
                }
                const [localDir, dirMessage] = actionArgs;
                await github.pushDirectoryRecursive(localDir, '', dirMessage);
                break;

            case 'current':
                if (actionArgs.length < 1) {
                    console.error('❌ current action requires: <message>');
                    process.exit(1);
                }
                const [currentMessage] = actionArgs;
                await github.pushDirectoryRecursive('.', '', currentMessage);
                break;

            default:
                console.error(`❌ Unknown action: ${action}`);
                process.exit(1);
        }

        console.log('✅ Push operation completed successfully!');
        console.log(`🌐 Repository: https://github.com/${owner}/${repo}`);

    } catch (error) {
        console.error('💥 Push operation failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = GitHubAPI;