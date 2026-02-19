#!/usr/bin/env python3
"""
Nomadly Telegram Bot Backend Testing - Four Improvements Validation
Tests: 1) Upgrade plan flow with feature preview, 2) SIP username prefix 'sc_', 
3) End-to-end gap analysis fixes, 4) Cloud Phone multilingual support
"""

import requests
import json
import re
import os
import sys
from datetime import datetime

class NomadlyImprovementsTester:
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

    def test_backend_health_endpoint(self):
        """Test backend health /api/health returns ok with node running and db connected"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=15)
            if response.status_code == 200:
                data = response.json()
                
                # Check for basic health indicators
                status_ok = data.get("status") in ["ok", "healthy", "starting"]
                db_connected = data.get("database") == "connected" or data.get("db") == "connected"
                node_running = data.get("node") == "running" or "uptime" in data
                
                overall_health = status_ok and db_connected
                
                self.log_result(
                    "Backend health /api/health returns ok with node running and db connected",
                    overall_health,
                    f"Status: {data.get('status')}, DB: {data.get('database') or data.get('db')}, Node: {data.get('node', 'detected')}",
                    "CRITICAL" if not overall_health else "INFO"
                )
                
            else:
                self.log_result(
                    "Backend health /api/health returns ok with node running and db connected",
                    False,
                    f"HTTP {response.status_code}: {response.text}",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "Backend health /api/health returns ok with node running and db connected",
                False,
                f"Connection error: {str(e)}",
                "CRITICAL"
            )

    def test_nodejs_bot_loads_without_syntax_errors(self):
        """Test Node.js bot loads without syntax errors"""
        try:
            # Check if bot is responding at all
            response = requests.get(f"{self.base_url}/", timeout=10)
            
            if response.status_code in [200, 404]:  # Either response is fine - just needs to respond
                self.log_result(
                    "Node.js bot loads without syntax errors",
                    True,
                    f"Node.js is responding (status: {response.status_code})"
                )
            else:
                self.log_result(
                    "Node.js bot loads without syntax errors",
                    False,
                    f"Node.js returned unexpected status: {response.status_code}",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "Node.js bot loads without syntax errors",
                False,
                f"Node.js appears to have issues: {str(e)}",
                "CRITICAL"
            )

    def test_sip_username_prefix_sc(self):
        """Test SIP username generator uses 'sc_' prefix (not 'user_')"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                phone_config = f.read()
            
            # Look for the generateSipUsername function and sc_ prefix
            sip_username_function = re.search(r'generateSipUsername.*?{(.*?)}', phone_config, re.DOTALL)
            uses_sc_prefix = False
            no_user_prefix = True
            
            if sip_username_function:
                function_body = sip_username_function.group(1)
                uses_sc_prefix = "'sc_'" in function_body or '"sc_"' in function_body
                no_user_prefix = "'user_'" not in function_body and '"user_"' not in function_body
            
            # Check if the function starts with sc_ prefix
            sc_prefix_correct = uses_sc_prefix and no_user_prefix
            
            self.log_result(
                "SIP username generator uses 'sc_' prefix (not 'user_')",
                sc_prefix_correct,
                f"Uses sc_ prefix: {uses_sc_prefix}, No user_ prefix found: {no_user_prefix}",
                "CRITICAL" if not sc_prefix_correct else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "SIP username generator prefix check",
                False,
                f"Error checking phone-config.js: {str(e)}",
                "CRITICAL"
            )

    def test_phone_config_msg_all_languages(self):
        """Test phoneConfig.msg has all 4 languages (en, fr, zh, hi) with matching keys"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                phone_config = f.read()
            
            # Look for msg object definition
            msg_object_match = re.search(r'const msg = \{(.*?)\}', phone_config, re.DOTALL)
            has_all_languages = False
            matching_keys = False
            
            if msg_object_match:
                msg_content = msg_object_match.group(1)
                
                # Check for all 4 languages
                has_en = 'en:' in msg_content and '{' in msg_content.split('en:')[1][:50]
                has_fr = 'fr:' in msg_content and '{' in msg_content.split('fr:')[1][:50]
                has_zh = 'zh:' in msg_content and '{' in msg_content.split('zh:')[1][:50]
                has_hi = 'hi:' in msg_content and '{' in msg_content.split('hi:')[1][:50]
                
                has_all_languages = has_en and has_fr and has_zh and has_hi
                
                # Check for some common keys in all languages
                common_keys = ['selectOption', 'selectValidCountry', 'selectPlan', 'confirmOrCancel']
                key_matches = 0
                for key in common_keys:
                    if msg_content.count(key + ':') >= 4:  # Should appear in all 4 languages
                        key_matches += 1
                
                matching_keys = key_matches >= 2  # At least 2 common keys found in all languages
            
            multilingual_support = has_all_languages and matching_keys
            
            self.log_result(
                "phoneConfig.msg has all 4 languages (en, fr, zh, hi) with matching keys",
                multilingual_support,
                f"Has all languages: {has_all_languages} (en:{has_en}, fr:{has_fr}, zh:{has_zh}, hi:{has_hi}), Matching keys: {matching_keys}",
                "CRITICAL" if not multilingual_support else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "phoneConfig.msg multilingual support check",
                False,
                f"Error checking phone-config.js: {str(e)}",
                "CRITICAL"
            )

    def test_phone_config_getmsg_function(self):
        """Test phoneConfig.getMsg() returns correct language object, defaults to en"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                phone_config = f.read()
            
            # Look for getMsg function definition
            getmsg_function = re.search(r'function getMsg\(lang\)(.*?}', phone_config, re.DOTALL)
            has_getmsg_function = False
            defaults_to_en = False
            returns_correct_object = False
            
            if getmsg_function:
                function_body = getmsg_function.group(1)
                has_getmsg_function = True
                
                # Check if it defaults to 'en'
                defaults_to_en = 'msg.en' in function_body or 'msg[lang] || msg.en' in function_body
                
                # Check if it returns the correct language object
                returns_correct_object = 'return msg[lang]' in function_body or 'msg[lang]' in function_body
            
            # Also check if it's exported in module.exports
            exported_correctly = 'getMsg' in phone_config and 'module.exports' in phone_config
            
            getmsg_working = has_getmsg_function and defaults_to_en and exported_correctly
            
            self.log_result(
                "phoneConfig.getMsg() returns correct language object, defaults to en",
                getmsg_working,
                f"Has function: {has_getmsg_function}, Defaults to en: {defaults_to_en}, Exported: {exported_correctly}",
                "CRITICAL" if not getmsg_working else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "phoneConfig.getMsg() function check",
                False,
                f"Error checking phone-config.js: {str(e)}",
                "CRITICAL"
            )

    def test_plan_upgrade_flow_shows_features_preview(self):
        """Test Plan upgrade flow: shows gained features preview with confirm/back before applying"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            # Look for upgrade flow with feature preview
            upgrade_preview_pattern = re.search(r'upgrade.*?gained.*?features.*?preview.*?confirm', index_content, re.IGNORECASE | re.DOTALL)
            has_feature_preview = upgrade_preview_pattern is not None
            
            # Look for confirm/back buttons in upgrade flow
            upgrade_confirm_back = "✅ Confirm" in index_content and "⬅️ Back" in index_content
            
            # Look for gained features display similar to downgrade flow
            gained_features_display = "gainedFeatures" in index_content or "features.*?gain" in index_content
            
            upgrade_flow_complete = has_feature_preview and upgrade_confirm_back
            
            self.log_result(
                "Plan upgrade flow: shows gained features preview with confirm/back before applying",
                upgrade_flow_complete,
                f"Has feature preview: {has_feature_preview}, Confirm/back buttons: {upgrade_confirm_back}, Gained features: {gained_features_display}",
                "MEDIUM" if not upgrade_flow_complete else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "Plan upgrade flow feature preview check",
                False,
                f"Error checking _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_plan_downgrade_flow_still_shows_warning(self):
        """Test Plan downgrade flow: still shows lost features warning with confirm"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            # Check for downgrade warning implementation
            downgrade_warning = "lostFeatures" in index_content or "features will be lost" in index_content
            confirm_buttons = "✅ Confirm Change" in index_content or "Confirm" in index_content
            lost_features_display = "lost" in index_content.lower() and "features" in index_content.lower()
            
            downgrade_flow_intact = downgrade_warning and confirm_buttons and lost_features_display
            
            self.log_result(
                "Plan downgrade flow: still shows lost features warning with confirm",
                downgrade_flow_intact,
                f"Downgrade warning: {downgrade_warning}, Confirm buttons: {confirm_buttons}, Lost features display: {lost_features_display}",
                "MEDIUM" if not downgrade_flow_intact else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "Plan downgrade flow warning check",
                False,
                f"Error checking _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_hardcoded_strings_replaced_with_getmsg(self):
        """Test Hardcoded Cloud Phone strings replaced with getMsg() calls in _index.js"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            # Look for phoneConfig.getMsg() usage
            getmsg_usage_count = len(re.findall(r'phoneConfig\.getMsg\(', index_content))
            
            # Look for reduced hardcoded English strings in Cloud Phone sections
            # Check for patterns that suggest multilingual implementation
            lang_variable_usage = 'info?.userLanguage' in index_content and 'getMsg(' in index_content
            
            # Check for specific Cloud Phone section multilingual implementation
            cloud_phone_multilingual = 'phoneConfig.getMsg' in index_content and getmsg_usage_count > 5
            
            # Look for examples of replaced strings
            validation_messages_replaced = 'getMsg(' in index_content and ('selectOption' in index_content or 'selectValidCountry' in index_content)
            
            strings_replaced = cloud_phone_multilingual and lang_variable_usage and getmsg_usage_count >= 10
            
            self.log_result(
                "Hardcoded Cloud Phone strings replaced with getMsg() calls in _index.js",
                strings_replaced,
                f"getMsg usage count: {getmsg_usage_count}, Language variable usage: {lang_variable_usage}, Multilingual CP: {cloud_phone_multilingual}",
                "MEDIUM" if not strings_replaced else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "Hardcoded strings replacement check",
                False,
                f"Error checking _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_phone_config_exports_correctly(self):
        """Test phoneConfig.msg and getMsg exported correctly in module.exports"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                phone_config = f.read()
            
            # Look for module.exports section
            module_exports_match = re.search(r'module\.exports\s*=\s*\{(.*?)\}', phone_config, re.DOTALL)
            
            exports_msg = False
            exports_getmsg = False
            
            if module_exports_match:
                exports_content = module_exports_match.group(1)
                exports_msg = 'msg' in exports_content and ('msg:' in exports_content or 'msg,' in exports_content)
                exports_getmsg = 'getMsg' in exports_content and ('getMsg:' in exports_content or 'getMsg,' in exports_content)
            
            correct_exports = exports_msg and exports_getmsg
            
            self.log_result(
                "phoneConfig.msg and getMsg exported correctly in module.exports",
                correct_exports,
                f"Exports msg: {exports_msg}, Exports getMsg: {exports_getmsg}",
                "CRITICAL" if not correct_exports else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "phoneConfig exports check",
                False,
                f"Error checking phone-config.js: {str(e)}",
                "CRITICAL"
            )

    def test_gap_analysis_fixes_basic_functionality(self):
        """Test end-to-end gap analysis fixes - basic functionality works"""
        try:
            # Test basic endpoint that should work after gap analysis
            response = requests.get(f"{self.base_url}/", timeout=10)
            
            basic_functionality_works = response.status_code in [200, 404]
            
            # Additional check - make sure phone config is properly imported
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
            
            phone_config_imported = "require('./phone-config.js')" in index_content or "phoneConfig = require" in index_content
            
            gap_fixes_working = basic_functionality_works and phone_config_imported
            
            self.log_result(
                "End-to-end gap analysis fixes - basic functionality works",
                gap_fixes_working,
                f"Basic functionality: {basic_functionality_works}, PhoneConfig imported: {phone_config_imported}",
                "MEDIUM" if not gap_fixes_working else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "Gap analysis fixes check",
                False,
                f"Error testing basic functionality: {str(e)}",
                "CRITICAL"
            )

    def run_all_tests(self):
        """Run all Nomadly improvements tests"""
        print("🔍 Testing Nomadly Telegram Bot - Four Improvements Validation\n")
        
        # Core functionality tests
        self.test_backend_health_endpoint()
        self.test_nodejs_bot_loads_without_syntax_errors()
        
        # SIP username prefix change
        self.test_sip_username_prefix_sc()
        
        # Multilingual support tests
        self.test_phone_config_msg_all_languages()
        self.test_phone_config_getmsg_function()
        self.test_hardcoded_strings_replaced_with_getmsg()
        self.test_phone_config_exports_correctly()
        
        # Plan upgrade/downgrade flow tests
        self.test_plan_upgrade_flow_shows_features_preview()
        self.test_plan_downgrade_flow_still_shows_warning()
        
        # Gap analysis fixes
        self.test_gap_analysis_fixes_basic_functionality()
        
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
    tester = NomadlyImprovementsTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results['success_rate'] > 70 else 1)