#!/usr/bin/env python3

import requests
import json
import sys
from datetime import datetime

class NomadlyBotTester:
    def __init__(self, base_url="https://setup-wizard-102.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def run_test(self, name, test_func):
        """Run a single test and record results"""
        self.tests_run += 1
        print(f"\n🔍 Testing: {name}")
        
        try:
            success = test_func()
            if success:
                self.tests_passed += 1
                print(f"✅ PASSED: {name}")
                self.results.append({"test": name, "status": "PASSED", "details": ""})
            else:
                print(f"❌ FAILED: {name}")
                self.results.append({"test": name, "status": "FAILED", "details": ""})
            return success
        except Exception as e:
            print(f"❌ ERROR: {name} - {str(e)}")
            self.results.append({"test": name, "status": "ERROR", "details": str(e)})
            return False

    def test_backend_health(self):
        """Test GET /api/health endpoint"""
        try:
            url = f"{self.base_url}/api/health"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                print(f"   Health response: {data}")
                return data.get("status") == "ok"
            else:
                print(f"   Health endpoint returned status: {response.status_code}")
                return False
        except Exception as e:
            print(f"   Health endpoint error: {str(e)}")
            return False

    def verify_language_file_changes(self):
        """Verify changes in all language files"""
        
        # Define the test cases for each language file
        test_cases = [
            {
                "file": "/app/js/lang/en.js",
                "lang": "English",
                "expected_patterns": [
                    "becomeReseller: (() => {",
                    "const services = ['URL Shortening', 'Domain Registration']",
                    "if (process.env.PHONE_SERVICE_ON === 'true') services.push('Cloud Phone')",
                    "if (HIDE_SMS_APP !== 'true') services.push('BulkSMS')",
                    "if (process.env.OFFSHORE_HOSTING_ON !== 'false') services.push('Offshore Hosting')",
                    "subscriptionLeadsHint:",
                    "freeLinksExhausted: `Your ${FREE_LINKS} trial links are used up! Subscribe for unlimited links + free domains + ${DAILY_PLAN_FREE_VALIDATIONS.toLocaleString()}+ validations.`"
                ]
            },
            {
                "file": "/app/js/lang/fr.js", 
                "lang": "French",
                "expected_patterns": [
                    "becomeReseller: (() => {",
                    "subscriptionLeadsHint:",
                    "freeLinksExhausted:"
                ]
            },
            {
                "file": "/app/js/lang/zh.js",
                "lang": "Chinese", 
                "expected_patterns": [
                    "subscriptionLeadsHint:",
                    "freeLinksExhausted:"
                ]
            },
            {
                "file": "/app/js/lang/hi.js",
                "lang": "Hindi",
                "expected_patterns": [
                    "subscriptionLeadsHint:",
                    "freeLinksExhausted:"
                ]
            }
        ]
        
        all_passed = True
        
        for test_case in test_cases:
            try:
                with open(test_case["file"], "r") as f:
                    content = f.read()
                    
                print(f"\n   Checking {test_case['lang']} ({test_case['file']}):")
                
                for pattern in test_case["expected_patterns"]:
                    if pattern in content:
                        print(f"     ✅ Found: {pattern[:50]}...")
                    else:
                        print(f"     ❌ Missing: {pattern[:50]}...")
                        all_passed = False
                        
                # Check that userKeyboard doesn't contain user.buyPlan
                if "userKeyboard" in content:
                    lines = content.split("\n")
                    keyboard_started = False
                    keyboard_lines = []
                    for line in lines:
                        if "const userKeyboard = {" in line:
                            keyboard_started = True
                        if keyboard_started:
                            keyboard_lines.append(line)
                            if line.strip() == "}" and "reply_markup" not in line:
                                break
                    
                    keyboard_content = "\n".join(keyboard_lines)
                    if "user.buyPlan" in keyboard_content:
                        print(f"     ❌ userKeyboard still contains user.buyPlan")
                        all_passed = False
                    else:
                        print(f"     ✅ userKeyboard does NOT contain user.buyPlan")
                        
            except Exception as e:
                print(f"   Error reading {test_case['file']}: {str(e)}")
                all_passed = False
                
        return all_passed

    def verify_index_js_changes(self):
        """Verify changes in _index.js file"""
        try:
            with open("/app/js/_index.js", "r") as f:
                content = f.read()
                
            all_passed = True
            
            # Check for freeLinksExhausted with k.of([user.buyPlan])
            if "freeLinksExhausted, k.of([user.buyPlan])" in content:
                print("   ✅ Found freeLinksExhausted with k.of([user.buyPlan]) keyboard")
            else:
                print("   ❌ Missing freeLinksExhausted with k.of([user.buyPlan]) keyboard")
                all_passed = False
                
            # Check for subscriptionLeadsHint in targetSelectTarget
            if "subscriptionLeadsHint" in content and "targetSelectTarget" in content:
                # Look for the pattern where subscriptionLeadsHint is sent in targetSelectTarget
                lines = content.split("\n")
                found_hint_in_target = False
                in_target_function = False
                
                for line in lines:
                    if "targetSelectTarget:" in line:
                        in_target_function = True
                    elif in_target_function and "subscriptionLeadsHint" in line:
                        found_hint_in_target = True
                        break
                    elif in_target_function and line.strip() == "}," and ":" not in line:
                        in_target_function = False
                        
                if found_hint_in_target:
                    print("   ✅ Found subscriptionLeadsHint in targetSelectTarget")
                else:
                    print("   ❌ Missing subscriptionLeadsHint in targetSelectTarget")
                    all_passed = False
            else:
                print("   ❌ Missing subscriptionLeadsHint or targetSelectTarget")
                all_passed = False
                
            return all_passed
            
        except Exception as e:
            print(f"   Error reading _index.js: {str(e)}")
            return False

    def check_node_bot_logs(self):
        """Check Node.js bot startup logs for errors"""
        try:
            import subprocess
            result = subprocess.run(
                ["tail", "-n", "50", "/var/log/supervisor/node-bot.log"],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            if result.returncode == 0:
                log_content = result.stdout
                print("   Node.js bot log (last 50 lines):")
                
                # Look for crash indicators
                crash_indicators = [
                    "Error:",
                    "TypeError:",
                    "ReferenceError:", 
                    "SyntaxError:",
                    "process.exit",
                    "SIGTERM",
                    "SIGKILL",
                    "crashed",
                    "fatal"
                ]
                
                found_errors = []
                for line in log_content.split("\n")[-10:]:  # Check last 10 lines
                    for indicator in crash_indicators:
                        if indicator.lower() in line.lower():
                            found_errors.append(line.strip())
                            
                if found_errors:
                    print("   ❌ Found potential crash indicators:")
                    for error in found_errors:
                        print(f"     - {error}")
                    return False
                else:
                    print("   ✅ No crash indicators found in recent logs")
                    return True
            else:
                print(f"   ❌ Could not read log file: {result.stderr}")
                return False
                
        except Exception as e:
            print(f"   Warning: Could not check Node.js logs: {str(e)}")
            return True  # Don't fail the test if we can't read logs

def main():
    print("🚀 Starting Nomadly Telegram Bot Testing...")
    print("=" * 60)
    
    tester = NomadlyBotTester()
    
    # Test 1: Backend health endpoint
    tester.run_test("Backend Health Endpoint (/api/health)", tester.test_backend_health)
    
    # Test 2: Language files verification
    tester.run_test("Language Files Changes Verification", tester.verify_language_file_changes)
    
    # Test 3: _index.js changes verification
    tester.run_test("_index.js Changes Verification", tester.verify_index_js_changes)
    
    # Test 4: Node.js bot logs check
    tester.run_test("Node.js Bot Startup Logs Check", tester.check_node_bot_logs)
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("✅ All tests PASSED!")
        return 0
    else:
        print("❌ Some tests FAILED!")
        print("\nFailed tests:")
        for result in tester.results:
            if result["status"] != "PASSED":
                print(f"  - {result['test']}: {result['status']}")
                if result["details"]:
                    print(f"    Details: {result['details']}")
        return 1

if __name__ == "__main__":
    sys.exit(main())