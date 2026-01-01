#!/usr/bin/env node

// Railway Deployment via API
const https = require('https');
const fs = require('fs');
const path = require('path');

const RAILWAY_TOKEN = process.env.RAILWAY_TOKEN;
const SERVICE_ID = process.env.RAILWAY_SERVICE_ID;
const ENVIRONMENT_ID = process.env.RAILWAY_ENVIRONMENT_ID;

// Validate all required environment variables
const requiredEnvVars = {
    RAILWAY_TOKEN,
    RAILWAY_SERVICE_ID: SERVICE_ID,
    RAILWAY_ENVIRONMENT_ID: ENVIRONMENT_ID
};

const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key, _]) => key);

if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.log('\n📝 Please set these variables in your environment or .env file');
    process.exit(1);
}

async function triggerDeployment() {
    console.log('🚀 Starting Railway deployment via API...');
    
    const query = `
        mutation {
            serviceInstanceRedeploy(
                environmentId: "${ENVIRONMENT_ID}"
                serviceId: "${SERVICE_ID}"
            ) {
                id
                status
            }
        }
    `;

    const postData = JSON.stringify({
        query: query
    });

    const options = {
        hostname: 'backboard.railway.com',
        port: 443,
        path: '/graphql/v2',
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RAILWAY_TOKEN}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.errors) {
                        console.error('❌ GraphQL errors:', response.errors);
                        reject(new Error(response.errors[0].message));
                    } else {
                        console.log('✅ Deployment triggered successfully!');
                        console.log('🆔 Deployment ID:', response.data?.serviceInstanceRedeploy?.id);
                        console.log('📊 Status:', response.data?.serviceInstanceRedeploy?.status);
                        console.log('🌐 Your app will be live at: https://nomadly1.up.railway.app');
                        resolve(response.data);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('❌ Request error:', error);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Run deployment
triggerDeployment()
    .then(() => {
        console.log('🎉 Deployment process completed!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Deployment failed:', error.message);
        process.exit(1);
    });