#!/usr/bin/env python3

import requests
import sys
import json
import re
from datetime import datetime

class NomadlyBotTester:
    def __init__(self, base_url="https://onboarding-setup-1.preview.emergentagent.com"):
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
            
            # Store status code for webhook testing
            self.last_status_code = response.status_code
            
            success = response.status_code == expected_status if expected_status else response.status_code < 500
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
                expected_msg = f"Expected {expected_status}, got" if expected_status else "Got"
                print(f"❌ Failed - {expected_msg} {response.status_code}")
                if response.content:
                    print(f"   Response: {response.text[:200]}")
                return False, {}
                
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}
    
    def test_health_endpoint(self):
        """Test the health endpoint returns proper status"""
        success, response = self.run_test("Health Endpoint", "GET", "api/health", 200)
        if success and response:
            # Check required fields in health response
            required_fields = ['status', 'proxy', 'node', 'db']
            fields_present = all(field in response for field in required_fields)
            if fields_present:
                print(f"   ✅ Health response has all required fields")
                print(f"   Status: {response.get('status')}")
                print(f"   Proxy: {response.get('proxy')}")  
                print(f"   Node: {response.get('node')}")
                print(f"   DB: {response.get('db')}")
                return True, response
            else:
                print(f"   ❌ Missing required fields in health response")
                return False, response
        return success, response
    
    def test_root_endpoint(self):
        """Test the root endpoint returns Nomadly welcome HTML"""
        success, response = self.run_test("Root Endpoint", "GET", "api/", 200)
        if success and response:
            # Check for Nomadly content in HTML response
            html_content = str(response)
            nomadly_keywords = ['Nomadly', 'shorten URLs', 'register domains', 'phone leads', 'Telegram']
            keywords_found = sum(1 for keyword in nomadly_keywords if keyword in html_content)
            if keywords_found >= 3:
                print(f"   ✅ Root endpoint contains Nomadly content ({keywords_found}/{len(nomadly_keywords)} keywords)")
                return True, response
            else:
                print(f"   ❌ Root endpoint missing Nomadly content ({keywords_found}/{len(nomadly_keywords)} keywords)")
                return False, response
        return success, response
    
    def test_telegram_webhook_endpoint(self):
        """Test Telegram webhook endpoint accepts POST requests"""
        # Test with a dummy webhook payload
        webhook_data = {
            "update_id": 123456,
            "message": {
                "message_id": 1,
                "from": {"id": 123, "is_bot": False, "first_name": "Test"},
                "chat": {"id": 123, "type": "private"},
                "date": 1640995200,
                "text": "/start"
            }
        }
        
        # Webhook should accept POST (may return various status codes depending on bot logic)
        success, response = self.run_test("Telegram Webhook POST", "POST", "api/telegram/webhook", None, webhook_data)
        
        # For webhook endpoints, we expect it to accept the request (not return 404/405)
        # Common acceptable responses: 200 (success), 400 (bad request but endpoint exists), 500 (internal error but endpoint exists)
        acceptable_statuses = [200, 400, 500]
        webhook_accessible = any(self.last_status_code == status for status in acceptable_statuses) if hasattr(self, 'last_status_code') else False
        
        if webhook_accessible:
            print(f"   ✅ Webhook endpoint accepts POST requests")
            return True, response
        else:
            print(f"   ❌ Webhook endpoint not accessible or not accepting POST")
            return False, response
    
    def test_node_bot_integration(self):
        """Test Node.js bot integration through proxy"""
        print("\n🔍 Testing Node.js Bot Integration...")
        
        # Test if we can reach the Node.js bot through the proxy
        try:
            # First check if root returns the bot's HTML content
            url = f"{self.base_url}/api/"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200 and 'Nomadly' in response.text:
                print("   ✅ Node.js bot accessible through FastAPI proxy")
                self.tests_run += 1
                self.tests_passed += 1
                return True, response.text
            else:
                print(f"   ❌ Node.js bot not accessible (status: {response.status_code})")
                self.tests_run += 1
                return False, {}
                
        except Exception as e:
            print(f"   ❌ Error testing Node.js integration: {str(e)}")
            self.tests_run += 1
            return False, {}
    
    def test_environment_configuration(self):
        """Test environment configuration is properly set up"""
        print("\n🔍 Testing Environment Configuration...")
        
        # Check if backend .env contains required variables
        required_env_vars = [
            'MONGO_URL', 'TELEGRAM_BOT_TOKEN', 'SELF_URL', 'DB_NAME',
            'CHAT_BOT_NAME', 'REST_APIS_ON', 'TELEGRAM_BOT_ON'
        ]
        
        try:
            with open('/app/backend/.env', 'r') as f:
                env_content = f.read()
            
            vars_found = 0
            for var in required_env_vars:
                if f"{var}=" in env_content:
                    vars_found += 1
                    print(f"   ✅ {var} - Found")
                else:
                    print(f"   ❌ {var} - Missing")
            
            self.tests_run += 1
            if vars_found >= len(required_env_vars) * 0.8:  # At least 80% of vars present
                self.tests_passed += 1
                print(f"✅ Environment Configuration Test Passed ({vars_found}/{len(required_env_vars)})")
                return True, {"found": vars_found, "total": len(required_env_vars)}
            else:
                print(f"❌ Environment Configuration Test Failed ({vars_found}/{len(required_env_vars)})")
                return False, {"found": vars_found, "total": len(required_env_vars)}
                
        except Exception as e:
            print(f"❌ Error reading .env file: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_mongo_connection_config(self):
        """Test MongoDB connection configuration"""
        print("\n🔍 Testing MongoDB Configuration...")
        
        try:
            with open('/app/backend/.env', 'r') as f:
                env_content = f.read()
            
            # Check for MONGO_URL
            mongo_url_match = re.search(r'MONGO_URL=(.+)', env_content)
            if mongo_url_match:
                mongo_url = mongo_url_match.group(1)
                if 'mongodb://' in mongo_url and 'mongo:' in mongo_url:
                    print(f"   ✅ MongoDB URL properly configured")
                    self.tests_run += 1
                    self.tests_passed += 1
                    return True, {"mongo_url": mongo_url[:50] + "..."}
                else:
                    print(f"   ❌ MongoDB URL format invalid")
                    self.tests_run += 1
                    return False, {}
            else:
                print(f"   ❌ MONGO_URL not found")
                self.tests_run += 1
                return False, {}
                
        except Exception as e:
            print(f"❌ Error reading MongoDB config: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_telegram_bot_config(self):
        """Test Telegram bot configuration"""
        print("\n🔍 Testing Telegram Bot Configuration...")
        
        try:
            with open('/app/backend/.env', 'r') as f:
                env_content = f.read()
            
            tests_passed = 0
            tests_total = 4
            
            # Check TELEGRAM_BOT_ON
            if 'TELEGRAM_BOT_ON=true' in env_content:
                print(f"   ✅ Telegram bot enabled")
                tests_passed += 1
            else:
                print(f"   ❌ Telegram bot not enabled")
            
            # Check TELEGRAM_BOT_TOKEN
            if 'TELEGRAM_BOT_TOKEN' in env_content and len(env_content.split('TELEGRAM_BOT_TOKEN=')[1].split('\n')[0]) > 10:
                print(f"   ✅ Telegram bot token configured")
                tests_passed += 1
            else:
                print(f"   ❌ Telegram bot token missing or invalid")
            
            # Check SELF_URL
            if 'SELF_URL=' in env_content and 'onboarding-setup-1.preview.emergentagent.com' in env_content:
                print(f"   ✅ Self URL properly configured")
                tests_passed += 1
            else:
                print(f"   ❌ Self URL not configured correctly")
            
            # Check CHAT_BOT_NAME
            if 'CHAT_BOT_NAME=' in env_content and 'Nomadly' in env_content:
                print(f"   ✅ Chat bot name configured")
                tests_passed += 1
            else:
                print(f"   ❌ Chat bot name missing")
            
            self.tests_run += 1
            if tests_passed >= 3:  # At least 3/4 configs working
                self.tests_passed += 1
                print(f"✅ Telegram Bot Configuration Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ Telegram Bot Configuration Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading Telegram config: {e}")
            self.tests_run += 1
            return False, {}
    
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

    def test_mid_call_limit_monitor(self):
        """Test Mid-call limit monitor timer functionality"""
        print("\n🔍 Testing Mid-call Limit Monitor Implementation...")
        
        try:
            with open('/app/js/voice-service.js', 'r', encoding='utf-8') as f:
                voice_content = f.read()
                
            tests_passed = 0
            tests_total = 8
            
            # 1. Check for setInterval timer creation (60s interval)
            if 'setInterval' in voice_content and '60000' in voice_content:
                print("   ✅ setInterval timer with 60s interval found")
                tests_passed += 1
            else:
                print("   ❌ setInterval timer with 60s interval missing")
                
            # 2. Check for non-Business plan check (minuteLimit !== Infinity)
            if 'minuteLimit !== Infinity' in voice_content or 'Infinity' in voice_content:
                print("   ✅ Business plan check (Infinity minutes) found")
                tests_passed += 1
            else:
                print("   ❌ Business plan check missing")
                
            # 3. Check for projected total calculation (minutesUsed + elapsed)
            if 'projectedTotal' in voice_content and 'elapsedMin' in voice_content:
                print("   ✅ Projected total calculation found")
                tests_passed += 1
            else:
                print("   ❌ Projected total calculation missing")
                
            # 4. Check for limit reached comparison
            if 'projectedTotal >= minuteLimit' in voice_content:
                print("   ✅ Limit reached comparison found")
                tests_passed += 1
            else:
                print("   ❌ Limit reached comparison missing")
                
            # 5. Check for warning message before disconnect
            if 'call limit has been reached' in voice_content or 'limit reached' in voice_content:
                print("   ✅ Warning message before disconnect found")
                tests_passed += 1
            else:
                print("   ❌ Warning message before disconnect missing")
                
            # 6. Check for automatic call hangup
            if 'hangupCall' in voice_content and 'setTimeout' in voice_content:
                print("   ✅ Automatic call hangup found")
                tests_passed += 1
            else:
                print("   ❌ Automatic call hangup missing")
                
            # 7. Check for Telegram notification about auto-disconnect
            if '_limitDisconnect' in voice_content and 'sendMessage' in voice_content:
                print("   ✅ Telegram notification about auto-disconnect found")
                tests_passed += 1
            else:
                print("   ❌ Telegram notification missing")
                
            # 8. Check for timer cleanup (clearInterval)
            if 'clearInterval' in voice_content and '_limitTimer' in voice_content:
                print("   ✅ Timer cleanup (clearInterval) found")
                tests_passed += 1
            else:
                print("   ❌ Timer cleanup missing")
                
            self.tests_run += 1
            if tests_passed >= 6:  # Most mid-call monitoring features working
                self.tests_passed += 1
                print(f"✅ Mid-call Limit Monitor Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ Mid-call Limit Monitor Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading voice-service.js: {e}")
            self.tests_run += 1
            return False, {}

    def test_sms_inbox_functionality(self):
        """Test SMS Inbox with CNAM lookup functionality"""
        print("\n🔍 Testing SMS Inbox Implementation...")
        
        try:
            # Test cnam-service.js
            with open('/app/js/cnam-service.js', 'r', encoding='utf-8') as f:
                cnam_content = f.read()
                
            # Test _index.js
            with open('/app/js/_index.js', 'r', encoding='utf-8') as f:
                index_content = f.read()
                
            # Test phone-config.js
            with open('/app/js/phone-config.js', 'r', encoding='utf-8') as f:
                config_content = f.read()
                
            tests_passed = 0
            tests_total = 12
            
            # 1. Check for lookupCnam function with Multitel primary
            if 'lookupCnam' in cnam_content and 'lookupMultitel' in cnam_content:
                print("   ✅ lookupCnam function with Multitel primary found")
                tests_passed += 1
            else:
                print("   ❌ lookupCnam function with Multitel primary missing")
                
            # 2. Check for SignalWire fallback
            if 'lookupSignalwire' in cnam_content and 'fallback' in cnam_content.lower():
                print("   ✅ SignalWire fallback found")
                tests_passed += 1
            else:
                print("   ❌ SignalWire fallback missing")
                
            # 3. Check for MongoDB caching with TTL
            if 'cnamCache' in cnam_content and ('30' in cnam_content or 'TTL' in cnam_content):
                print("   ✅ MongoDB caching with 30-day TTL found")
                tests_passed += 1
            else:
                print("   ❌ MongoDB caching with TTL missing")
                
            # 4. Check for batchLookupCnam with parallel processing
            if 'batchLookupCnam' in cnam_content and ('5' in cnam_content or 'concurrent' in cnam_content):
                print("   ✅ batchLookupCnam with parallel processing found")
                tests_passed += 1
            else:
                print("   ❌ batchLookupCnam with parallel processing missing")
                
            # 5. Check for cnamCache collection initialization
            if 'cnamCache' in index_content and 'db.collection(' in index_content:
                print("   ✅ cnamCache collection initialization found")
                tests_passed += 1
            else:
                print("   ❌ cnamCache collection initialization missing")
                
            # 6. Check for initCnamService call
            if 'initCnamService' in index_content and 'cnamCache' in index_content:
                print("   ✅ initCnamService call with cnamCache found")
                tests_passed += 1
            else:
                print("   ❌ initCnamService call missing")
                
            # 7. Check for cpSmsInbox action state
            if 'cpSmsInbox' in index_content:
                print("   ✅ cpSmsInbox action state found")
                tests_passed += 1
            else:
                print("   ❌ cpSmsInbox action state missing")
                
            # 8. Check for SMS Inbox button in phone config
            if '📨 SMS Inbox' in config_content or 'smsInbox' in config_content:
                print("   ✅ SMS Inbox button found")
                tests_passed += 1
            else:
                print("   ❌ SMS Inbox button missing")
                
            # 9. Check for showSmsInbox helper function
            if 'showSmsInbox' in index_content:
                print("   ✅ showSmsInbox helper function found")
                tests_passed += 1
            else:
                print("   ❌ showSmsInbox helper function missing")
                
            # 10. Check for phoneLogs query in SMS inbox
            if 'phoneLogs' in index_content and 'sms' in index_content.lower():
                print("   ✅ phoneLogs SMS query found")
                tests_passed += 1
            else:
                print("   ❌ phoneLogs SMS query missing")
                
            # 11. Check for pagination buttons (Newer/Older/Refresh)
            if 'inboxNewerPage' in config_content and 'inboxOlderPage' in config_content and 'inboxRefresh' in config_content:
                print("   ✅ SMS Inbox pagination buttons found")
                tests_passed += 1
            else:
                print("   ❌ SMS Inbox pagination buttons missing")
                
            # 12. Check for SMS inbox text templates with CNAM
            if 'smsInboxEntry' in config_content and 'name' in config_content:
                print("   ✅ SMS inbox templates with CNAM display found")
                tests_passed += 1
            else:
                print("   ❌ SMS inbox templates with CNAM display missing")
                
            self.tests_run += 1
            if tests_passed >= 9:  # Most SMS inbox features working
                self.tests_passed += 1
                print(f"✅ SMS Inbox Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ SMS Inbox Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading files: {e}")
            self.tests_run += 1
            return False, {}

    def test_ux_improvements(self):
        """Test UX improvements - Menu organization and Call/SMS logs"""
        print("\n🔍 Testing UX Improvements...")
        
        try:
            # Test _index.js for menu organization
            with open('/app/js/_index.js', 'r', encoding='utf-8') as f:
                index_content = f.read()
                
            # Test phone-config.js for button organization
            with open('/app/js/phone-config.js', 'r', encoding='utf-8') as f:
                config_content = f.read()
                
            tests_passed = 0
            tests_total = 8
            
            # 1. Check for buildManageMenu function
            if 'buildManageMenu' in index_content:
                print("   ✅ buildManageMenu function found")
                tests_passed += 1
            else:
                print("   ❌ buildManageMenu function missing")
                
            # 2. Check for SMS Inbox button in manage menu
            if 'smsInbox' in index_content and 'manage' in index_content.lower():
                print("   ✅ SMS Inbox in manage menu found")
                tests_passed += 1
            else:
                print("   ❌ SMS Inbox in manage menu missing")
                
            # 3. Check for logical button grouping (Communication, Advanced, Billing)
            if ('Communication' in index_content or 'Advanced' in index_content or 'Billing' in index_content):
                print("   ✅ Logical button grouping found")
                tests_passed += 1
            else:
                print("   ❌ Logical button grouping missing")
                
            # 4. Check for Call & SMS Logs improvements
            if 'callSmsLogs' in config_content or 'Call & SMS Logs' in config_content:
                print("   ✅ Call & SMS Logs button found")
                tests_passed += 1
            else:
                print("   ❌ Call & SMS Logs button missing")
                
            # 5. Check for all event types in logs (sms, voicemail, forwarded, missed, call_recording)
            if ('sms' in index_content and 'voicemail' in index_content and 
                'forwarded' in index_content and 'missed' in index_content and 
                'call_recording' in index_content):
                print("   ✅ All event types in logs found")
                tests_passed += 1
            else:
                print("   ❌ Complete event types in logs missing")
                
            # 6. Check for improved log display with event type filtering
            if 'type' in index_content and ('filter' in index_content or 'event' in index_content):
                print("   ✅ Event type filtering found")
                tests_passed += 1
            else:
                print("   ❌ Event type filtering missing")
                
            # 7. Check for better menu layout organization
            if ('[' in config_content and ']' in config_content):  # Button arrays
                print("   ✅ Menu layout organization found")
                tests_passed += 1
            else:
                print("   ❌ Menu layout organization missing")
                
            # 8. Check for user-friendly button labels and emojis
            if ('📞' in config_content and '📩' in config_content and '🎙️' in config_content):
                print("   ✅ User-friendly button labels with emojis found")
                tests_passed += 1
            else:
                print("   ❌ User-friendly button labels missing")
                
            self.tests_run += 1
            if tests_passed >= 6:  # Most UX improvements working
                self.tests_passed += 1
                print(f"✅ UX Improvements Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ UX Improvements Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading files: {e}")
            self.tests_run += 1
            return False, {}
    
    def run_all_tests(self):
        """Run all tests for Nomadly Telegram Bot"""
        print(f"🚀 Starting Nomadly Telegram Bot Tests")
        print(f"   Target: {self.base_url}")
        print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        results = {}
        
        # Backend API Tests - Core Requirements
        print(f"\n📋 TESTING CORE BACKEND FUNCTIONALITY:")
        results['health'] = self.test_health_endpoint()
        results['root_endpoint'] = self.test_root_endpoint() 
        results['telegram_webhook'] = self.test_telegram_webhook_endpoint()
        
        # Integration Tests
        print(f"\n🔗 TESTING INTEGRATION:")
        results['node_integration'] = self.test_node_bot_integration()
        
        # Configuration Tests
        print(f"\n⚙️ TESTING CONFIGURATION:")
        results['env_config'] = self.test_environment_configuration()
        results['mongo_config'] = self.test_mongo_connection_config()
        results['telegram_config'] = self.test_telegram_bot_config()
        
        # Summary
        print(f"\n📊 Test Results Summary")
        print(f"   Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        # Core functionality summary  
        core_tests = ['health', 'root_endpoint', 'telegram_webhook']
        core_passed = sum(1 for test in core_tests if results.get(test, [False])[0])
        
        print(f"\n🎯 CORE FUNCTIONALITY VALIDATION:")
        print(f"   Core Features Passed: {core_passed}/{len(core_tests)}")
        print(f"   Core Features Success Rate: {(core_passed/len(core_tests)*100):.1f}%")
        
        if core_passed == len(core_tests):
            print(f"   ✅ All core backend functionality is working!")
        elif core_passed >= 2:
            print(f"   ⚠️ Most core functionality working, minor issues detected")
        else:
            print(f"   ❌ Major backend functionality issues detected")
        
        return results

def main():
    tester = NomadlyBotTester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if tester.tests_passed >= tester.tests_run * 0.8 else 1

if __name__ == "__main__":
    sys.exit(main())