#!/usr/bin/env python3

import re
import sys
from datetime import datetime

class PlanLimitsValidator:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        
    def test_plan_limits_configuration(self):
        """Test that plan limits match the exact specifications"""
        print("\n🔍 Testing Plan Limits Configuration...")
        
        try:
            with open('/app/js/phone-config.js', 'r', encoding='utf-8') as f:
                content = f.read()
            
            tests_passed = 0
            tests_total = 6
            
            # Extract plans object - handle multi-line structure
            plans_match = re.search(r'const plans = \{(.*?)\}', content, re.MULTILINE | re.DOTALL)
            if not plans_match:
                print("   ❌ Plans configuration not found")
                self.tests_run += 1
                return False, {}
            
            plans_text = plans_match.group(0)
            print(f"   DEBUG: Extracted plans text: {plans_text[:200]}...")
            
            # 1. Check Starter plan: 100 minutes, 50 SMS
            if 'minutes: 100' in plans_text and 'sms: 50' in plans_text:
                print("   ✅ Starter Plan: 100 minutes, 50 SMS - Correct")
                tests_passed += 1
            else:
                print("   ❌ Starter Plan limits - Incorrect")
            
            # 2. Check Pro plan: 500 minutes, 200 SMS
            pro_pattern = r'pro:.*?minutes: 500.*?sms: 200'
            if re.search(pro_pattern, plans_text, re.DOTALL):
                print("   ✅ Pro Plan: 500 minutes, 200 SMS - Correct")
                tests_passed += 1
            else:
                print("   ❌ Pro Plan limits - Incorrect")
            
            # 3. Check Business plan: Unlimited minutes, 1000 SMS  
            business_pattern = r'business:.*?minutes: \'Unlimited\'.*?sms: 1000'
            if re.search(business_pattern, plans_text, re.DOTALL):
                print("   ✅ Business Plan: Unlimited minutes, 1000 SMS - Correct")
                tests_passed += 1
            else:
                print("   ❌ Business Plan limits - Incorrect")
            
            # Test voice-service.js limit functions with actual plan data
            with open('/app/js/voice-service.js', 'r', encoding='utf-8') as f:
                voice_content = f.read()
            
            # 4. Test getMinuteLimit function logic
            if "plan.minutes === 'Unlimited'" in voice_content and "return Infinity" in voice_content:
                print("   ✅ getMinuteLimit handles Unlimited correctly - Correct")
                tests_passed += 1
            else:
                print("   ❌ getMinuteLimit Unlimited handling - Incorrect")
            
            # 5. Test isMinuteLimitReached for Business plan
            if "limit === Infinity" in voice_content and "return false" in voice_content:
                print("   ✅ isMinuteLimitReached returns false for Business - Correct")
                tests_passed += 1
            else:
                print("   ❌ isMinuteLimitReached Business logic - Incorrect")
            
            # 6. Test that all plans are properly referenced
            if 'starter' in plans_text and 'pro' in plans_text and 'business' in plans_text:
                print("   ✅ All three plans (starter, pro, business) defined - Correct")
                tests_passed += 1
            else:
                print("   ❌ Missing plan definitions - Incorrect")
                
            self.tests_run += 1
            if tests_passed == tests_total:
                self.tests_passed += 1
                print(f"✅ Plan Limits Configuration Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ Plan Limits Configuration Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading configuration files: {e}")
            self.tests_run += 1
            return False, {}

    def test_limit_enforcement_edge_cases(self):
        """Test edge cases in limit enforcement"""
        print("\n🔍 Testing Limit Enforcement Edge Cases...")
        
        try:
            with open('/app/js/voice-service.js', 'r', encoding='utf-8') as f:
                voice_content = f.read()
                
            with open('/app/js/sms-service.js', 'r', encoding='utf-8') as f:
                sms_content = f.read()
            
            tests_passed = 0
            tests_total = 8
            
            # 1. Check that calls are rejected when num.status !== 'active'
            if "num.status !== 'active'" in voice_content and "rejecting call" in voice_content:
                print("   ✅ Calls rejected when number suspended - Correct")
                tests_passed += 1
            else:
                print("   ❌ Number status check in call handling - Missing")
            
            # 2. Check SMS dropped when number not active
            if "status !== 'active'" in sms_content and "skipping" in sms_content:
                print("   ✅ SMS skipped when number suspended - Correct")
                tests_passed += 1
            else:
                print("   ❌ Number status check in SMS handling - Missing")
            
            # 3. Check minute billing rounds up (even 1 second = 1 minute)
            if "Math.ceil" in voice_content and "duration / 60" in voice_content:
                print("   ✅ Minutes rounded up for billing - Correct")
                tests_passed += 1
            else:
                print("   ❌ Minute rounding logic - Missing")
            
            # 4. Check limit notifications only sent once per billing cycle
            if "_minLimitNotified" in voice_content and "_smsLimitNotified" in voice_content:
                if "!numbers[idx]._minLimitNotified" in voice_content:
                    print("   ✅ Limit notifications sent only once - Correct")
                    tests_passed += 1
                else:
                    print("   ❌ Duplicate notification prevention - Missing")
            else:
                print("   ❌ Notification flags - Missing")
            
            # 5. Check real-time usage tracking
            if "incrementMinutesUsed" in voice_content and "incrementSmsUsed" in voice_content:
                print("   ✅ Real-time usage tracking - Implemented")
                tests_passed += 1
            else:
                print("   ❌ Real-time usage tracking - Missing")
            
            # 6. Check that forwarded calls count toward minutes
            if "forwarding" in voice_content and "incrementMinutesUsed" in voice_content:
                print("   ✅ Forwarded calls count toward minutes - Correct")
                tests_passed += 1
            else:
                print("   ❌ Forwarded call minute tracking - Missing")
            
            # 7. Check SMS is inbound only (no outbound functionality)
            if "inbound" in sms_content and "handleInboundSms" in sms_content:
                # Should not have handleOutboundSms or similar
                if "handleOutboundSms" not in sms_content and "sendSms" not in sms_content:
                    print("   ✅ SMS is inbound only - Correct")
                    tests_passed += 1
                else:
                    print("   ❌ SMS outbound functions found - Should be inbound only")
            else:
                print("   ❌ SMS inbound handling - Missing")
            
            # 8. Check proper error messages for limit reached
            if "temporarily unavailable" in voice_content and "limit reached" in voice_content:
                print("   ✅ Proper limit reached error messages - Correct")
                tests_passed += 1
            else:
                print("   ❌ Limit reached error messages - Missing")
                
            self.tests_run += 1
            if tests_passed >= 6:  # Most edge cases handled
                self.tests_passed += 1
                print(f"✅ Limit Enforcement Edge Cases Test Passed ({tests_passed}/{tests_total})")
                return True, {"passed": tests_passed, "total": tests_total}
            else:
                print(f"❌ Limit Enforcement Edge Cases Test Failed ({tests_passed}/{tests_total})")
                return False, {"passed": tests_passed, "total": tests_total}
                
        except Exception as e:
            print(f"❌ Error reading service files: {e}")
            self.tests_run += 1
            return False, {}

    def run_validation(self):
        """Run all plan limits validation tests"""
        print(f"🎯 Starting Plan Limits Validation")
        print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        results = {}
        
        results['plan_limits_config'] = self.test_plan_limits_configuration()
        results['edge_cases'] = self.test_limit_enforcement_edge_cases()
        
        # Summary
        print(f"\n📊 Plan Limits Validation Summary")
        print(f"   Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        return results

def main():
    validator = PlanLimitsValidator()
    results = validator.run_validation()
    
    # Return appropriate exit code
    return 0 if validator.tests_passed == validator.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())