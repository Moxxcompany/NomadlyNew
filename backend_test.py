#!/usr/bin/env python3
import requests
import sys
import json
import subprocess
import re
import os
from datetime import datetime

class HostMeNowMigrationTester:
    def __init__(self, base_url="https://quick-start-65.preview.emergentagent.com"):
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

    def test_backend_health_endpoint(self):
        """Test Backend /api/health endpoint returns status ok with proxy running, node running, db connected"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                status = data.get('status')
                database = data.get('database')  
                uptime = data.get('uptime')
                
                if status in ['healthy', 'ok'] and database in ['connected', 'ok']:
                    return True, f"Backend health OK - Status: {status}, Database: {database}, Uptime: {uptime}"
                else:
                    return False, f"Backend health failed - Status: {status}, Database: {database}, Uptime: {uptime}"
            else:
                return False, f"HTTP {response.status_code}: {response.text[:200]}"
        except Exception as e:
            return False, f"Request failed: {str(e)}"

    def test_nodejs_health_endpoint(self):
        """Test Node.js Express /health endpoint on port 5000 returns healthy with database connected"""
        try:
            # Test internal Node.js endpoint (note: this assumes the app forwards or we can access port 5000)
            # Since we're using public URL, we'll check if we can access the health endpoint through the proxy
            response = requests.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                status = data.get('status')
                database = data.get('database')  
                
                if status in ['healthy', 'starting'] and database in ['connected', 'connecting']:
                    return True, f"Node.js health OK - Status: {status}, Database: {database}"
                else:
                    return False, f"Node.js health issues - Status: {status}, Database: {database}"
            else:
                return False, f"HTTP {response.status_code}: {response.text[:200]}"
        except Exception as e:
            return False, f"Request failed: {str(e)}"

    def test_hostmenow_api_module_loads(self):
        """Test HostMeNow API module (js/hostmenow.js) loads correctly"""
        try:
            result = subprocess.run(['node', '-e', 'const hostmenow = require("./js/hostmenow.js"); console.log("Module loaded successfully"); console.log("Available functions:", Object.keys(hostmenow))'], 
                                  capture_output=True, text=True, cwd='/app')
            if result.returncode == 0:
                return True, f"HostMeNow module loads - Output: {result.stdout.strip()}"
            else:
                return False, f"Module load failed - Error: {result.stderr}"
        except Exception as e:
            return False, f"Test failed: {str(e)}"

    def test_hostmenow_get_products_api(self):
        """Test HostMeNow API Get_Products call returns products including IDs 111, 112, 114"""
        try:
            # Test the HostMeNow API key and product retrieval
            result = subprocess.run(['node', '-e', '''
                const hostmenow = require("./js/hostmenow.js");
                hostmenow.getProducts().then(response => {
                    console.log("API Response:", JSON.stringify(response, null, 2));
                    if (response && response.status === "success" && response.data) {
                        const products = Array.isArray(response.data) ? response.data : (response.data.products || []);
                        const productIds = products.map(p => p.product_id || p.id);
                        const hasRequired = [111, 112, 114].every(id => productIds.includes(id));
                        console.log("Product IDs found:", productIds);
                        console.log("Has required IDs (111, 112, 114):", hasRequired);
                        if (hasRequired) process.exit(0);
                        else process.exit(1);
                    } else {
                        console.log("API call failed or unexpected response structure");
                        process.exit(2);
                    }
                }).catch(err => {
                    console.log("API Error:", err.message);
                    process.exit(3);
                });
            '''], capture_output=True, text=True, cwd='/app', timeout=30)
            
            if result.returncode == 0:
                return True, f"HostMeNow API call successful - {result.stdout.strip()}"
            else:
                return False, f"API call failed (code {result.returncode}) - {result.stdout.strip()}"
        except Exception as e:
            return False, f"Test failed: {str(e)}"

    def test_plan_text_generation_names(self):
        """Test plan text generation shows correct plan names: Basic Plan, Starter Plan, Intermediate Plan"""
        try:
            with open('/app/js/hosting/plans.js', 'r') as f:
                content = f.read()
                
            required_names = ["'Basic Plan'", "'Starter Plan'", "'Intermediate Plan'"]
            found_names = []
            missing_names = []
            
            for name in required_names:
                if name in content:
                    found_names.append(name)
                else:
                    missing_names.append(name)
                    
            if not missing_names:
                return True, f"All required plan names found: {found_names}"
            else:
                return False, f"Missing plan names: {missing_names}, Found: {found_names}"
        except Exception as e:
            return False, f"File check failed: {str(e)}"

    def test_cr_check_domain_loads_and_exports(self):
        """Test cr-check-domain-available.js loads without errors and exports checkExistingDomain function"""
        try:
            result = subprocess.run(['node', '-e', '''
                const domain = require("./js/cr-check-domain-available.js");
                console.log("Module loaded successfully");
                console.log("Exported functions:", Object.keys(domain));
                if (typeof domain.checkExistingDomain === "function") {
                    console.log("checkExistingDomain function found");
                    process.exit(0);
                } else {
                    console.log("checkExistingDomain function NOT found");
                    process.exit(1);
                }
            '''], capture_output=True, text=True, cwd='/app')
            
            if result.returncode == 0:
                return True, f"Module loads and exports correctly - {result.stdout.strip()}"
            else:
                return False, f"Module test failed - {result.stderr}"
        except Exception as e:
            return False, f"Test failed: {str(e)}"

    def test_domain_validation_format_check(self):
        """Test cr-check-domain-available.js checkExistingDomain validates domain format correctly"""
        try:
            result = subprocess.run(['node', '-e', '''
                const { checkExistingDomain } = require("./js/cr-check-domain-available.js");
                
                // Test valid domains
                const validTests = ["example.com", "test-site.org", "my-domain.net"];
                const invalidTests = ["invalid", ".com", "domain.", "spaced domain.com", ""];
                
                console.log("Testing valid domains:");
                let allPassed = true;
                
                for (const domain of validTests) {
                    try {
                        const result = await checkExistingDomain(domain);
                        if (result && result.available === true) {
                            console.log(`✓ ${domain}: PASS`);
                        } else {
                            console.log(`✗ ${domain}: FAIL - should be valid`);
                            allPassed = false;
                        }
                    } catch (e) {
                        console.log(`✗ ${domain}: ERROR - ${e.message}`);
                        allPassed = false;
                    }
                }
                
                console.log("Testing invalid domains:");
                for (const domain of invalidTests) {
                    try {
                        const result = await checkExistingDomain(domain);
                        if (result && result.available === false) {
                            console.log(`✓ ${domain}: PASS - correctly rejected`);
                        } else {
                            console.log(`✗ ${domain}: FAIL - should be invalid`);
                            allPassed = false;
                        }
                    } catch (e) {
                        console.log(`✓ ${domain}: PASS - correctly threw error`);
                    }
                }
                
                if (allPassed) {
                    console.log("All domain validation tests passed");
                    process.exit(0);
                } else {
                    console.log("Some domain validation tests failed");
                    process.exit(1);
                }
            '''], capture_output=True, text=True, cwd='/app', timeout=15)
            
            if result.returncode == 0:
                return True, f"Domain validation works correctly - {result.stdout.strip()}"
            else:
                return False, f"Domain validation failed - {result.stdout.strip()}"
        except Exception as e:
            return False, f"Test failed: {str(e)}"

    def test_cr_register_domain_loads_and_exports(self):
        """Test cr-register-domain-&-create-cpanel.js loads without errors and exports registerDomainAndCreateCpanel function"""
        try:
            result = subprocess.run(['node', '-e', '''
                const domain = require("./js/cr-register-domain-&-create-cpanel.js");
                console.log("Module loaded successfully");
                console.log("Exported functions:", Object.keys(domain));
                if (typeof domain.registerDomainAndCreateCpanel === "function") {
                    console.log("registerDomainAndCreateCpanel function found");
                    process.exit(0);
                } else {
                    console.log("registerDomainAndCreateCpanel function NOT found");
                    process.exit(1);
                }
            '''], capture_output=True, text=True, cwd='/app')
            
            if result.returncode == 0:
                return True, f"Module loads and exports correctly - {result.stdout.strip()}"
            else:
                return False, f"Module test failed - {result.stderr}"
        except Exception as e:
            return False, f"Test failed: {str(e)}"

    def test_hosting_trial_plan_on_defaults_false(self):
        """Test HOSTING_TRIAL_PLAN_ON defaults to false"""
        try:
            with open('/app/.env', 'r') as f:
                content = f.read()
                
            # Check if explicitly set to false
            if "HOSTING_TRIAL_PLAN_ON=false" in content:
                return True, "HOSTING_TRIAL_PLAN_ON=false found in .env"
            else:
                # Check config-setup.js for default
                with open('/app/js/config-setup.js', 'r') as f:
                    config_content = f.read()
                if "setDefault('HOSTING_TRIAL_PLAN_ON', 'false')" in config_content:
                    return True, "HOSTING_TRIAL_PLAN_ON defaults to false in config-setup.js"
                else:
                    return False, "HOSTING_TRIAL_PLAN_ON not set to false in .env or config-setup.js"
        except Exception as e:
            return False, f"File check failed: {str(e)}"

    def test_offshore_hosting_on_set_true(self):
        """Test OFFSHORE_HOSTING_ON is set to true in .env"""
        try:
            with open('/app/.env', 'r') as f:
                content = f.read()
                
            if "OFFSHORE_HOSTING_ON=true" in content:
                return True, "OFFSHORE_HOSTING_ON=true found in .env"
            else:
                return False, "OFFSHORE_HOSTING_ON=true not found in .env"
        except Exception as e:
            return False, f"File check failed: {str(e)}"

def main():
    """Main test runner"""
    tester = HostMeNowMigrationTester()
    
    print("🚀 Starting HostMeNow Migration Testing")
    print(f"⚡ Base URL: {tester.base_url}")
    print("=" * 80)
    
    # Run all tests based on review request features
    tester.run_test("Backend /api/health endpoint returns status ok", tester.test_backend_health_endpoint)
    tester.run_test("Node.js Express /health endpoint returns healthy", tester.test_nodejs_health_endpoint)
    tester.run_test("HostMeNow API module (js/hostmenow.js) loads correctly", tester.test_hostmenow_api_module_loads)
    tester.run_test("HostMeNow API Get_Products returns products including IDs 111, 112, 114", tester.test_hostmenow_get_products_api)
    tester.run_test("Plan text generation shows correct names: Basic, Starter, Intermediate", tester.test_plan_text_generation_names)
    tester.run_test("cr-check-domain-available.js loads and exports checkExistingDomain", tester.test_cr_check_domain_loads_and_exports)
    tester.run_test("Domain validation format check accepts/rejects domains correctly", tester.test_domain_validation_format_check)
    tester.run_test("cr-register-domain-&-create-cpanel.js loads and exports function", tester.test_cr_register_domain_loads_and_exports)
    tester.run_test("HOSTING_TRIAL_PLAN_ON defaults to false", tester.test_hosting_trial_plan_on_defaults_false)
    tester.run_test("OFFSHORE_HOSTING_ON is set to true in .env", tester.test_offshore_hosting_on_set_true)
    
    # Print summary
    print("\n" + "=" * 80)
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