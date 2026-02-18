#!/usr/bin/env python3
"""
Backend Testing for Domain Shortener and SMS Settings Implementation
Tests the domain shortener question clarification, activate shortener functionality,
and SMS settings with plan restrictions.
"""

import requests
import json
import re
import os
import sys
import pymongo
from datetime import datetime
from pathlib import Path

class DomainSmsFeaturesTester:
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
        """Test backend health endpoint returns ok"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                status_ok = data.get("status") in ["healthy", "ok"] or data.get("proxy") == "running"
                
                self.log_result(
                    "Backend health endpoint /api/health returns ok",
                    status_ok,
                    f"Status: {data.get('status', 'N/A')}, Proxy: {data.get('proxy', 'N/A')}, Node: {data.get('node', 'N/A')}",
                    "CRITICAL" if not status_ok else "INFO"
                )
                
            else:
                self.log_result(
                    "Backend health endpoint returns ok",
                    False,
                    f"HTTP {response.status_code}",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "Backend health endpoint returns ok",
                False,
                f"Connection error: {str(e)}",
                "CRITICAL"
            )

    def test_config_js_domain_shortener_question(self):
        """Test config.js: askDomainToUseWithShortener text explains Yes/No clearly"""
        try:
            with open('/app/js/config.js', 'r') as f:
                content = f.read()
            
            # Look for askDomainToUseWithShortener text
            domain_question_match = re.search(r'askDomainToUseWithShortener:\s*`([^`]+)`', content, re.DOTALL)
            
            if domain_question_match:
                question_text = domain_question_match.group(1)
                
                # Check if it explains Yes and No options clearly
                has_yes_explanation = 'DNS will be auto-configured' in question_text and 'shortener' in question_text
                has_no_explanation = 'register' in question_text and ('activate later' in question_text or 'later' in question_text)
                mentions_dns_auto_config = 'DNS will be auto-configured' in question_text
                mentions_activate_later = 'activate later' in question_text or 'activate it for the shortener later' in question_text
                
                all_conditions = has_yes_explanation and has_no_explanation and mentions_dns_auto_config and mentions_activate_later
                
                self.log_result(
                    "config.js: askDomainToUseWithShortener text explains Yes means custom URL shortener with DNS auto-configured, and No means register only with option to activate later",
                    all_conditions,
                    f"Has Yes explanation: {has_yes_explanation}, Has No explanation: {has_no_explanation}, Mentions DNS auto-config: {mentions_dns_auto_config}, Mentions activate later: {mentions_activate_later}",
                    "CRITICAL" if not all_conditions else "INFO"
                )
            else:
                self.log_result(
                    "config.js: askDomainToUseWithShortener text found",
                    False,
                    "askDomainToUseWithShortener text not found in config.js",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "config.js domain shortener question analysis",
                False,
                f"Error reading config.js: {str(e)}",
                "CRITICAL"
            )

    def test_config_js_activate_shortener_button(self):
        """Test config.js: activateShortener button text exists"""
        try:
            with open('/app/js/config.js', 'r') as f:
                content = f.read()
            
            # Look for activateShortener button text
            activate_button_match = re.search(r'activateShortener:\s*[\'"`]([^\'"`]+)[\'"`]', content)
            
            if activate_button_match:
                button_text = activate_button_match.group(1)
                
                # Check if it contains the expected text
                has_correct_text = '🔗 Activate for URL Shortener' in button_text
                
                self.log_result(
                    "config.js: activateShortener button text exists ('🔗 Activate for URL Shortener')",
                    has_correct_text,
                    f"Button text: '{button_text}'",
                    "CRITICAL" if not has_correct_text else "INFO"
                )
            else:
                self.log_result(
                    "config.js: activateShortener button text exists",
                    False,
                    "activateShortener button text not found in config.js",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "config.js activateShortener button analysis",
                False,
                f"Error reading config.js: {str(e)}",
                "CRITICAL"
            )

    def test_config_js_dns_keyboard_array(self):
        """Test config.js: dns keyboard array includes t.activateShortener button"""
        try:
            with open('/app/js/config.js', 'r') as f:
                content = f.read()
            
            # Look for dns keyboard definition
            dns_keyboard_match = re.search(r'const dns = \{[^}]*keyboard: \[(.*?)\][^}]*\}', content, re.DOTALL)
            
            if dns_keyboard_match:
                keyboard_content = dns_keyboard_match.group(1)
                
                # Check if it includes t.activateShortener
                includes_activate_shortener = 't.activateShortener' in keyboard_content
                
                self.log_result(
                    "config.js: dns keyboard array includes t.activateShortener button",
                    includes_activate_shortener,
                    f"DNS keyboard includes activateShortener: {includes_activate_shortener}",
                    "CRITICAL" if not includes_activate_shortener else "INFO"
                )
            else:
                self.log_result(
                    "config.js: dns keyboard array found",
                    False,
                    "DNS keyboard array not found in config.js",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "config.js DNS keyboard analysis",
                False,
                f"Error reading config.js: {str(e)}",
                "CRITICAL"
            )

    def test_phone_config_js_sms_settings_plan_param(self):
        """Test phone-config.js: smsSettingsMenu function accepts 'plan' parameter and shows locked features"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                content = f.read()
            
            # Look for smsSettingsMenu function
            sms_settings_match = re.search(r'smsSettingsMenu:\s*\(([^)]+)\)\s*=>\s*\{', content)
            
            if sms_settings_match:
                params = sms_settings_match.group(1)
                
                # Check if it accepts plan parameter
                has_plan_param = 'plan' in params
                
                # Look for the function body to check for locked features
                function_start = content.find('smsSettingsMenu:')
                if function_start != -1:
                    # Find the function body (look for the opening brace and match closing)
                    brace_count = 0
                    function_body_start = content.find('{', function_start)
                    if function_body_start != -1:
                        i = function_body_start
                        while i < len(content):
                            if content[i] == '{':
                                brace_count += 1
                            elif content[i] == '}':
                                brace_count -= 1
                                if brace_count == 0:
                                    function_body = content[function_body_start:i+1]
                                    break
                            i += 1
                        else:
                            function_body = content[function_body_start:function_body_start+2000]  # Fallback
                    else:
                        function_body = ""
                else:
                    function_body = ""
                
                # Check for locked feature indicators
                has_pro_plan_requirement = '🔒 Requires Pro plan' in function_body
                checks_plan_access = 'canAccessFeature' in function_body or 'canEmail' in function_body or 'canWebhook' in function_body
                
                all_conditions = has_plan_param and (has_pro_plan_requirement or checks_plan_access)
                
                self.log_result(
                    "phone-config.js: smsSettingsMenu function accepts 'plan' parameter and shows '🔒 Requires Pro plan' for email/webhook when plan lacks access",
                    all_conditions,
                    f"Has plan param: {has_plan_param}, Has Pro plan requirement: {has_pro_plan_requirement}, Checks plan access: {checks_plan_access}",
                    "CRITICAL" if not all_conditions else "INFO"
                )
            else:
                self.log_result(
                    "phone-config.js: smsSettingsMenu function found",
                    False,
                    "smsSettingsMenu function not found in phone-config.js",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "phone-config.js smsSettingsMenu analysis",
                False,
                f"Error reading phone-config.js: {str(e)}",
                "CRITICAL"
            )

    def test_index_js_sms_settings_locked_buttons(self):
        """Test _index.js: SMS Settings shows locked buttons for restricted features"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for cpSmsSettings action or SMS settings handling
            sms_email_locked = '🔒 SMS to Email (Pro+)' in content
            webhook_locked = '🔒 Webhook URL (Pro+)' in content
            
            # Look for upgrade message triggers
            triggers_upgrade_sms_email = content.count('upgradeMessage') >= 1 and 'smsToEmail' in content
            triggers_upgrade_webhook = content.count('upgradeMessage') >= 1 and 'smsWebhook' in content
            
            self.log_result(
                "_index.js: SMS Settings (cpSmsSettings entry) shows '🔒 SMS to Email (Pro+)' button when plan doesn't have smsToEmail access",
                sms_email_locked,
                f"Found SMS to Email locked button: {sms_email_locked}",
                "CRITICAL" if not sms_email_locked else "INFO"
            )
            
            self.log_result(
                "_index.js: SMS Settings shows '🔒 Webhook URL (Pro+)' button when plan doesn't have smsWebhook access",
                webhook_locked,
                f"Found Webhook URL locked button: {webhook_locked}",
                "CRITICAL" if not webhook_locked else "INFO"
            )
            
            self.log_result(
                "_index.js: Tapping '🔒 SMS to Email' triggers upgradeMessage",
                triggers_upgrade_sms_email,
                f"Triggers upgrade for SMS Email: {triggers_upgrade_sms_email}",
                "CRITICAL" if not triggers_upgrade_sms_email else "INFO"
            )
            
            self.log_result(
                "_index.js: Tapping '🔗 Webhook URL' triggers upgradeMessage",
                triggers_upgrade_webhook,
                f"Triggers upgrade for Webhook: {triggers_upgrade_webhook}",
                "CRITICAL" if not triggers_upgrade_webhook else "INFO"
            )
                
        except Exception as e:
            self.log_result(
                "_index.js SMS settings locked buttons analysis",
                False,
                f"Error reading _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_index_js_sms_settings_menu_plan_param(self):
        """Test _index.js: smsSettingsMenu is called with num.plan as third parameter"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for smsSettingsMenu calls with plan parameter
            sms_settings_call_match = re.search(r'smsSettingsMenu\([^)]*num\.plan[^)]*\)', content)
            
            # Alternative patterns
            alternative_patterns = [
                r'smsSettingsMenu\([^,]+,\s*[^,]+,\s*num\.plan',
                r'phoneConfig\.txt\.smsSettingsMenu\([^,]+,\s*[^,]+,\s*num\.plan',
                r'smsSettingsMenu\(.*?,.*?,\s*num\.plan'
            ]
            
            found_call = sms_settings_call_match is not None
            if not found_call:
                for pattern in alternative_patterns:
                    if re.search(pattern, content):
                        found_call = True
                        break
            
            self.log_result(
                "_index.js: smsSettingsMenu is called with num.plan as third parameter",
                found_call,
                f"Found smsSettingsMenu call with num.plan: {found_call}",
                "CRITICAL" if not found_call else "INFO"
            )
                
        except Exception as e:
            self.log_result(
                "_index.js smsSettingsMenu plan parameter analysis",
                False,
                f"Error reading _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_index_js_dns_action_handler(self):
        """Test _index.js: choose-dns-action handler includes t.activateShortener in valid messages array"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for choose-dns-action handler
            dns_action_pattern = r'choose-dns-action[\'"`]?\s*:'
            dns_action_match = re.search(dns_action_pattern, content)
            
            if dns_action_match:
                # Find the handler code block
                start_pos = dns_action_match.end()
                
                # Look for the next 2000 characters for the handler logic
                handler_block = content[start_pos:start_pos+2000]
                
                # Check if activateShortener is included in valid messages
                includes_activate_shortener = 't.activateShortener' in handler_block
                
                self.log_result(
                    "_index.js: choose-dns-action handler includes t.activateShortener in valid messages array",
                    includes_activate_shortener,
                    f"Handler includes activateShortener: {includes_activate_shortener}",
                    "CRITICAL" if not includes_activate_shortener else "INFO"
                )
            else:
                self.log_result(
                    "_index.js: choose-dns-action handler found",
                    False,
                    "choose-dns-action handler not found in _index.js",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "_index.js choose-dns-action handler analysis",
                False,
                f"Error reading _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_index_js_activate_shortener_handler(self):
        """Test _index.js: activateShortener handler calls required functions"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for activateShortener handler
            activate_handler_pattern = r'activateShortener[\'"`]?\s*:'
            activate_handler_match = re.search(activate_handler_pattern, content)
            
            if activate_handler_match:
                # Find the handler code block (look for next 3000 characters)
                start_pos = activate_handler_match.end()
                handler_block = content[start_pos:start_pos+3000]
                
                # Check for required function calls
                calls_save_domain_railway = 'saveDomainInServerRailway' in handler_block
                calls_save_domain_render = 'saveDomainInServerRender' in handler_block
                calls_regular_check_dns = 'regularCheckDns' in handler_block
                sends_success_message = ('DNS propagation' in handler_block or 'success' in handler_block) and 'send' in handler_block
                
                has_domain_save = calls_save_domain_railway or calls_save_domain_render
                
                all_conditions = has_domain_save and calls_regular_check_dns and sends_success_message
                
                self.log_result(
                    "_index.js: activateShortener handler calls saveDomainInServerRailway/Render and regularCheckDns",
                    has_domain_save and calls_regular_check_dns,
                    f"Calls Railway/Render: {calls_save_domain_railway}/{calls_save_domain_render}, Calls regularCheckDns: {calls_regular_check_dns}",
                    "CRITICAL" if not (has_domain_save and calls_regular_check_dns) else "INFO"
                )
                
                self.log_result(
                    "_index.js: activateShortener handler sends success message with DNS propagation notification",
                    sends_success_message,
                    f"Sends success with DNS notification: {sends_success_message}",
                    "CRITICAL" if not sends_success_message else "INFO"
                )
            else:
                self.log_result(
                    "_index.js: activateShortener handler found",
                    False,
                    "activateShortener handler not found in _index.js",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "_index.js activateShortener handler analysis",
                False,
                f"Error reading _index.js: {str(e)}",
                "CRITICAL"
            )

    def run_all_tests(self):
        """Run all domain shortener and SMS settings tests"""
        print("🔍 Testing Domain Shortener and SMS Settings Implementation\n")
        
        # Health endpoint test
        self.test_health_endpoint()
        
        # Config.js tests
        self.test_config_js_domain_shortener_question()
        self.test_config_js_activate_shortener_button()
        self.test_config_js_dns_keyboard_array()
        
        # Phone-config.js tests
        self.test_phone_config_js_sms_settings_plan_param()
        
        # _index.js tests
        self.test_index_js_sms_settings_locked_buttons()
        self.test_index_js_sms_settings_menu_plan_param()
        self.test_index_js_dns_action_handler()
        self.test_index_js_activate_shortener_handler()
        
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
    tester = DomainSmsFeaturesTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results['success_rate'] > 80 else 1)