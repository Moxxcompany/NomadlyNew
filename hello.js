// Test file for login count API endpoint
// Usage: Set TEST_CHAT_ID environment variable and run: node hello.js

// Get the chatId from environment variable (safer than hardcoding)
const chatId = process.env.TEST_CHAT_ID;

if (!chatId) {
    console.error('❌ TEST_CHAT_ID environment variable not set');
    console.log('💡 Set it in your environment or .env file');
    process.exit(1);
}

// Check if chatId is available
if (chatId) {
    const port = process.env.PORT || 3000;
    const url = `http://localhost:${port}/login-count/${chatId}`;
    
    console.log(`🔗 Testing API endpoint: ${url}`);
    
    // Hit the API
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('✅ API Response:', data);
        })
        .catch(error => {
            console.error('❌ Error fetching data:', error.message);
            process.exit(1);
        });
}
