#!/usr/bin/env python3

import re
import subprocess
import sys
from pathlib import Path

class UXValidationTester:
    def __init__(self):
        self.tests_run = 0
        self.tests_passed = 0
        self.errors = []

    def run_test(self, name, test_func):
        """Run a single test and track results"""
        self.tests_run += 1
        print(f"\n🔍 Testing: {name}")
        
        try:
            success, details = test_func()
            if success:
                self.tests_passed += 1
                print(f"✅ PASS - {details}")
            else:
                print(f"❌ FAIL - {details}")
                self.errors.append(f"{name}: {details}")
            return success
        except Exception as e:
            print(f"❌ FAIL - Exception: {str(e)}")
            self.errors.append(f"{name}: Exception - {str(e)}")
            return False

    def test_keyboard_reordering_config(self):
        """Test config.js userKeyboard has correct order"""
        try:
            with open('/app/js/config.js', 'r') as f:
                content = f.read()
            
            # Extract keyboard array structure
            keyboard_match = re.search(r'const userKeyboard = \{[\s\S]*?keyboard: \[([\s\S]*?)\],', content)
            if not keyboard_match:
                return False, "Could not find userKeyboard in config.js"
            
            keyboard_content = keyboard_match.group(1)
            
            # Check the expected order based on review request
            expected_patterns = [
                r'\[user\.urlShortenerMain\]',
                r'\[user\.hostingDomainsRedirect\]', 
                r'\[user\.phoneNumberLeads\]',
                r'\[user\.wallet,\s*user\.viewPlan\]',
                r'\[user\.buyPlan\]'
            ]
            
            current_pos = 0
            found_order = []
            
            for pattern in expected_patterns:
                match = re.search(pattern, keyboard_content[current_pos:])
                if match:
                    found_order.append(pattern.replace(r'\.', '.').strip('[]r'))
                    current_pos += match.end()
                else:
                    return False, f"Missing or out of order: {pattern}"
            
            return True, f"Keyboard ordering correct: {' -> '.join(found_order)}"
        except Exception as e:
            return False, f"Error reading config.js: {str(e)}"

    def test_language_files_keyboard_consistency(self):
        """Test that all language files have proper keyboard structure"""
        try:
            files = [
                '/app/js/lang/en.js',
                '/app/js/lang/fr.js',
                '/app/js/lang/hi.js', 
                '/app/js/lang/zh.js'
            ]
            
            all_good = True
            issues = []
            
            for file_path in files:
                with open(file_path, 'r') as f:
                    content = f.read()
                
                # Check that it has the main keyboard elements in some order
                required_elements = [
                    'user.urlShortenerMain',
                    'user.hostingDomainsRedirect',
                    'user.phoneNumberLeads',
                    'user.wallet, user.viewPlan',
                    'user.buyPlan'
                ]
                
                missing = []
                for element in required_elements:
                    if element not in content:
                        missing.append(element)
                
                if missing:
                    issues.append(f"{Path(file_path).name}: missing {missing}")
                    all_good = False
            
            if all_good:
                return True, f"All {len(files)} language files have required keyboard elements"
            else:
                return False, f"Issues found: {'; '.join(issues)}"
                
        except Exception as e:
            return False, f"Error checking language files: {str(e)}"

    def test_specific_text_updates(self):
        """Test specific text updates mentioned in review request"""
        try:
            # Load config.js
            with open('/app/js/config.js', 'r') as f:
                config_content = f.read()
            
            # Load en.js 
            with open('/app/js/lang/en.js', 'r') as f:
                en_content = f.read()
            
            checks = [
                ("whatNum updated in config.js", r"whatNum.*That doesn't look right\. Please enter a valid number", config_content),
                ("walletBalanceLow includes deposit instructions", r"walletBalanceLow.*Tap.*My Wallet.*Deposit.*to top up", config_content), 
                ("urlShortenerSelect added in config.js", r"urlShortenerSelect.*Shorten, brand, or track your links", config_content),
                ("select kept as 'Please select an option'", r"select.*Please select an option", config_content),
                ("phoneNumberLeads updated in config.js", r"phoneNumberLeads.*Buy verified phone leads or validate your own numbers", config_content),
                ("phoneNumberLeads updated in en.js", r"phoneNumberLeads.*Buy verified phone leads or validate your own numbers", en_content),
                ("askValidAmount updated in config.js", r"askValidAmount.*Please enter a valid amount", config_content),
                ("askValidAmount updated in en.js", r"askValidAmount.*Please enter a valid amount", en_content),
                ("showDepositNgnInfo grammar fixed - config.js", r"wallet will be updated", config_content),
                ("showDepositNgnInfo grammar fixed - en.js", r"wallet will be updated", en_content),
            ]
            
            failed_checks = []
            for check_name, pattern, content in checks:
                if not re.search(pattern, content, re.DOTALL):
                    failed_checks.append(check_name)
            
            if not failed_checks:
                return True, f"All {len(checks)} text updates verified"
            else:
                return False, f"Failed: {', '.join(failed_checks)}"
                
        except Exception as e:
            return False, f"Error checking text updates: {str(e)}"

    def test_error_message_improvements(self):
        """Test that error messages have been improved"""
        try:
            with open('/app/js/config.js', 'r') as f:
                config_content = f.read()
            
            with open('/app/js/lang/en.js', 'r') as f:
                en_content = f.read()
            
            checks = [
                ("redIssueUrlBitly clear error", r"redIssueUrlBitly.*Link shortening failed.*contact.*SUPPORT_USERNAME", config_content),
                ("redIssueUrlCuttly clear error", r"redIssueUrlCuttly.*Link shortening failed.*contact.*SUPPORT_USERNAME", config_content),
                ("issueGettingPrice clear error in en.js", r"issueGettingPrice.*couldn't fetch.*contact.*SUPPORT_USERNAME", en_content),
            ]
            
            failed_checks = []
            for check_name, pattern, content in checks:
                if not re.search(pattern, content, re.DOTALL):
                    failed_checks.append(check_name)
            
            if not failed_checks:
                return True, f"All {len(checks)} error message improvements verified"
            else:
                return False, f"Failed: {', '.join(failed_checks)}"
                
        except Exception as e:
            return False, f"Error checking error messages: {str(e)}"

    def test_translated_phoneNumberLeads(self):
        """Test that phoneNumberLeads text is properly translated"""
        try:
            lang_files = [
                ('/app/js/lang/fr.js', 'French', r'phoneNumberLeads.*Achetez des leads téléphoniques vérifiés ou validez vos propres numéros'),
                ('/app/js/lang/hi.js', 'Hindi', r'phoneNumberLeads.*सत्यापित फ़ोन लीड खरीदें या अपने नंबर मान्य करें'),
                ('/app/js/lang/zh.js', 'Chinese', r'phoneNumberLeads.*购买经验证的电话线索或验证您自己的号码')
            ]
            
            failed_langs = []
            for file_path, lang_name, pattern in lang_files:
                with open(file_path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if not re.search(pattern, content):
                    failed_langs.append(lang_name)
            
            if not failed_langs:
                return True, f"All {len(lang_files)} translated phoneNumberLeads texts verified"
            else:
                return False, f"Failed translations: {', '.join(failed_langs)}"
                
        except Exception as e:
            return False, f"Error checking translations: {str(e)}"

    def test_syntax_validation(self):
        """Test that all files pass Node.js syntax validation"""
        try:
            files = [
                '/app/js/config.js',
                '/app/js/lang/en.js', 
                '/app/js/lang/fr.js',
                '/app/js/lang/hi.js',
                '/app/js/lang/zh.js'
            ]
            
            failed_files = []
            for file_path in files:
                try:
                    result = subprocess.run(['node', '--check', file_path], 
                                          capture_output=True, text=True, timeout=10)
                    if result.returncode != 0:
                        failed_files.append(f"{Path(file_path).name}: {result.stderr}")
                except subprocess.TimeoutExpired:
                    failed_files.append(f"{Path(file_path).name}: timeout")
                except Exception as e:
                    failed_files.append(f"{Path(file_path).name}: {str(e)}")
            
            if not failed_files:
                return True, f"All {len(files)} files pass Node.js syntax validation"
            else:
                return False, f"Syntax errors: {'; '.join(failed_files)}"
                
        except Exception as e:
            return False, f"Error during syntax validation: {str(e)}"

def main():
    """Main test runner for UX validation"""
    tester = UXValidationTester()
    
    print("🚀 Starting NomadlyBot UX Validation Testing")
    print("=" * 60)
    
    # Run all UX validation tests
    tester.run_test("config.js userKeyboard reordered correctly", tester.test_keyboard_reordering_config)
    tester.run_test("All language files have consistent keyboard elements", tester.test_language_files_keyboard_consistency)
    tester.run_test("Specific text updates implemented", tester.test_specific_text_updates)
    tester.run_test("Error messages improved for clarity", tester.test_error_message_improvements)
    tester.run_test("phoneNumberLeads translated in all language files", tester.test_translated_phoneNumberLeads)
    tester.run_test("All files pass Node.js syntax validation", tester.test_syntax_validation)
    
    # Print summary
    print("\n" + "=" * 60)
    print(f"📊 UX Validation Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    success_rate = (tester.tests_passed / tester.tests_run * 100) if tester.tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    if tester.errors:
        print("\n❌ Failed Tests:")
        for error in tester.errors:
            print(f"  - {error}")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All UX validation tests passed!")
        return 0
    else:
        print("⚠️  Some UX validation tests failed - see details above")
        return 1

if __name__ == "__main__":
    sys.exit(main())