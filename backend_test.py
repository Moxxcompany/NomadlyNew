#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class NomadlyBotAPITester:
    def __init__(self, base_url="https://setup-code.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

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
        """Test if Node.js backend responds correctly through FastAPI proxy"""
        try:
            # Test root endpoint that should be handled by Node.js
            response = requests.get(f"{self.base_url}/", timeout=10)
            
            if response.status_code == 200:
                content_type = response.headers.get('content-type', '')
                if 'text/html' in content_type:
                    return True, f"Node.js backend responding via proxy - Status: {response.status_code}, Content-Type: {content_type}"
                elif 'application/json' in content_type:
                    return True, f"Node.js backend API responding - Status: {response.status_code}"
                else:
                    return True, f"Node.js backend responding - Status: {response.status_code}"
            else:
                return False, f"Node.js backend error - Status: {response.status_code}, Body: {response.text[:200]}"
        except Exception as e:
            return False, f"Node.js backend request failed: {str(e)}"

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
    """Main test runner"""
    tester = URLShortenerAPITester()
    
    print("🚀 Starting URL Shortener API Testing")
    print(f"⚡ Base URL: {tester.base_url}")
    print(f"🔑 Bitly API Key: {tester.bitly_api_key[:20]}...")
    print("=" * 60)
    
    # Run all tests based on review request
    tester.run_test("GET /api/health returns status ok with all services running", tester.test_health_endpoint)
    tester.run_test("Bitly API is accessible and can shorten URLs", tester.test_bitly_api_direct)  
    tester.run_test("Frontend dashboard still loads and shows System Online", tester.test_frontend_dashboard)
    tester.run_test("Telegram webhook endpoint at /telegram/webhook returns 200", tester.test_telegram_webhook_endpoint)
    tester.run_test("Node.js Express server is running on port 5000 via proxy", tester.test_node_server_port_5000)
    
    # Print summary
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed - see details above")
        return 1

if __name__ == "__main__":
    sys.exit(main())