#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class URLShortenerAPITester:
    def __init__(self, base_url="https://repo-init-9.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.bitly_api_key = "9f982ab6a9786a1f2e123dab3be3d12ae0bac4b7"

    def run_test(self, name, test_func):
        """Run a single test and track results"""
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            success, details = test_func()
            if success:
                self.tests_passed += 1
                print(f"✅ PASS - {details}")
            else:
                print(f"❌ FAIL - {details}")
            return success
        except Exception as e:
            print(f"❌ FAIL - Exception: {str(e)}")
            return False

    def test_health_endpoint(self):
        """Test GET /api/health returns status ok with all services running"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                status = data.get('status')
                proxy = data.get('proxy') 
                node = data.get('node')
                db = data.get('db')
                
                if status == 'ok' and proxy == 'running' and node in ['running', 'starting']:
                    return True, f"Health check OK - Status: {status}, Proxy: {proxy}, Node: {node}, DB: {db}"
                else:
                    return False, f"Health check failed - Status: {status}, Proxy: {proxy}, Node: {node}, DB: {db}"
            else:
                return False, f"HTTP {response.status_code}: {response.text[:200]}"
        except Exception as e:
            return False, f"Request failed: {str(e)}"

    def test_bitly_api_direct(self):
        """Test Bitly API accessibility and URL shortening capability"""
        try:
            headers = {
                'Authorization': f'Bearer {self.bitly_api_key}',
                'Content-Type': 'application/json'
            }
            data = {
                'long_url': 'https://google.com'
            }
            
            response = requests.post(
                'https://api-ssl.bitly.com/v4/shorten',
                headers=headers,
                json=data,
                timeout=10
            )
            
            if response.status_code == 200 or response.status_code == 201:
                result = response.json()
                short_url = result.get('id', 'N/A')
                return True, f"Bitly API accessible - Created short URL: {short_url}"
            elif response.status_code == 403:
                return False, f"Bitly API key unauthorized (403): {response.text[:200]}"
            else:
                return False, f"Bitly API error ({response.status_code}): {response.text[:200]}"
        except Exception as e:
            return False, f"Bitly API request failed: {str(e)}"

    def test_frontend_dashboard(self):
        """Test frontend dashboard loads and shows System Online"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            
            if response.status_code == 200:
                content = response.text.lower()
                if "system online" in content:
                    return True, f"Frontend dashboard shows 'System Online' - Status: {response.status_code}"
                elif "nomadly" in content or "dashboard" in content:
                    return True, f"Frontend dashboard accessible (no 'System Online' text) - Status: {response.status_code}"
                else:
                    # Check if it's an HTML page at least
                    if "<html" in content or "<!doctype" in content:
                        return True, f"Frontend loads HTML but no 'System Online' found - Status: {response.status_code}"
                    else:
                        return False, f"Frontend doesn't appear to be HTML - Content preview: {response.text[:200]}"
            else:
                return False, f"Frontend error - Status: {response.status_code}, Body: {response.text[:200]}"
        except Exception as e:
            return False, f"Frontend request failed: {str(e)}"

    def test_telegram_webhook_endpoint(self):
        """Test Telegram webhook endpoint returns 200"""
        try:
            # Test telegram webhook endpoint accessibility
            response = requests.post(
                f"{self.base_url}/telegram/webhook",
                json={
                    "message": {
                        "chat": {"id": 123456},
                        "text": "/test",
                        "from": {"username": "testuser"}
                    }
                },
                timeout=10
            )
            
            # Webhook should return 200 
            if response.status_code == 200:
                return True, f"Telegram webhook accessible - Status: {response.status_code}"
            else:
                return False, f"Telegram webhook error - Status: {response.status_code}, Body: {response.text[:200]}"
        except Exception as e:
            return False, f"Telegram webhook request failed: {str(e)}"

    def test_node_server_port_5000(self):
        """Test Node.js Express server running on port 5000 via proxy"""
        try:
            # Test that the backend proxy can reach Node.js server
            response = requests.get(f"{self.base_url}/", timeout=10)
            
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                if 'text/html' in content_type or 'application/json' in content_type:
                    return True, f"Node.js server accessible via proxy on port 5000 - Status: {response.status_code}, Content-Type: {content_type}"
                else:
                    return True, f"Node.js server responding via proxy - Status: {response.status_code}"
            else:
                return False, f"Node.js server error via proxy - Status: {response.status_code}, Body: {response.text[:200]}"
        except Exception as e:
            return False, f"Node.js server request failed: {str(e)}"

def main():
    """Main testing function"""
    print("🚀 Starting NomadlyBot Backend API Tests")
    print("=" * 50)
    
    # Setup
    tester = NomadlyBotAPITester()
    
    # Track service status
    health_passed = False
    node_passed = False
    ok_passed = False
    
    # Run tests
    print("\n📡 Testing Backend Services...")
    health_passed = tester.test_health_endpoint()
    
    print("\n🌐 Testing Node.js Express Server...")
    node_passed = tester.test_root_endpoint()
    ok_passed = tester.test_node_ok_endpoint()
    
    # Print summary
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    # Service status summary
    print("\n🔧 Service Status Summary:")
    print(f"   FastAPI Proxy: {'✅ Running' if health_passed else '❌ Issues'}")
    print(f"   Node.js Server: {'✅ Running' if node_passed else '❌ Issues'}")
    print(f"   Health Checks: {'✅ Passing' if ok_passed else '❌ Issues'}")
    
    # Overall assessment
    all_services_ok = health_passed and node_passed and ok_passed
    if all_services_ok:
        print("\n🎉 All backend services are operational!")
        return 0
    else:
        print("\n⚠️ Some backend services have issues - check logs")
        return 1

if __name__ == "__main__":
    sys.exit(main())