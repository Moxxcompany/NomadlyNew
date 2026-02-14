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