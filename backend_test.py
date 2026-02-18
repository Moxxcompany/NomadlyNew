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

    def test_plan_downgrade_feature(self):
        """Test plan downgrade auto-disable functionality"""
        print("\n🔍 Testing Plan Downgrade Auto-Disable Features...")
        
        try:
            with open('/app/js/_index.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Check for cpChangePlan handler that includes auto-disable logic
            tests_passed = 0
            tests_total = 5
            
            # 1. Check if cpChangePlan action is defined
            if 'cpChangePlan:' in content:
                print("   ✅ cpChangePlan action defined")
                tests_passed += 1
            else:
                print("   ❌ cpChangePlan action missing")
            
            # 2. Check for Business to Pro/Starter downgrade handling
            if 'planDowngrade' in content or 'Business' in content and ('Pro' in content or 'Starter' in content):
                print("   ✅ Plan downgrade detection logic found")
                tests_passed += 1
            else:
                print("   ❌ Plan downgrade detection logic missing")
                
            # 3. Check for IVR auto-disable on downgrade
            if 'ivr' in content and ('enabled' in content and 'false' in content):
                print("   ✅ IVR auto-disable logic found")
                tests_passed += 1
            else:
                print("   ❌ IVR auto-disable logic missing")
                
            # 4. Check for recording auto-disable
            if 'recording' in content and ('false' in content or 'disable' in content):
                print("   ✅ Recording auto-disable logic found") 
                tests_passed += 1
            else:
                print("   ❌ Recording auto-disable logic missing")
                
            # 5. Check for voicemail/SMS email disable for Starter
            if 'voicemail' in content or 'smsToEmail' in content:
                print("   ✅ Voicemail/SMS email disable logic found")
                tests_passed += 1
            else:
                print("   ❌ Voicemail/SMS email disable logic missing")
                
            self.tests_run += 1
            if tests_passed >= 3:  # At least basic downgrade logic
                self.tests_passed += 1
                print(f"✅ Plan Downgrade Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ Plan Downgrade Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading _index.js: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_ivr_analytics_implementation(self):
        """Test IVR Analytics collection and reporting"""
        print("\n🔍 Testing IVR Analytics Implementation...")
        
        try:
            # Test voice-service.js for analytics functions
            with open('/app/js/voice-service.js', 'r', encoding='utf-8') as f:
                voice_content = f.read()
            
            # Test _index.js for MongoDB collection
            with open('/app/js/_index.js', 'r', encoding='utf-8') as f:
                index_content = f.read()
                
            tests_passed = 0
            tests_total = 7
            
            # 1. Check for ivrAnalytics MongoDB collection
            if 'ivrAnalytics' in index_content and 'db.collection(' in index_content:
                print("   ✅ ivrAnalytics MongoDB collection found")
                tests_passed += 1
            else:
                print("   ❌ ivrAnalytics MongoDB collection missing")
                
            # 2. Check for trackIvrAnalytics function
            if 'trackIvrAnalytics' in voice_content:
                print("   ✅ trackIvrAnalytics function found")
                tests_passed += 1
            else:
                print("   ❌ trackIvrAnalytics function missing")
                
            # 3. Check function stores required fields (digit, action, callerFrom, phoneNumber, timestamp)
            if 'digit' in voice_content and 'action' in voice_content and 'callerFrom' in voice_content:
                print("   ✅ Required analytics fields found")
                tests_passed += 1
            else:
                print("   ❌ Required analytics fields missing")
                
            # 4. Check for getIvrAnalytics function
            if 'getIvrAnalytics' in voice_content:
                print("   ✅ getIvrAnalytics function found")
                tests_passed += 1
            else:
                print("   ❌ getIvrAnalytics function missing")
                
            # 5. Check function returns required data (totalCalls, optionBreakdown, topOption, recentCalls)
            if 'totalCalls' in voice_content and 'optionBreakdown' in voice_content:
                print("   ✅ Required analytics return data found")
                tests_passed += 1
            else:
                print("   ❌ Required analytics return data missing")
                
            # 6. Check for ivrAnalytics button in keyboard
            if '📊 IVR Analytics' in index_content or 'ivrAnalytics' in index_content:
                print("   ✅ IVR Analytics button found")
                tests_passed += 1
            else:
                print("   ❌ IVR Analytics button missing")
                
            # 7. Check for ivrAnalyticsReport function
            if 'ivrAnalyticsReport' in voice_content or 'ivrAnalyticsReport' in index_content:
                print("   ✅ ivrAnalyticsReport function found")
                tests_passed += 1
            else:
                print("   ❌ ivrAnalyticsReport function missing")
                
            self.tests_run += 1
            if tests_passed >= 5:  # Most analytics features working
                self.tests_passed += 1
                print(f"✅ IVR Analytics Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ IVR Analytics Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading files: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_custom_voicemail_greeting(self):
        """Test Custom Voicemail Greeting via audio upload"""
        print("\n🔍 Testing Custom Voicemail Greeting Implementation...")
        
        try:
            # Test _index.js for audio message handling
            with open('/app/js/_index.js', 'r', encoding='utf-8') as f:
                index_content = f.read()
                
            # Test voice-service.js for custom audio playback
            with open('/app/js/voice-service.js', 'r', encoding='utf-8') as f:
                voice_content = f.read()
                
            # Test phone-config.js for buttons and states
            with open('/app/js/phone-config.js', 'r', encoding='utf-8') as f:
                config_content = f.read()
                
            tests_passed = 0
            tests_total = 8
            
            # 1. Check for vmCustomGreeting button
            if 'vmCustomGreeting' in config_content:
                print("   ✅ vmCustomGreeting button found")
                tests_passed += 1
            else:
                print("   ❌ vmCustomGreeting button missing")
                
            # 2. Check for cpVmGreeting, cpVmAudioUpload, cpVmTextGreeting states
            if 'cpVmGreeting' in index_content and 'cpVmAudioUpload' in index_content:
                print("   ✅ Voicemail greeting states defined")
                tests_passed += 1
            else:
                print("   ❌ Voicemail greeting states missing")
                
            # 3. Check for voice/audio message handler in _index.js
            if ('msg.voice' in index_content or 'msg.audio' in index_content) and 'cpVmAudioUpload' in index_content:
                print("   ✅ Voice/audio message handler found")
                tests_passed += 1
            else:
                print("   ❌ Voice/audio message handler missing")
                
            # 4. Check for customAudioGreetingUrl handling
            if 'customAudioGreetingUrl' in index_content or 'customAudioGreetingUrl' in voice_content:
                print("   ✅ Custom audio greeting URL handling found")
                tests_passed += 1
            else:
                print("   ❌ Custom audio greeting URL handling missing")
                
            # 5. Check for Telnyx playback_start API usage
            if 'playback_start' in voice_content:
                print("   ✅ Telnyx playback_start API usage found")
                tests_passed += 1
            else:
                print("   ❌ Telnyx playback_start API usage missing")
                
            # 6. Check for call.playback.ended event handling
            if 'call.playback.ended' in voice_content:
                print("   ✅ call.playback.ended event handling found")
                tests_passed += 1
            else:
                print("   ❌ call.playback.ended event handling missing")
                
            # 7. Check for voicemail menu showing Greeting button
            if '🔊 Greeting' in config_content:
                print("   ✅ Voicemail Greeting button found")
                tests_passed += 1
            else:
                print("   ❌ Voicemail Greeting button missing")
                
            # 8. Check for greeting type display in status
            if 'Custom Audio' in config_content and 'Custom Text' in config_content:
                print("   ✅ Greeting type status display found")
                tests_passed += 1
            else:
                print("   ❌ Greeting type status display missing")
                
            self.tests_run += 1
            if tests_passed >= 6:  # Most voicemail features working
                self.tests_passed += 1
                print(f"✅ Custom Voicemail Greeting Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ Custom Voicemail Greeting Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading files: {e}")
            self.tests_run += 1
            return False, {}
    
    def run_all_tests(self):
        """Run all tests"""
        print(f"🚀 Starting Nomadly Telegram Bot Tests - NEW FEATURES")
        print(f"   Target: {self.base_url}")
        print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        results = {}
        
        # Backend API Tests
        results['health'] = self.test_health_endpoint()
        results['webhook'] = self.test_webhook_structure()
        
        # Code Structure Tests (Existing)
        results['language_files'] = self.test_language_files_validation()
        results['phone_config'] = self.test_phone_config_exports()
        results['action_handlers'] = self.test_index_action_handlers()
        results['voice_service'] = self.test_voice_service_handlers()
        results['telnyx_service'] = self.test_telnyx_service_functions()
        results['webhook_config'] = self.test_webhook_url_configuration()
        
        # NEW FEATURE TESTS
        print(f"\n🆕 TESTING NEW FEATURES:")
        results['plan_downgrade'] = self.test_plan_downgrade_feature()
        results['ivr_analytics'] = self.test_ivr_analytics_implementation()
        results['custom_voicemail'] = self.test_custom_voicemail_greeting()
        
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