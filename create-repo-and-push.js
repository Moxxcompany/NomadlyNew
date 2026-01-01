#!/usr/bin/env node

/**
 * Create GitHub Repository and Push Code
 * 1. Create new repo "Nomadlyupdated"
 * 2. Push all current bot code
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function makeGitHubRequest(method, endpoint, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: endpoint,
            method: method,
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
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

async function createRepository() {
    console.log('🚀 Creating new repository: Nomadlyupdated');
    
    const repoData = {
        name: "Nomadlyupdated",
        description: "Telegram bot with URL shortening, domain registration, phone validation, payment processing, and VPS management - All runtime fixes applied",
        private: false,
        auto_init: true
    };

    try {
        const repo = await makeGitHubRequest('POST', '/user/repos', repoData);
        console.log('✅ Repository created successfully!');
        console.log(`🌐 Repository URL: ${repo.html_url}`);
        return repo;
    } catch (error) {
        console.error('❌ Failed to create repository:', error.message);
        throw error;
    }
}

async function pushFile(owner, repo, filePath, content, message) {
    try {
        // Check if file exists
        let existingSha = null;
        try {
            const existing = await makeGitHubRequest('GET', `/repos/${owner}/${repo}/contents/${filePath}`);
            existingSha = existing.sha;
        } catch (error) {
            // File doesn't exist, will create new
        }

        // Encode content to Base64
        const contentBase64 = Buffer.from(content).toString('base64');

        const payload = {
            message: message,
            content: contentBase64
        };

        if (existingSha) {
            payload.sha = existingSha;
        }

        await makeGitHubRequest('PUT', `/repos/${owner}/${repo}/contents/${filePath}`, payload);
        console.log(`  ✅ ${filePath}`);
        
    } catch (error) {
        console.error(`  ❌ ${filePath}: ${error.message}`);
        throw error;
    }
}

async function pushAllFiles(owner, repoName) {
    console.log('\n📁 Pushing all bot files...');
    
    const filesToPush = [
        // Core bot files
        'js/_index.js',
        'js/config-setup.js',
        'js/utils.js',
        'js/cr-view-dns-records.js',
        'js/validatePhoneAws.js',
        'hello.js',
        
        // Deployment scripts
        'railway-api-deploy.js',
        'github-push-api.js',
        'deploy-railway.sh',
        
        // Package configuration
        'package.json',
        'package-lock.json',
        
        // Documentation
        'replit.md'
    ];

    const message = "Deploy Telegram bot with all runtime fixes and Railway deployment";
    let successful = 0;
    let failed = 0;

    for (const file of filesToPush) {
        try {
            if (fs.existsSync(file)) {
                const content = fs.readFileSync(file, 'utf8');
                await pushFile(owner, repoName, file, content, message);
                successful++;
            } else {
                console.log(`  ⚠️  ${file} (not found, skipping)`);
            }
        } catch (error) {
            failed++;
        }
    }

    console.log(`\n📊 Push Summary: ${successful} successful, ${failed} failed`);
}

async function main() {
    if (!GITHUB_TOKEN) {
        console.error('❌ GITHUB_TOKEN not found!');
        process.exit(1);
    }

    try {
        // Step 1: Create repository
        const repo = await createRepository();
        
        // Step 2: Push all files
        await pushAllFiles(repo.owner.login, repo.name);
        
        console.log('\n🎉 Repository created and code pushed successfully!');
        console.log(`🔗 View your repository: ${repo.html_url}`);
        
    } catch (error) {
        console.error('💥 Operation failed:', error.message);
        process.exit(1);
    }
}

main();