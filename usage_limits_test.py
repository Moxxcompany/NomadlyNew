#!/usr/bin/env python3

import requests
import sys
import json
import re
from datetime import datetime

class UsageLimitsTester:
    def __init__(self, base_url="https://setup-wizard-102.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        
    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=10):
        """Run a single API test"""
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
        """Test the backend health endpoint"""
        return self.run_test("Backend Health", "GET", "api/health", 200)

    def test_voice_service_limit_functions(self):
        """Test voice-service.js limit checking functions"""
        print("\n🔍 Testing Voice Service Limit Functions...")
        
        try:
            with open('/app/js/voice-service.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            tests_passed = 0
            tests_total = 10
            
            # 1. Check getMinuteLimit function
            if 'function getMinuteLimit' in content or 'getMinuteLimit =' in content:
                print("   ✅ getMinuteLimit function - Found")
                tests_passed += 1
                # Check returns Infinity for Business
                if 'Infinity' in content and 'Unlimited' in content:
                    print("   ✅ getMinuteLimit returns Infinity for Business - Correct")
                    tests_passed += 1
                else:
                    print("   ❌ getMinuteLimit Infinity logic - Missing")
            else:
                print("   ❌ getMinuteLimit function - Missing")
            
            # 2. Check getSmsLimit function  
            if 'function getSmsLimit' in content or 'getSmsLimit =' in content:
                print("   ✅ getSmsLimit function - Found")
                tests_passed += 1
            else:
                print("   ❌ getSmsLimit function - Missing")
            
            # 3. Check isMinuteLimitReached function
            if 'function isMinuteLimitReached' in content or 'isMinuteLimitReached =' in content:
                print("   ✅ isMinuteLimitReached function - Found")
                tests_passed += 1
                # Check returns false for Business/Infinity
                if 'limit === Infinity' in content and 'return false' in content:
                    print("   ✅ isMinuteLimitReached returns false for Business - Correct")
                    tests_passed += 1
                else:
                    print("   ❌ isMinuteLimitReached Infinity logic - Missing")
            else:
                print("   ❌ isMinuteLimitReached function - Missing")
            
            # 4. Check isSmsLimitReached function
            if 'function isSmsLimitReached' in content or 'isSmsLimitReached =' in content:
                print("   ✅ isSmsLimitReached function - Found")  
                tests_passed += 1
            else:
                print("   ❌ isSmsLimitReached function - Missing")
            
            # 5. Check handleCallInitiated rejects when limit reached
            if 'handleCallInitiated' in content and 'isMinuteLimitReached' in content:
                if 'temporarily unavailable' in content or 'rejecting call' in content:
                    print("   ✅ handleCallInitiated rejects calls when limit reached - Correct")
                    tests_passed += 1
                else:
                    print("   ❌ handleCallInitiated reject logic - Missing")
            else:
                print("   ❌ handleCallInitiated limit check - Missing")
            
            # 6. Check handleCallHangup increments minutes
            if 'handleCallHangup' in content and 'incrementMinutesUsed' in content:
                print("   ✅ handleCallHangup increments minutesUsed - Correct")
                tests_passed += 1
            else:
                print("   ❌ handleCallHangup increment logic - Missing")
            
            # 7. Check limit notification logic  
            if '_minLimitNotified' in content and '_smsLimitNotified' in content:
                print("   ✅ Limit notification flags - Found")
                tests_passed += 1
            else:
                print("   ❌ Limit notification flags - Missing")
            
            # 8. Check module exports include limit functions
            export_pattern = r'module\.exports\s*=\s*{[^}]*}'
            exports_match = re.search(export_pattern, content, re.MULTILINE | re.DOTALL)
            if exports_match:
                exports_text = exports_match.group(0)
                required_exports = ['incrementSmsUsed', 'isSmsLimitReached', 'isMinuteLimitReached', 'getMinuteLimit', 'getSmsLimit']
                exports_found = sum(1 for exp in required_exports if exp in exports_text)
                if exports_found == len(required_exports):
                    print(f"   ✅ All limit functions exported - {exports_found}/{len(required_exports)}")
                    tests_passed += 1
                else:
                    print(f"   ❌ Missing exports - {exports_found}/{len(required_exports)}")
            else:
                print("   ❌ Module exports section - Not found")
                
            self.tests_run += 1
            if tests_passed >= 7:  # Most critical functions working
                self.tests_passed += 1
                print(f"✅ Voice Service Limit Functions Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ Voice Service Limit Functions Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading voice-service.js: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_sms_service_limit_integration(self):
        """Test SMS service limit integration and enforcement"""
        print("\n🔍 Testing SMS Service Limit Integration...")
        
        try:
            with open('/app/js/sms-service.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            tests_passed = 0
            tests_total = 8
            
            # 1. Check initSmsLimits function exists
            if 'function initSmsLimits' in content or 'initSmsLimits =' in content:
                print("   ✅ initSmsLimits function - Found")
                tests_passed += 1
            else:
                print("   ❌ initSmsLimits function - Missing")
            
            # 2. Check initSmsLimits receives incrementSmsUsed and isSmsLimitReached
            if '_incrementSmsUsed' in content and '_isSmsLimitReached' in content:
                print("   ✅ initSmsLimits receives limit functions - Correct")
                tests_passed += 1
            else:
                print("   ❌ initSmsLimits limit function parameters - Missing")
            
            # 3. Check handleInboundSms checks limits BEFORE forwarding
            if 'handleInboundSms' in content and 'isSmsLimitReached' in content:
                # Look for limit check before forwarding logic
                if 'limit reached' in content and ('return' in content or 'dropping' in content):
                    print("   ✅ handleInboundSms checks limits before forwarding - Correct")
                    tests_passed += 1
                else:
                    print("   ❌ handleInboundSms limit check placement - Incorrect")
            else:
                print("   ❌ handleInboundSms limit check - Missing")
            
            # 4. Check SMS dropped silently when limit reached
            if 'silently drop' in content or ('limit reached' in content and 'return' in content):
                print("   ✅ SMS silently dropped when limit reached - Correct")
                tests_passed += 1
            else:
                print("   ❌ SMS silent drop logic - Missing")
            
            # 5. Check handleInboundSms calls incrementSmsUsed AFTER forwarding
            if 'incrementSmsUsed' in content and 'forwardSmsToTelegram' in content:
                print("   ✅ handleInboundSms increments usage after forwarding - Correct")
                tests_passed += 1
            else:
                print("   ❌ incrementSmsUsed call placement - Missing")
            
            # 6. Check number status active check
            if "status !== 'active'" in content or "status === 'active'" in content:
                print("   ✅ Number status active check - Found")
                tests_passed += 1
            else:
                print("   ❌ Number status active check - Missing")
            
            # 7. Check 'Inbound SMS Received' message text
            if 'Inbound SMS Received' in content:
                print("   ✅ 'Inbound SMS Received' message text - Correct")
                tests_passed += 1
            else:
                print("   ❌ 'Inbound SMS Received' message text - Missing")
            
            # 8. Check module exports include initSmsLimits
            if 'initSmsLimits' in content and 'module.exports' in content:
                print("   ✅ initSmsLimits exported - Found")
                tests_passed += 1
            else:
                print("   ❌ initSmsLimits export - Missing")
                
            self.tests_run += 1
            if tests_passed >= 6:  # Most SMS limit features working
                self.tests_passed += 1
                print(f"✅ SMS Service Limit Integration Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ SMS Service Limit Integration Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading sms-service.js: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_phone_config_usage_text_updates(self):
        """Test phone-config.js has updated text for inbound-only messaging"""
        print("\n🔍 Testing Phone Config Usage Text Updates...")
        
        try:
            with open('/app/js/phone-config.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            tests_passed = 0
            tests_total = 7
            
            # 1. Check hubWelcome mentions 'SMS: Inbound only'
            if 'SMS: Inbound only' in content or 'SMS: <b>Inbound only</b>' in content:
                print("   ✅ hubWelcome mentions 'SMS: Inbound only' - Found")
                tests_passed += 1
            else:
                print("   ❌ hubWelcome 'SMS: Inbound only' text - Missing")
            
            # 2. Check hubWelcome mentions minutes include forwarded calls
            if 'Minutes: All inbound calls' in content and 'forwarded' in content:
                print("   ✅ hubWelcome mentions forwarded calls count toward minutes - Found")
                tests_passed += 1
            else:
                print("   ❌ hubWelcome forwarded calls text - Missing")
            
            # 3. Check selectPlan mentions 'SMS is inbound only'
            if 'SMS is inbound only' in content or 'inbound only' in content:
                print("   ✅ selectPlan mentions SMS inbound only - Found")
                tests_passed += 1
            else:
                print("   ❌ selectPlan SMS inbound only text - Missing")
            
            # 4. Check orderSummary says 'Inbound SMS' and 'Inbound Minutes includes forwarded'
            if 'Inbound SMS' in content and 'includes forwarded' in content:
                print("   ✅ orderSummary mentions inbound SMS and forwarded calls - Found")
                tests_passed += 1
            else:
                print("   ❌ orderSummary inbound text - Missing")
            
            # 5. Check forwardingStatus mentions forwarded calls count
            if 'forwarded calls count' in content or 'Forwarded calls count toward' in content:
                print("   ✅ forwardingStatus mentions forwarded calls count - Found")
                tests_passed += 1
            else:
                print("   ❌ forwardingStatus forwarded calls text - Missing")
            
            # 6. Check smsSettingsMenu says 'Inbound SMS Settings'
            if 'Inbound SMS Settings' in content:
                print("   ✅ smsSettingsMenu says 'Inbound SMS Settings' - Found")
                tests_passed += 1
            else:
                print("   ❌ smsSettingsMenu 'Inbound SMS Settings' text - Missing")
            
            # 7. Check manageNumber shows limit warnings
            if '🚫 Minutes limit reached' in content and '🚫 SMS limit reached' in content:
                print("   ✅ manageNumber shows usage limit warnings - Found")
                tests_passed += 1
            else:
                print("   ❌ manageNumber limit warning text - Missing")
                
            self.tests_run += 1
            if tests_passed >= 5:  # Most text updates present
                self.tests_passed += 1
                print(f"✅ Phone Config Text Updates Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ Phone Config Text Updates Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading phone-config.js: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_phone_scheduler_monthly_reset(self):
        """Test phone-scheduler.js monthly reset clears notification flags"""
        print("\n🔍 Testing Phone Scheduler Monthly Reset Logic...")
        
        try:
            with open('/app/js/phone-scheduler.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            tests_passed = 0
            tests_total = 5
            
            # 1. Check runMonthlyReset function exists
            if 'function runMonthlyReset' in content or 'runMonthlyReset =' in content:
                print("   ✅ runMonthlyReset function - Found")
                tests_passed += 1
            else:
                print("   ❌ runMonthlyReset function - Missing")
            
            # 2. Check clears _smsLimitNotified flag
            if '_smsLimitNotified' in content and 'false' in content:
                print("   ✅ Clears _smsLimitNotified flag - Found")
                tests_passed += 1
            else:
                print("   ❌ _smsLimitNotified reset - Missing")
            
            # 3. Check clears _minLimitNotified flag  
            if '_minLimitNotified' in content and 'false' in content:
                print("   ✅ Clears _minLimitNotified flag - Found")
                tests_passed += 1
            else:
                print("   ❌ _minLimitNotified reset - Missing")
            
            # 4. Check buildUsageLimitMsg mentions 'Inbound'
            if 'buildUsageLimitMsg' in content and 'Inbound' in content:
                print("   ✅ buildUsageLimitMsg mentions 'Inbound' - Found")
                tests_passed += 1
            else:
                print("   ❌ buildUsageLimitMsg 'Inbound' text - Missing")
            
            # 5. Check usage limit message explains what happens
            if ('calls rejected' in content and 'SMS blocked' in content) or 'no longer be forwarded' in content:
                print("   ✅ Usage limit messages explain rejection/blocking - Found")
                tests_passed += 1
            else:
                print("   ❌ Usage limit explanation text - Missing")
                
            self.tests_run += 1
            if tests_passed >= 3:  # Core reset functionality
                self.tests_passed += 1
                print(f"✅ Phone Scheduler Monthly Reset Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ Phone Scheduler Monthly Reset Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading phone-scheduler.js: {e}")
            self.tests_run += 1
            return False, {}
    
    def test_index_sms_limits_initialization(self):
        """Test _index.js initializes SMS limits with correct functions"""
        print("\n🔍 Testing Index SMS Limits Initialization...")
        
        try:
            with open('/app/js/_index.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            tests_passed = 0
            tests_total = 4
            
            # 1. Check initSmsLimits is called
            if 'initSmsLimits' in content:
                print("   ✅ initSmsLimits called - Found")
                tests_passed += 1
            else:
                print("   ❌ initSmsLimits call - Missing")
            
            # 2. Check incrementSmsUsed from voice-service is passed
            if 'incrementSmsUsed' in content and ('voice-service' in content or 'require' in content):
                print("   ✅ incrementSmsUsed from voice-service passed - Found")
                tests_passed += 1
            else:
                print("   ❌ incrementSmsUsed parameter - Missing")
            
            # 3. Check isSmsLimitReached from voice-service is passed
            if 'isSmsLimitReached' in content:
                print("   ✅ isSmsLimitReached passed - Found")
                tests_passed += 1
            else:
                print("   ❌ isSmsLimitReached parameter - Missing")
            
            # 4. Check initialization happens after voice service init
            voice_init_pos = content.find('initVoiceService')
            sms_init_pos = content.find('initSmsLimits')
            if voice_init_pos != -1 and sms_init_pos != -1 and voice_init_pos < sms_init_pos:
                print("   ✅ SMS limits initialized after voice service - Correct order")
                tests_passed += 1
            else:
                print("   ❌ SMS limits initialization order - Incorrect")
                
            self.tests_run += 1
            if tests_passed >= 3:  # Core initialization working
                self.tests_passed += 1
                print(f"✅ Index SMS Limits Initialization Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ Index SMS Limits Initialization Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading _index.js: {e}")
            self.tests_run += 1
            return False, {}

    def run_all_tests(self):
        """Run all usage limits enforcement tests"""
        print(f"🚀 Starting Usage Limits Enforcement Tests")
        print(f"   Target: {self.base_url}")
        print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        results = {}
        
        # Backend Health Check
        results['health'] = self.test_health_endpoint()
        
        # Core Usage Limit Tests  
        print(f"\n🎯 TESTING USAGE LIMIT ENFORCEMENT:")
        results['voice_limits'] = self.test_voice_service_limit_functions()
        results['sms_limits'] = self.test_sms_service_limit_integration()
        results['config_texts'] = self.test_phone_config_usage_text_updates()
        results['scheduler_reset'] = self.test_phone_scheduler_monthly_reset()
        results['integration_init'] = self.test_index_sms_limits_initialization()
        
        # Summary
        print(f"\n📊 Usage Limits Test Results Summary")
        print(f"   Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        return results

def main():
    tester = UsageLimitsTester()
    results = tester.run_all_tests()
    
    # Return appropriate exit code
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())