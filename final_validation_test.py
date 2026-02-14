#!/usr/bin/env python3

import subprocess
import sys
import re
from pathlib import Path

def test_keyboard_order_simple():
    """Simple test for keyboard order in config.js"""
    with open('/app/js/config.js', 'r') as f:
        content = f.read()
    
    # Find userKeyboard section 
    keyboard_match = re.search(r'const userKeyboard = \{[\s\S]*?keyboard: \[([\s\S]*?)\]', content)
    if not keyboard_match:
        return False, "Could not find userKeyboard"
    
    keyboard_section = keyboard_match.group(1)
    lines = keyboard_section.split('\n')
    
    # Look for the specific order
    found_elements = []
    for line in lines:
        if 'user.urlShortenerMain' in line:
            found_elements.append('urlShortenerMain')
        elif 'user.hostingDomainsRedirect' in line:
            found_elements.append('hostingDomainsRedirect')
        elif 'user.phoneNumberLeads' in line:
            found_elements.append('phoneNumberLeads')
        elif 'user.wallet, user.viewPlan' in line:
            found_elements.append('wallet, viewPlan')
        elif 'user.buyPlan' in line:
            found_elements.append('buyPlan')
    
    expected_order = ['urlShortenerMain', 'hostingDomainsRedirect', 'phoneNumberLeads', 'wallet, viewPlan', 'buyPlan']
    
    # Check if the found elements match expected order (first 5 elements)
    if found_elements[:5] == expected_order:
        return True, f"Keyboard order correct: {' -> '.join(found_elements[:5])}"
    else:
        return False, f"Expected: {expected_order}, Found: {found_elements[:5]}"

def run_comprehensive_test():
    """Run all validation tests"""
    tests_run = 0
    tests_passed = 0
    
    print("🚀 Comprehensive NomadlyBot UX Validation")
    print("=" * 50)
    
    # Test 1: Keyboard ordering
    tests_run += 1
    print(f"\n🔍 Test 1: Keyboard ordering in config.js")
    success, message = test_keyboard_order_simple()
    if success:
        tests_passed += 1
        print(f"✅ PASS - {message}")
    else:
        print(f"❌ FAIL - {message}")
    
    # Test 2: Syntax validation
    tests_run += 1
    print(f"\n🔍 Test 2: Node.js syntax validation")
    files = ['/app/js/config.js', '/app/js/lang/en.js', '/app/js/lang/fr.js', '/app/js/lang/hi.js', '/app/js/lang/zh.js']
    all_pass = True
    for file_path in files:
        try:
            result = subprocess.run(['node', '--check', file_path], capture_output=True, timeout=5)
            if result.returncode != 0:
                all_pass = False
                break
        except:
            all_pass = False
            break
    
    if all_pass:
        tests_passed += 1
        print(f"✅ PASS - All {len(files)} files pass syntax validation")
    else:
        print(f"❌ FAIL - Syntax validation failed")
    
    # Test 3: Text updates
    tests_run += 1
    print(f"\n🔍 Test 3: Key text updates")
    
    with open('/app/js/config.js', 'r') as f:
        config_content = f.read()
    
    text_checks = [
        ("whatNum", "That doesn't look right. Please enter a valid number."),
        ("urlShortenerSelect", "Shorten, brand, or track your links:"),
        ("phoneNumberLeads", "Buy verified phone leads or validate your own numbers:"),
        ("walletBalanceLow", "Tap \"👛 My Wallet\" → \"➕💵 Deposit\" to top up")
    ]
    
    failed_checks = []
    for key, expected_text in text_checks:
        if expected_text not in config_content:
            failed_checks.append(key)
    
    if not failed_checks:
        tests_passed += 1
        print(f"✅ PASS - All {len(text_checks)} key text updates found")
    else:
        print(f"❌ FAIL - Missing updates: {', '.join(failed_checks)}")
    
    # Test 4: Health endpoint
    tests_run += 1
    print(f"\n🔍 Test 4: Health endpoint check")
    try:
        result = subprocess.run(['python', '/app/backend_test.py'], capture_output=True, text=True, timeout=30)
        if result.returncode == 0 and "All tests passed!" in result.stdout:
            tests_passed += 1
            print(f"✅ PASS - Health endpoint working")
        else:
            print(f"❌ FAIL - Health endpoint issues")
    except:
        print(f"❌ FAIL - Could not test health endpoint")
    
    # Summary
    print("\n" + "=" * 50)
    print(f"📊 Final Results: {tests_passed}/{tests_run} tests passed")
    success_rate = (tests_passed / tests_run * 100) if tests_run > 0 else 0
    print(f"📈 Success Rate: {success_rate:.1f}%")
    
    if tests_passed == tests_run:
        print("🎉 All validation tests passed!")
        return 0
    else:
        print("⚠️  Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(run_comprehensive_test())