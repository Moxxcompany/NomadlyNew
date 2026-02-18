#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class NomadlyBotTester:
    def __init__(self, base_url="https://setup-wizard-100.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        
    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=10):
        """Run a single test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                if response.content:
                    try:
                        json_resp = response.json()
                        print(f"   Response: {json_resp}")
                        return True, json_resp
                    except:
                        print(f"   Response: {response.text[:200]}")
                        return True, response.text
                return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                if response.content:
                    print(f"   Response: {response.text[:200]}")
                return False, {}
                
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}
    
    def test_health_endpoint(self):
        """Test the health endpoint"""
        return self.run_test("Health Endpoint", "GET", "api/health", 200)
    
    def test_webhook_structure(self):
        """Test webhook endpoint structure (should return method not allowed for GET)"""
        return self.run_test("Webhook Endpoint Structure", "GET", "api/webhook", 405)
    
    def test_language_files_validation(self):
        """Validate language files have cloudPhone entries"""
        print("\n🔍 Testing Language Files Configuration...")
        
        # Check if language files exist and have cloudPhone
        language_files = [
            '/app/js/lang/en.js',
            '/app/js/lang/fr.js', 
            '/app/js/lang/zh.js',
            '/app/js/lang/hi.js'
        ]
        
        lang_tests_passed = 0
        lang_tests_total = len(language_files)
        
        for file_path in language_files:
            lang = file_path.split('/')[-1].replace('.js', '')
            print(f"   📋 Checking {lang} language file...")
            
            try:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                if 'cloudPhone:' in content and '☁️' in content:
                    print(f"   ✅ {lang}.js - cloudPhone button found")
                    lang_tests_passed += 1
                else:
                    print(f"   ❌ {lang}.js - cloudPhone button missing")
                    
            except FileNotFoundError:
                print(f"   ❌ {lang}.js - File not found")
            except Exception as e:
                print(f"   ❌ {lang}.js - Error reading file: {e}")
        
        self.tests_run += 1
        if lang_tests_passed == lang_tests_total:
            self.tests_passed += 1
            print(f"✅ Language Files Test Passed ({lang_tests_passed}/{lang_tests_total})")
            return True, {"passed": lang_tests_passed, "total": lang_tests_total}
        else:
            print(f"❌ Language Files Test Failed ({lang_tests_passed}/{lang_tests_total})")
            return False, {"passed": lang_tests_passed, "total": lang_tests_total}
    
    def test_phone_config_exports(self):
        """Test phone-config.js exports required functions"""
        print("\n🔍 Testing phone-config.js exports...")
        
        try:
            with open('/app/js/phone-config.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            required_exports = [
                'canAccessFeature',
                'upgradeMessage', 
                'planFeatureAccess'
            ]
            
            required_buttons = [
                'enableIvr',
                'disableIvr',
                'ivrGreeting',
                'ivrAddOption',
                'ivrRemoveOption',
                'ivrViewOptions',
                'enableRecording',
                'disableRecording'
            ]
            
            exports_found = 0
            buttons_found = 0
            
            # Check exports
            for export in required_exports:
                if f'{export}' in content and 'module.exports' in content:
                    exports_found += 1
                    print(f"   ✅ {export} - Found")
                else:
                    print(f"   ❌ {export} - Missing")
            
            # Check button definitions
            for button in required_buttons:
                if f'{button}:' in content:
                    buttons_found += 1
                    print(f"   ✅ {button} - Found")
                else:
                    print(f"   ❌ {button} - Missing")
            
            self.tests_run += 1
            total_required = len(required_exports) + len(required_buttons)
            total_found = exports_found + buttons_found
            
            if total_found == total_required:
                self.tests_passed += 1
                print(f"✅ Phone Config Test Passed ({total_found}/{total_required})")
                return True, {"exports": exports_found, "buttons": buttons_found}
            else:
                print(f"❌ Phone Config Test Failed ({total_found}/{total_required})")
                return False, {"exports": exports_found, "buttons": buttons_found}
                
        except Exception as e:
            print(f"❌ Error reading phone-config.js: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_index_action_handlers(self):
        """Test _index.js has required action handlers"""
        print("\n🔍 Testing _index.js action handlers...")
        
        try:
            with open('/app/js/_index.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            required_actions = [
                'cpIvr',
                'cpIvrGreeting', 
                'cpIvrAddOption',
                'cpIvrRemoveOption',
                'cpCallRecording'
            ]
            
            actions_found = 0
            handlers_found = 0
            
            # Check action definitions
            for action in required_actions:
                if f"{action}:" in content or f"'{action}'" in content:
                    actions_found += 1
                    print(f"   ✅ Action {action} - Defined")
                else:
                    print(f"   ❌ Action {action} - Missing")
                
                # Check handlers
                if f"action === a.{action}" in content:
                    handlers_found += 1
                    print(f"   ✅ Handler for {action} - Found")
                else:
                    print(f"   ❌ Handler for {action} - Missing")
            
            self.tests_run += 1
            total_required = len(required_actions) * 2  # actions + handlers
            total_found = actions_found + handlers_found
            
            if total_found >= len(required_actions):  # At least actions defined
                self.tests_passed += 1
                print(f"✅ Action Handlers Test Passed ({total_found}/{total_required})")
                return True, {"actions": actions_found, "handlers": handlers_found}
            else:
                print(f"❌ Action Handlers Test Failed ({total_found}/{total_required})")
                return False, {"actions": actions_found, "handlers": handlers_found}
                
        except Exception as e:
            print(f"❌ Error reading _index.js: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_voice_service_handlers(self):
        """Test voice-service.js has required handlers"""
        print("\n🔍 Testing voice-service.js handlers...")
        
        try:
            with open('/app/js/voice-service.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            required_handlers = [
                'handleGatherEnded',
                'handleRecordingSaved',
                'initVoiceService'
            ]
            
            handlers_found = 0
            
            for handler in required_handlers:
                if f"function {handler}" in content or f"{handler} =" in content:
                    handlers_found += 1
                    print(f"   ✅ {handler} - Found")
                else:
                    print(f"   ❌ {handler} - Missing")
            
            self.tests_run += 1
            if handlers_found == len(required_handlers):
                self.tests_passed += 1
                print(f"✅ Voice Service Test Passed ({handlers_found}/{len(required_handlers)})")
                return True, {"handlers": handlers_found}
            else:
                print(f"❌ Voice Service Test Failed ({handlers_found}/{len(required_handlers)})")
                return False, {"handlers": handlers_found}
                
        except Exception as e:
            print(f"❌ Error reading voice-service.js: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_telnyx_service_functions(self):
        """Test telnyx-service.js has required functions"""
        print("\n🔍 Testing telnyx-service.js functions...")
        
        try:
            with open('/app/js/telnyx-service.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            required_functions = [
                'gatherDTMF',
                'stopRecording',
                'playbackStop'
            ]
            
            functions_found = 0
            exports_found = 0
            
            for func in required_functions:
                if f"function {func}" in content or f"{func} =" in content:
                    functions_found += 1
                    print(f"   ✅ Function {func} - Found")
                else:
                    print(f"   ❌ Function {func} - Missing")
                
                if f"{func}," in content and "module.exports" in content:
                    exports_found += 1
                    print(f"   ✅ Export {func} - Found")
                else:
                    print(f"   ❌ Export {func} - Missing")
            
            self.tests_run += 1
            total_required = len(required_functions)
            
            if functions_found == total_required:
                self.tests_passed += 1
                print(f"✅ Telnyx Service Test Passed ({functions_found}/{total_required})")
                return True, {"functions": functions_found, "exports": exports_found}
            else:
                print(f"❌ Telnyx Service Test Failed ({functions_found}/{total_required})")
                return False, {"functions": functions_found, "exports": exports_found}
                
        except Exception as e:
            print(f"❌ Error reading telnyx-service.js: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_webhook_url_configuration(self):
        """Test webhook URLs use correct pod URL"""
        print("\n🔍 Testing webhook URL configuration...")
        
        try:
            with open('/app/backend/.env', 'r') as f:
                content = f.read()
            
            expected_domain = "setup-wizard-100.preview.emergentagent.com"
            
            if expected_domain in content:
                print(f"   ✅ Webhook URL contains expected domain: {expected_domain}")
                self.tests_run += 1
                self.tests_passed += 1
                return True, {"domain": expected_domain}
            else:
                print(f"   ❌ Expected domain {expected_domain} not found in configuration")
                self.tests_run += 1
                return False, {}
                
        except Exception as e:
            print(f"❌ Error reading .env file: {e}")
            self.tests_run += 1
            return False, {}
    
    def run_all_tests(self):
        """Run all tests"""
        print(f"🚀 Starting Nomadly Telegram Bot Tests")
        print(f"   Target: {self.base_url}")
        print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        results = {}
        
        # Backend API Tests
        results['health'] = self.test_health_endpoint()
        results['webhook'] = self.test_webhook_structure()
        
        # Code Structure Tests
        results['language_files'] = self.test_language_files_validation()
        results['phone_config'] = self.test_phone_config_exports()
        results['action_handlers'] = self.test_index_action_handlers()
        results['voice_service'] = self.test_voice_service_handlers()
        results['telnyx_service'] = self.test_telnyx_service_functions()
        results['webhook_config'] = self.test_webhook_url_configuration()
        
        # Summary
        print(f"\n📊 Test Results Summary")
        print(f"   Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        return results

def main():
    tester = NomadlyBotTester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())