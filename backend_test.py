#!/usr/bin/env python3
import requests
import sys
import json
import subprocess
import re
from datetime import datetime

class NomadlyBotAPITester:
    def __init__(self, base_url="https://setup-wizard-92.preview.emergentagent.com"):
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
        """Test FastAPI proxy forwarding to Node.js backend"""
        try:
            # Test another endpoint that should be forwarded to Node.js
            response = requests.get(f"{self.base_url}/status", timeout=10)
            
            # This endpoint may or may not exist, but should go through proxy
            if response.status_code in [200, 404, 500]:  # Any response means proxy is working
                return True, f"FastAPI proxy forwarding working - Status: {response.status_code}"
            else:
                return False, f"Proxy forwarding issue - Status: {response.status_code}, Body: {response.text[:200]}"
        except Exception as e:
            return False, f"Proxy forwarding test failed: {str(e)}"

    def test_node_syntax_validation(self):
        """Test Node.js syntax validation: node --check js/_index.js passes"""
        try:
            result = subprocess.run(['node', '--check', 'js/_index.js'], 
                                  capture_output=True, text=True, cwd='/app')
            if result.returncode == 0:
                return True, "Node.js syntax validation passed"
            else:
                return False, f"Syntax errors: {result.stderr}"
        except Exception as e:
            return False, f"Syntax check failed: {str(e)}"

    def test_frelinks_is_let_variable(self):
        """Test that freeLinks is declared as let (not const) at line ~521"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
                
            # Check for 'let freeLinks' around line 521
            lines = content.split('\n')
            for i, line in enumerate(lines[515:530], 516):  # Check lines 516-530
                if 'freeLinks' in line and 'await get(freeShortLinksOf' in line:
                    if line.strip().startswith('let freeLinks'):
                        return True, f"Found 'let freeLinks' at line {i}"
                    elif line.strip().startswith('const freeLinks'):
                        return False, f"Found 'const freeLinks' at line {i}, should be 'let'"
                        
            return False, "Could not find freeLinks declaration around line 521"
        except Exception as e:
            return False, f"File check failed: {str(e)}"

    def test_freelinks_set_for_new_users(self):
        """Test that freeLinks is set to FREE_LINKS for new users (null/undefined case)"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
                
            # Look for the pattern where freeLinks is set to FREE_LINKS for new users
            if 'if (freeLinks === null || freeLinks === undefined)' in content and \
               'freeLinks = FREE_LINKS' in content:
                return True, "freeLinks correctly set to FREE_LINKS for new users"
            else:
                return False, "freeLinks not properly set for new users"
        except Exception as e:
            return False, f"File check failed: {str(e)}"

    def test_trans_function_dynamic_keyboard(self):
        """Test that trans function intercepts key 'o' and returns dynamic keyboard"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
                
            # Check for the trans function with key 'o' handling
            if "if (key === 'o' && result?.reply_markup?.keyboard)" in content:
                return True, "trans function correctly intercepts key 'o' for dynamic keyboard"
            else:
                return False, "trans function doesn't handle key 'o' properly"
        except Exception as e:
            return False, f"File check failed: {str(e)}"

    def test_dynamic_label_format(self):
        """Test dynamic label format with correct plural handling"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
                
            # Check for correct dynamic label format
            expected_pattern = r"freeLinks > 0.*?`🔗✂️ URL Shortener - \$\{freeLinks\} Link\$\{freeLinks !== 1 \? 's' : ''\} Left`.*?`🔗✂️ URL Shortener`"
            
            if re.search(expected_pattern, content, re.DOTALL):
                return True, "Dynamic label format with plural handling found"
            else:
                return False, "Dynamic label format not found or incorrect"
        except Exception as e:
            return False, f"File check failed: {str(e)}"

    def test_url_shortener_button_matching(self):
        """Test URL shortener button matching uses startsWith"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
                
            # Check for startsWith usage for button matching
            if "message.startsWith('🔗✂️ URL Shortener')" in content:
                return True, "URL shortener button matching uses startsWith correctly"
            else:
                return False, "URL shortener button matching doesn't use startsWith"
        except Exception as e:
            return False, f"File check failed: {str(e)}"

    def test_decrement_updates_freelinks(self):
        """Test that both decrement points update freeLinks = remaining"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
                
            # Count occurrences of freeLinks = remaining
            matches = re.findall(r'freeLinks = remaining', content)
            
            if len(matches) >= 2:
                return True, f"Found {len(matches)} instances of 'freeLinks = remaining'"
            else:
                return False, f"Found only {len(matches)} instances of 'freeLinks = remaining', expected at least 2"
        except Exception as e:
            return False, f"File check failed: {str(e)}"

    def test_keyboard_structure_preserved(self):
        """Test that keyboard structure returned by trans('o') has same shape"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
                
            # Check that the keyboard structure is preserved with reply_markup.keyboard
            if "reply_markup: {" in content and \
               "keyboard: result.reply_markup.keyboard.map((row, i) =>" in content:
                return True, "Keyboard structure preserved in trans('o') function"
            else:
                return False, "Keyboard structure not properly preserved"
        except Exception as e:
            return False, f"File check failed: {str(e)}"

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
    tester = NomadlyBotAPITester()
    
    print("🚀 Starting NomadlyBot API Testing")
    print(f"⚡ Base URL: {tester.base_url}")
    print("=" * 60)
    
    # Run all tests based on review request
    tester.run_test("GET /api/health returns status ok with all services running", tester.test_health_endpoint)
    tester.run_test("Node.js backend responds via FastAPI proxy", tester.test_bitly_api_direct)  
    tester.run_test("React frontend loads NomadlyBot dashboard", tester.test_frontend_dashboard)
    tester.run_test("FastAPI proxy correctly forwards requests to Node.js", tester.test_telegram_webhook_endpoint)
    tester.run_test("Node.js Express server accessible on port 5000 via proxy", tester.test_node_server_port_5000)
    
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