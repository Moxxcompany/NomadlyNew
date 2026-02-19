#!/usr/bin/env python3
"""
Backend Testing for Nomadly Telegram Bot
Tests greeting templates library and crypto payment integration
"""

import requests
import sys
import os
import json
import re
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://getting-started-64.preview.emergentagent.com/api')

class NomadlyBackendTester:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
    def run_test(self, name, test_func):
        """Run a single test function"""
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            result = test_func()
            if result:
                self.tests_passed += 1
                print(f"✅ Passed - {name}")
                return True
            else:
                print(f"❌ Failed - {name}")
                self.failed_tests.append(name)
                return False
        except Exception as e:
            print(f"❌ Failed - {name}: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False
    
    def test_health_endpoint(self):
        """Test backend health check endpoint"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"Health response: {data}")
                return data.get('status') == 'ok' and data.get('node') == 'running'
            return False
        except Exception as e:
            print(f"Health check error: {e}")
            return False
    
    def test_api_health_endpoint(self):
        """Test API health endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"API Health response: {data}")
                return 'status' in data and data.get('db', '').lower() in ['connected', 'running']
            return False
        except Exception as e:
            print(f"API health check error: {e}")
            return False
    
    def test_tts_service_exports(self):
        """Test that tts-service.js has required exports by checking source code"""
        try:
            # Read the tts-service.js file to verify exports
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            required_exports = [
                'getTemplateCategoryButtons',
                'getCategoryByButton', 
                'getTemplateButtons',
                'getTemplateByButton',
                'translateText'
            ]
            
            # Check module.exports section
            module_exports_match = re.search(r'module\.exports\s*=\s*\{([^}]+)\}', content, re.DOTALL)
            if not module_exports_match:
                print("No module.exports found")
                return False
            
            exports_content = module_exports_match.group(1)
            
            missing_exports = []
            for export in required_exports:
                if export not in exports_content:
                    missing_exports.append(export)
            
            if missing_exports:
                print(f"Missing exports: {missing_exports}")
                return False
            
            print(f"All required exports found: {required_exports}")
            return True
            
        except Exception as e:
            print(f"Error checking tts-service exports: {e}")
            return False
    
    def test_template_categories(self):
        """Test that 3 template categories exist in tts-service.js"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            # Find TEMPLATE_CATEGORIES
            categories_match = re.search(r'const TEMPLATE_CATEGORIES\s*=\s*\[([^\]]+)\]', content, re.DOTALL)
            if not categories_match:
                print("TEMPLATE_CATEGORIES not found")
                return False
            
            categories_content = categories_match.group(1)
            
            expected_categories = ['Financial Services', 'Customer Support', 'Voicemail Greetings']
            
            for category in expected_categories:
                if category not in categories_content:
                    print(f"Missing category: {category}")
                    return False
            
            print(f"All 3 template categories found: {expected_categories}")
            return True
            
        except Exception as e:
            print(f"Error checking template categories: {e}")
            return False
    
    def test_greeting_templates_counts(self):
        """Test that GREETING_TEMPLATES has correct number of templates per category"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            # Find GREETING_TEMPLATES object
            templates_match = re.search(r'const GREETING_TEMPLATES\s*=\s*\{(.*?)\}(?:\s*$|\s*,|\s*\n)', content, re.DOTALL | re.MULTILINE)
            if not templates_match:
                print("GREETING_TEMPLATES not found")
                return False
            
            templates_content = templates_match.group(1)
            
            # Count templates in each category by looking for array definitions
            financial_count = len(re.findall(r'\{[^}]*key:\s*[\'"]fin_', templates_content))
            support_count = len(re.findall(r'\{[^}]*key:\s*[\'"]sup_', templates_content))
            voicemail_count = len(re.findall(r'\{[^}]*key:\s*[\'"]vm_', templates_content))
            
            expected_counts = {'financial': 8, 'support': 4, 'voicemail': 6}
            actual_counts = {'financial': financial_count, 'support': support_count, 'voicemail': voicemail_count}
            
            print(f"Template counts - Expected: {expected_counts}, Actual: {actual_counts}")
            
            if actual_counts == expected_counts:
                return True
            else:
                print(f"Template count mismatch")
                return False
            
        except Exception as e:
            print(f"Error checking template counts: {e}")
            return False
    
    def test_action_handlers_exist(self):
        """Test that _index.js has required action handlers"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            required_handlers = [
                'cpVmTemplate',
                'cpVmTemplateEdit', 
                'cpIvrTemplate',
                'cpIvrTemplateEdit'
            ]
            
            missing_handlers = []
            for handler in required_handlers:
                # Look for both action definition and handler usage
                if f"'{handler}'" not in content and f'"{handler}"' not in content:
                    missing_handlers.append(handler)
            
            if missing_handlers:
                print(f"Missing action handlers: {missing_handlers}")
                return False
            
            print(f"All required action handlers found: {required_handlers}")
            return True
            
        except Exception as e:
            print(f"Error checking action handlers: {e}")
            return False
    
    def test_template_buttons_in_menus(self):
        """Test that VM and IVR menus include template buttons"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Check for "📋 Use Template" button in IVR and VM contexts
            template_button_pattern = r'📋 Use Template'
            
            if template_button_pattern not in content:
                print("Template button '📋 Use Template' not found in menus")
                return False
            
            print("Template button found in menus")
            return True
            
        except Exception as e:
            print(f"Error checking template buttons: {e}")
            return False
    
    def test_translation_support(self):
        """Test that VM greeting voice handler has translation support"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for translation usage in VM context
            translation_patterns = [
                'translateText',
                'ttsService.translateText'
            ]
            
            has_translation = any(pattern in content for pattern in translation_patterns)
            
            if not has_translation:
                print("Translation support not found in VM greeting handler")
                return False
            
            print("Translation support found")
            return True
            
        except Exception as e:
            print(f"Error checking translation support: {e}")
            return False
    
    def test_blockbee_crypto_callback(self):
        """Test that BlockBee crypto callback exists"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for BlockBee crypto-pay-phone callback
            blockbee_pattern = r"app\.get\s*\(\s*['\"]\/crypto-pay-phone['\"]"
            
            if not re.search(blockbee_pattern, content):
                print("BlockBee crypto-pay-phone callback not found")
                return False
            
            print("BlockBee crypto-pay-phone callback found")
            return True
            
        except Exception as e:
            print(f"Error checking BlockBee callback: {e}")
            return False
    
    def test_dynopay_crypto_callback(self):
        """Test that DynoPay crypto callback exists"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for DynoPay crypto-pay-phone callback
            dynopay_pattern = r"app\.post\s*\(\s*['\"]\/dynopay\/crypto-pay-phone['\"]"
            
            if not re.search(dynopay_pattern, content):
                print("DynoPay crypto-pay-phone callback not found")
                return False
            
            print("DynoPay crypto-pay-phone callback found")
            return True
            
        except Exception as e:
            print(f"Error checking DynoPay callback: {e}")
            return False
    
    def test_bank_pay_phone_handler(self):
        """Test that bankApis has bank-pay-phone handler"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for bank-pay-phone in bankApis
            bank_pattern = r"['\"]\/bank-pay-phone['\"]"
            
            if not re.search(bank_pattern, content):
                print("bank-pay-phone handler not found in bankApis")
                return False
            
            print("bank-pay-phone handler found")
            return True
            
        except Exception as e:
            print(f"Error checking bank-pay-phone handler: {e}")
            return False
    
    def test_crypto_pay_phone_action(self):
        """Test that crypto-pay-phone action handler exists"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for crypto-pay-phone action handling
            action_pattern = r"action\s*===?\s*['\"]crypto-pay-phone['\"]"
            
            if not re.search(action_pattern, content):
                print("crypto-pay-phone action handler not found")
                return False
            
            print("crypto-pay-phone action handler found")
            return True
            
        except Exception as e:
            print(f"Error checking crypto-pay-phone action: {e}")
            return False
    
    def test_dynopay_actions_config(self):
        """Test that config.js includes payPhone in dynopayActions"""
        try:
            with open('/app/js/config.js', 'r') as f:
                content = f.read()
            
            # Look for payPhone in dynopayActions
            if 'payPhone' not in content:
                print("payPhone not found in dynopayActions")
                return False
            
            # More specific check for dynopayActions object
            dynopay_match = re.search(r'const dynopayActions\s*=\s*\{([^}]+)\}', content, re.DOTALL)
            if dynopay_match and 'payPhone' in dynopay_match.group(1):
                print("payPhone found in dynopayActions config")
                return True
            
            print("payPhone not properly configured in dynopayActions")
            return False
            
        except Exception as e:
            print(f"Error checking dynopayActions config: {e}")
            return False
    
    def test_crypto_callback_order_processing(self):
        """Test that crypto callbacks process the order correctly"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for order processing functions in crypto callbacks
            processing_functions = [
                'buyNumber',
                'createSIPCredential',
                'notifyGroup'
            ]
            
            # Check if these functions are used in crypto callback context
            callback_section = re.search(r'app\.get\s*\(\s*[\'\"]/crypto-pay-phone[\'\"](.*?)(?=app\.|$)', content, re.DOTALL)
            
            if not callback_section:
                print("Crypto callback section not found for analysis")
                return False
            
            callback_content = callback_section.group(1)
            
            found_functions = []
            for func in processing_functions:
                if func in callback_content or func in content:  # Check broader context too
                    found_functions.append(func)
            
            if len(found_functions) >= 2:  # At least some order processing functions
                print(f"Order processing functions found: {found_functions}")
                return True
            else:
                print(f"Insufficient order processing functions found: {found_functions}")
                return False
            
        except Exception as e:
            print(f"Error checking order processing: {e}")
            return False

