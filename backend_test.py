#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime

class NomadlyBotAPITester:
    def __init__(self, base_url="https://repo-init-9.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, expected_content=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}" if endpoint else self.base_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, headers=headers, timeout=10)

            success = response.status_code == expected_status
            
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                
                # Check response content if expected
                if expected_content:
                    try:
                        response_data = response.json()
                        for key, expected_value in expected_content.items():
                            if key in response_data:
                                if expected_value is None or response_data[key] == expected_value:
                                    print(f"   ✓ {key}: {response_data[key]}")
                                else:
                                    print(f"   ⚠️ {key}: expected {expected_value}, got {response_data[key]}")
                            else:
                                print(f"   ❌ Missing key: {key}")
                    except json.JSONDecodeError:
                        print(f"   📄 Response content: {response.text[:200]}...")
                        
                return success, response.json() if 'json' in response.headers.get('content-type', '').lower() else response.text

            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                return False, {}

        except requests.exceptions.ConnectionError:
            print(f"❌ Failed - Connection error to {url}")
            return False, {}
        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timeout")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_endpoint(self):
        """Test the health endpoint"""
        expected_content = {
            "status": "ok",
            "proxy": "running"
        }
        success, response = self.run_test(
            "Health Endpoint",
            "GET",
            "api/health",
            200,
            expected_content
        )
        
        if success and isinstance(response, dict):
            print(f"   📊 Proxy: {response.get('proxy', 'unknown')}")
            print(f"   📊 Node: {response.get('node', 'unknown')}")
            print(f"   📊 Database: {response.get('db', 'unknown')}")
            
            # Check if all services are running
            if (response.get('status') == 'ok' and 
                response.get('proxy') == 'running' and 
                response.get('node') == 'running'):
                print("   ✅ All backend services operational")
                return True
            else:
                print("   ⚠️ Some services may be starting up or having issues")
                return False
        
        return False

    def test_root_endpoint(self):
        """Test the root endpoint to check if Node.js Express is responding"""
        success, response = self.run_test(
            "Root Endpoint (Node.js Express)",
            "GET",
            "",
            200
        )
        
        if success and isinstance(response, str):
            if "greet" in response.lower() or "nomadly" in response.lower():
                print("   ✅ Node.js Express server responding correctly")
                return True
            else:
                print(f"   ⚠️ Unexpected response content")
                
        return False

    def test_node_ok_endpoint(self):
        """Test the /ok endpoint to verify Node.js server"""
        success, response = self.run_test(
            "OK Endpoint (Node.js health check)",
            "GET",
            "ok",
            200
        )
        
        if success:
            if isinstance(response, str) and "ok" in response.lower():
                print("   ✅ Node.js /ok endpoint working")
                return True
            else:
                print("   ✅ Node.js /ok endpoint responding (status 200)")
                return True
                
        return False

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