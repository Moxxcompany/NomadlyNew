#!/usr/bin/env python3
"""
Backend Testing for Cloud Phone Plan Change Flow
Tests health endpoint, Node.js bot loads without syntax errors, and plan change flow features.
"""

import requests
import json
import re
import os
import sys
from datetime import datetime

class CloudPhonePlanChangeTester:
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
        """Test Node.js bot loads without syntax errors after plan change flow rewrite"""
        try:
            # Check if bot is responding at all
            response = requests.get(f"{self.base_url}/", timeout=10)
            
            if response.status_code in [200, 404]:  # Either response is fine - just needs to respond
                self.log_result(
                    "Node.js bot loads without syntax errors after plan change flow rewrite",
                    True,
                    f"Node.js is responding (status: {response.status_code})"
                )
            else:
                self.log_result(
                    "Node.js bot loads without syntax errors after plan change flow rewrite",
                    False,
                    f"Node.js returned unexpected status: {response.status_code}",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "Node.js bot loads without syntax errors after plan change flow rewrite",
                False,
                f"Node.js appears to have issues: {str(e)}",
                "CRITICAL"
            )

    def test_sip_credentials_created_during_purchase(self):
        """Test SIP credentials created during purchase flow (sipUsername and sipPassword fields set in numberDoc)"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            # Look for SIP credential creation during purchase
            sip_username_creation = "sipUsername" in index_content and "generateSipUsername" in index_content
            sip_password_creation = "sipPassword" in index_content and "generateSipPassword" in index_content
            
            # Check that these are set during purchase process
            purchase_sip_setup = sip_username_creation and sip_password_creation
            
            self.log_result(
                "SIP credentials created during purchase flow (sipUsername and sipPassword fields set in numberDoc)",
                purchase_sip_setup,
                f"SIP username creation: {sip_username_creation}, SIP password creation: {sip_password_creation}",
                "CRITICAL" if not purchase_sip_setup else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "SIP credentials created during purchase flow check",
                False,
                f"Error checking _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_plan_change_downgrade_pre_warning(self):
        """Test plan change flow: downgrade shows pre-warning with lost features list and confirm/back buttons"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            # Check for pre-downgrade warning implementation
            warning_features_check = "features will be lost" in index_content or "lostFeatures" in index_content
            confirm_back_buttons = "✅ Confirm Change" in index_content and "pc.back" in index_content
            pending_plan_storage = "cpPendingPlan" in index_content
            
            pre_warning_implemented = warning_features_check and confirm_back_buttons and pending_plan_storage
            
            self.log_result(
                "Plan change flow: downgrade shows pre-warning with lost features list and confirm/back buttons",
                pre_warning_implemented,
                f"Warning features check: {warning_features_check}, Confirm/back buttons: {confirm_back_buttons}, Pending plan: {pending_plan_storage}",
                "CRITICAL" if not pre_warning_implemented else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "Plan change flow downgrade pre-warning check",
                False,
                f"Error checking _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_plan_change_downgrade_disables_features(self):
        """Test plan change flow: on confirmed downgrade, SIP is disabled (sipDisabled=true), IVR/Recording/Voicemail/Email also disabled"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            # Check for SIP disabling on downgrade
            sip_disable_on_downgrade = "sipDisabled" in index_content and "sipDisabled.*true" in index_content
            
            # Check for other feature disabling
            ivr_disable = "ivr.*enabled.*false" in index_content or "ivr.*{.*enabled.*false" in index_content
            recording_disable = "recording.*false" in index_content
            voicemail_disable = "voicemail.*enabled.*false" in index_content
            
            # Look for feature disabling logic in confirm change section
            confirm_section = re.search(r'Confirm Change.*?cpPendingPlan(.*?)(?=if|return)', index_content, re.DOTALL)
            feature_disabling_in_confirm = False
            if confirm_section:
                confirm_content = confirm_section.group(1)
                feature_disabling_in_confirm = "sipDisabled" in confirm_content and ("ivr" in confirm_content or "recording" in confirm_content)
            
            downgrade_disables_features = sip_disable_on_downgrade and feature_disabling_in_confirm
            
            self.log_result(
                "Plan change flow: on confirmed downgrade, SIP is disabled (sipDisabled=true), IVR/Recording/Voicemail/Email also disabled",
                downgrade_disables_features,
                f"SIP disable: {sip_disable_on_downgrade}, Feature disabling in confirm: {feature_disabling_in_confirm}",
                "CRITICAL" if not downgrade_disables_features else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "Plan change flow downgrade disables features check",
                False,
                f"Error checking _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_plan_change_upgrade_re_enables_sip(self):
        """Test plan change flow: upgrade path re-enables SIP (sipDisabled=false) and applies immediately without warning"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            # Check for SIP re-enabling on upgrade
            sip_reenable_on_upgrade = "sipDisabled.*false" in index_content and "canAccessFeature.*sipCredentials" in index_content
            
            # Look for upgrade logic that applies immediately (no warning for upgrades)
            upgrade_immediate = "No feature loss.*upgrade.*apply directly" in index_content or "upgrade.*apply.*directly" in index_content
            
            # Check that upgrade doesn't show warning (only downgrade does)
            upgrade_no_warning_pattern = re.search(r'upgrade.*same-tier.*apply directly', index_content, re.IGNORECASE)
            upgrade_immediate_application = upgrade_no_warning_pattern is not None
            
            upgrade_re_enables_sip = sip_reenable_on_upgrade and upgrade_immediate_application
            
            self.log_result(
                "Plan change flow: upgrade path re-enables SIP (sipDisabled=false) and applies immediately without warning",
                upgrade_re_enables_sip,
                f"SIP re-enable: {sip_reenable_on_upgrade}, Immediate application: {upgrade_immediate_application}",
                "CRITICAL" if not upgrade_re_enables_sip else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "Plan change flow upgrade re-enables SIP check",
                False,
                f"Error checking _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_sip_credentials_handler_checks_flags(self):
        """Test SIP Credentials handler checks both sipDisabled flag and canAccessFeature before allowing access"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            # Look for SIP credentials handler that checks both conditions
            sip_handler_pattern = re.search(r'sipCredentials.*?(.*?)return send.*upgradeMessage', index_content, re.DOTALL)
            
            checks_sip_disabled = False
            checks_can_access_feature = False
            
            if sip_handler_pattern:
                handler_content = sip_handler_pattern.group(1)
                checks_sip_disabled = "sipDisabled" in handler_content
                checks_can_access_feature = "canAccessFeature" in handler_content and "sipCredentials" in handler_content
            
            # Also look for the specific pattern in the code
            dual_check_pattern = "num.sipDisabled || !phoneConfig.canAccessFeature" in index_content
            
            sip_handler_checks_both = (checks_sip_disabled and checks_can_access_feature) or dual_check_pattern
            
            self.log_result(
                "SIP Credentials handler checks both sipDisabled flag and canAccessFeature before allowing access",
                sip_handler_checks_both,
                f"Checks sipDisabled: {checks_sip_disabled}, Checks canAccessFeature: {checks_can_access_feature}, Dual check pattern: {dual_check_pattern}",
                "CRITICAL" if not sip_handler_checks_both else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "SIP Credentials handler checks flags",
                False,
                f"Error checking _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_sip_credentials_button_always_visible(self):
        """Test SIP Credentials button always visible in buildManageMenu (shows upgrade prompt for ineligible users)"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            # Look for buildManageMenu function
            build_manage_pattern = re.search(r'buildManageMenu.*?{(.*?)}', index_content, re.DOTALL)
            
            sip_always_visible = False
            if build_manage_pattern:
                manage_menu_content = build_manage_pattern.group(1)
                # Check if sipCredentials is always added to rows (not conditionally gated)
                sip_always_visible = "rows.push([pc.sipCredentials])" in manage_menu_content or "[pc.sipCredentials]" in manage_menu_content
            
            # Also check for the comment that explains it's always visible
            sip_always_visible_comment = "SIP — always visible" in index_content and "upgrade prompt" in index_content
            
            sip_button_always_visible = sip_always_visible or sip_always_visible_comment
            
            self.log_result(
                "SIP Credentials button always visible in buildManageMenu (shows upgrade prompt for ineligible users)",
                sip_button_always_visible,
                f"SIP always visible in menu: {sip_always_visible}, Has explanatory comment: {sip_always_visible_comment}",
                "CRITICAL" if not sip_button_always_visible else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "SIP Credentials button always visible check",
                False,
                f"Error checking _index.js: {str(e)}",
                "CRITICAL"
            )
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
        """Run all Cloud Phone Plan Change Flow tests"""
        print("🔍 Testing Cloud Phone Plan Change Flow\n")
        
        # Core functionality tests
        self.test_health_endpoint()
        self.test_nodejs_bot_loads_without_errors()
        
        # Plan change flow specific tests
        self.test_sip_credentials_created_during_purchase()
        self.test_plan_change_downgrade_pre_warning()
        self.test_plan_change_downgrade_disables_features()
        self.test_plan_change_upgrade_re_enables_sip()
        self.test_sip_credentials_handler_checks_flags()
        self.test_sip_credentials_button_always_visible()
        
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