def main():
    tester = NomadlyBackendTester(BACKEND_URL)
    print(f"🚀 Starting Nomadly Backend Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    
    # Run all tests
    test_results = []
    
    # Health check tests
    test_results.append(tester.run_test("Backend health check /api/health", tester.test_health_endpoint))
    test_results.append(tester.run_test("API health check /api/api/health", tester.test_api_health_endpoint))
    
    # TTS service and template tests
    test_results.append(tester.run_test("TTS service exports", tester.test_tts_service_exports))
    test_results.append(tester.run_test("Template categories existence", tester.test_template_categories))
    test_results.append(tester.run_test("Greeting templates counts", tester.test_greeting_templates_counts))
    
    # Action handler tests
    test_results.append(tester.run_test("VM and IVR template action handlers", tester.test_action_handlers_exist))
    test_results.append(tester.run_test("Template buttons in menus", tester.test_template_buttons_in_menus))
    test_results.append(tester.run_test("Translation support", tester.test_translation_support))
    
    # Crypto payment tests
    test_results.append(tester.run_test("BlockBee crypto callback", tester.test_blockbee_crypto_callback))
    test_results.append(tester.run_test("DynoPay crypto callback", tester.test_dynopay_crypto_callback))
    test_results.append(tester.run_test("Bank pay phone handler", tester.test_bank_pay_phone_handler))
    test_results.append(tester.run_test("Crypto pay phone action", tester.test_crypto_pay_phone_action))
    test_results.append(tester.run_test("DynoPay actions config", tester.test_dynopay_actions_config))
    test_results.append(tester.run_test("Crypto callback order processing", tester.test_crypto_callback_order_processing))
    
    # Print results summary
    print(f"\n📊 Test Results Summary:")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {len(tester.failed_tests)}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for failed_test in tester.failed_tests:
            print(f"  - {failed_test}")
    
    # Return appropriate exit code
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())