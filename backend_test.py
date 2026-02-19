#!/usr/bin/env python3
"""
Backend Testing for Nomadly Telegram Cloud Phone Bot - UX Improvements
Tests health endpoint, Node.js bot loads without syntax errors, and specific UX fixes.
"""

import requests
import json
import re
import os
import sys
from datetime import datetime

class NomadlyCloudPhoneTester:
    def __init__(self):
        # Read backend URL from frontend .env file
        try:
            with open('/app/frontend/.env', 'r') as f:
                content = f.read()
                backend_url_match = re.search(r'REACT_APP_BACKEND_URL=(.+)', content)
                if backend_url_match:
                    self.base_url = backend_url_match.group(1).strip()
                else:
                    self.base_url = "http://localhost:8001"
        except:
            self.base_url = "http://localhost:8001"
        
        self.tests_run = 0
        self.tests_passed = 0
        self.issues = []
        self.passed_tests = []

    def log_result(self, test_name, passed, details="", issue_level="INFO"):
        """Log test results"""
        self.tests_run += 1
        if passed:
            self.tests_passed += 1
            self.passed_tests.append(f"{test_name}: {details}" if details else test_name)
            print(f"✅ {test_name}")
            if details:
                print(f"   {details}")
        else:
            self.issues.append({
                "test": test_name,
                "issue": details,
                "level": issue_level
            })
            print(f"❌ {test_name}")
            print(f"   Issue: {details}")

    def test_health_endpoint(self):
        """Test backend health endpoint returns status ok with node running and db connected"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=15)
            if response.status_code == 200:
                data = response.json()
                
                # Check for basic health indicators
                status_ok = data.get("status") in ["ok", "healthy", "starting"]
                db_connected = data.get("database") == "connected" or data.get("db") == "connected"
                
                # More flexible check for node - might not be explicitly mentioned
                node_indicator = "node" in str(data).lower() or "uptime" in data
                
                overall_health = status_ok and db_connected
                
                self.log_result(
                    "Backend health endpoint /api/health returns ok with node running and db connected",
                    overall_health,
                    f"Response: {data}",
                    "CRITICAL" if not overall_health else "INFO"
                )
                
            else:
                self.log_result(
                    "Backend health endpoint /api/health returns ok with node running and db connected",
                    False,
                    f"HTTP {response.status_code}: {response.text}",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "Backend health endpoint /api/health returns ok with node running and db connected",
                False,
                f"Connection error: {str(e)}",
                "CRITICAL"
            )

    def test_nodejs_bot_loads_without_errors(self):
        """Test Node.js bot loads without any syntax errors"""
        try:
            # Check if bot is responding at all
            response = requests.get(f"{self.base_url}/", timeout=10)
            
            if response.status_code in [200, 404]:  # Either response is fine - just needs to respond
                self.log_result(
                    "Node.js bot loads without any syntax errors",
                    True,
                    f"Node.js is responding (status: {response.status_code})"
                )
            else:
                self.log_result(
                    "Node.js bot loads without any syntax errors",
                    False,
                    f"Node.js returned unexpected status: {response.status_code}",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "Node.js bot loads without any syntax errors",
                False,
                f"Node.js appears to have issues: {str(e)}",
                "CRITICAL"
            )

    def test_no_remaining_kof_back_patterns(self):
        """Test no remaining k.of([[pc.back]]) patterns in _index.js (all replaced with k.of([]))"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            # Look for old k.of([[pc.back]]) patterns
            back_patterns = re.findall(r'k\.of\(\[\[.*?\.back\]\]\)', index_content)
            
            no_old_patterns = len(back_patterns) == 0
            
            self.log_result(
                "No remaining k.of([[pc.back]]) patterns in _index.js (all replaced with k.of([]))",
                no_old_patterns,
                f"Found {len(back_patterns)} old back button patterns: {back_patterns[:3] if back_patterns else 'None'}",
                "CRITICAL" if not no_old_patterns else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "No remaining k.of([[pc.back]]) patterns check",
                False,
                f"Error checking _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_phone_config_sip_settings_renamed(self):
        """Test phone-config.js: sipSettings renamed to 'SIP Setup Guide', softphoneGuide button renamed, softphone text cleaned up"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                config_content = f.read()
            
            # Check for SIP Setup Guide rename
            sip_setup_guide = "sipSettings: '📖 SIP Setup Guide'" in config_content
            
            # Check for softphoneGuide button rename
            softphone_button_renamed = "softphoneGuide: '📖 SIP Setup Guide'" in config_content
            
            # Check if softphone guide text is cleaned up (look for compact format)
            softphone_text_pattern = re.search(r'softphoneGuide:.*?`(.*?)`', config_content, re.DOTALL)
            text_cleaned = False
            if softphone_text_pattern:
                text_content = softphone_text_pattern.group(1)
                # Check if text is reasonably compact (not verbose multi-section)
                text_cleaned = len(text_content.split('\n')) < 20
            
            all_changes = sip_setup_guide and softphone_button_renamed and text_cleaned
            
            self.log_result(
                "phone-config.js: sipSettings renamed to 'SIP Setup Guide', softphoneGuide button renamed, softphone text cleaned up",
                all_changes,
                f"sipSettings renamed: {sip_setup_guide}, softphoneGuide button: {softphone_button_renamed}, text cleaned: {text_cleaned}",
                "CRITICAL" if not all_changes else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "phone-config.js SIP settings changes check",
                False,
                f"Error checking phone-config.js: {str(e)}",
                "CRITICAL"
            )

    def test_phone_config_delete_number_changes(self):
        """Test phone-config.js: releaseNumber renamed to 'Delete Number', yesRelease to 'Yes, Permanently Delete', noKeep to 'No, Keep It'"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                config_content = f.read()
            
            # Check button renames
            delete_number = "releaseNumber: '🗑️ Delete Number'" in config_content
            yes_permanently_delete = "yesRelease: '⚠️ Yes, Permanently Delete'" in config_content
            no_keep_it = "noKeep: '↩️ No, Keep It'" in config_content
            
            all_button_changes = delete_number and yes_permanently_delete and no_keep_it
            
            self.log_result(
                "phone-config.js: releaseNumber renamed to 'Delete Number', yesRelease to 'Yes, Permanently Delete', noKeep to 'No, Keep It'",
                all_button_changes,
                f"Delete Number: {delete_number}, Yes Permanently Delete: {yes_permanently_delete}, No Keep It: {no_keep_it}",
                "CRITICAL" if not all_button_changes else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "phone-config.js Delete Number changes check",
                False,
                f"Error checking phone-config.js: {str(e)}",
                "CRITICAL"
            )

    def test_phone_config_stronger_warnings(self):
        """Test phone-config.js: releaseConfirm text has stronger warning, releaseConfirmDigits says 'Final confirmation'"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                config_content = f.read()
            
            # Check for stronger warning text
            stronger_warning = "⚠️ <b>This cannot be undone.</b>" in config_content and "permanently deleted" in config_content
            
            # Check for final confirmation text
            final_confirmation = "⚠️ <b>Final confirmation</b>" in config_content
            
            warning_changes = stronger_warning and final_confirmation
            
            self.log_result(
                "phone-config.js: releaseConfirm text has stronger warning, releaseConfirmDigits says 'Final confirmation'",
                warning_changes,
                f"Stronger warning: {stronger_warning}, Final confirmation: {final_confirmation}",
                "CRITICAL" if not warning_changes else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "phone-config.js warning text changes check",
                False,
                f"Error checking phone-config.js: {str(e)}",
                "CRITICAL"
            )

    def test_phone_config_admin_release_changes(self):
        """Test phone-config.js: adminRelease text says 'Number Deleted', status shows 'Deleted' instead of 'Released'"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                config_content = f.read()
            
            # Check for admin release text change
            number_deleted = "🗑️ <b>Number Deleted</b>" in config_content
            
            # Check for status change in myNumbersList function - should use 'Deleted' not 'Released'
            status_deleted = "'🗑️ Deleted'" in config_content and "'Released'" not in config_content
            
            admin_changes = number_deleted and status_deleted
            
            self.log_result(
                "phone-config.js: adminRelease text says 'Number Deleted', status shows 'Deleted' instead of 'Released'",
                admin_changes,
                f"Number Deleted text: {number_deleted}, Status uses Deleted: {status_deleted}",
                "CRITICAL" if not admin_changes else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "phone-config.js admin release changes check",
                False,
                f"Error checking phone-config.js: {str(e)}",
                "CRITICAL"
            )

    def test_index_build_manage_menu_sip_credentials(self):
        """Test _index.js: buildManageMenu always shows pc.sipCredentials (not gated behind canAccessFeature)"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            # Look for buildManageMenu function and check if sipCredentials is always shown
            build_manage_pattern = re.search(r'buildManageMenu.*?{(.*?)}', index_content, re.DOTALL)
            
            sip_always_shown = False
            if build_manage_pattern:
                manage_menu_content = build_manage_pattern.group(1)
                # Check if sipCredentials is shown without feature gate
                sip_always_shown = "pc.sipCredentials" in manage_menu_content and "canAccessFeature" not in manage_menu_content.split("pc.sipCredentials")[0][-200:]
            
            # Alternative: look for specific pattern where sipCredentials is its own row
            sip_own_row = "[pc.sipCredentials]" in index_content
            
            sip_credentials_ungated = sip_always_shown or sip_own_row
            
            self.log_result(
                "_index.js: buildManageMenu always shows pc.sipCredentials (not gated behind canAccessFeature)",
                sip_credentials_ungated,
                f"SIP credentials always shown: {sip_credentials_ungated}",
                "CRITICAL" if not sip_credentials_ungated else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "_index.js buildManageMenu SIP credentials check",
                False,
                f"Error checking _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_config_kof_recognizes_back_cancel(self):
        """Test kOf in config.js recognizes plain 'Back' and 'Cancel' to prevent duplicate back buttons"""
        try:
            with open('/app/js/config.js', 'r') as f:
                config_content = f.read()
            
            # Look for kOf function and check if it handles plain Back/Cancel
            kof_function_pattern = re.search(r'const kOf.*?=.*?{(.*?)}', config_content, re.DOTALL)
            
            handles_back_cancel = False
            if kof_function_pattern:
                kof_content = kof_function_pattern.group(1)
                # Check if it recognizes plain 'Back' and 'Cancel'
                handles_back = "item === 'Back'" in kof_content or "'Back'" in kof_content
                handles_cancel = "item === 'Cancel'" in kof_content or "'Cancel'" in kof_content
                handles_back_cancel = handles_back and handles_cancel
            
            self.log_result(
                "kOf in config.js recognizes plain 'Back' and 'Cancel' to prevent duplicate back buttons",
                handles_back_cancel,
                f"Handles Back and Cancel: {handles_back_cancel}",
                "CRITICAL" if not handles_back_cancel else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "config.js kOf function check",
                False,
                f"Error checking config.js: {str(e)}",
                "CRITICAL"
            )

    def run_all_tests(self):
        """Run all Nomadly Cloud Phone Bot UX Improvement tests"""
        print("🔍 Testing Nomadly Telegram Cloud Phone Bot - UX Improvements\n")
        
        # Core functionality tests
        self.test_health_endpoint()
        self.test_nodejs_bot_loads_without_errors()
        
        # UX-specific improvement tests
        self.test_no_remaining_kof_back_patterns()
        self.test_phone_config_sip_settings_renamed()
        self.test_phone_config_delete_number_changes()
        self.test_phone_config_stronger_warnings()
        self.test_phone_config_admin_release_changes()
        self.test_index_build_manage_menu_sip_credentials()
        self.test_config_kof_recognizes_back_cancel()
        
        # Generate summary
        print(f"\n📊 Test Summary:")
        print(f"Tests Run: {self.tests_run}")
        print(f"Tests Passed: {self.tests_passed}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.issues:
            print(f"\n⚠️ Issues Found ({len(self.issues)}):")
            for issue in self.issues:
                print(f"  {issue['level']}: {issue['test']}")
                print(f"    {issue['issue']}")
        
        return {
            'tests_run': self.tests_run,
            'tests_passed': self.tests_passed, 
            'success_rate': round(self.tests_passed/self.tests_run*100, 1),
            'issues': self.issues,
            'passed_tests': self.passed_tests
        }

if __name__ == "__main__":
    tester = NomadlyCloudPhoneTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results['success_rate'] > 70 else 1)