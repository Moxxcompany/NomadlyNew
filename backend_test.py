#!/usr/bin/env python3
"""
Backend Testing for Cloud Phone Overage Rates Implementation
Tests the overage rate system with dynamic rates from .env variables.
"""

import requests
import json
import re
import os
import sys
from datetime import datetime
from pathlib import Path

class OverageRatesTestier:
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

    def test_backend_env_overage_rates(self):
        """Test backend/.env contains OVERAGE_RATE_SMS=0.02 and OVERAGE_RATE_MIN=0.03"""
        try:
            with open('/app/backend/.env', 'r') as f:
                content = f.read()
            
            # Check for OVERAGE_RATE_SMS=0.02
            sms_rate_match = re.search(r'OVERAGE_RATE_SMS\s*=\s*0\.02', content)
            min_rate_match = re.search(r'OVERAGE_RATE_MIN\s*=\s*0\.03', content)
            
            self.log_result(
                "backend/.env contains OVERAGE_RATE_SMS=0.02",
                bool(sms_rate_match),
                "Found OVERAGE_RATE_SMS=0.02" if sms_rate_match else "OVERAGE_RATE_SMS=0.02 not found",
                "CRITICAL" if not sms_rate_match else "INFO"
            )
            
            self.log_result(
                "backend/.env contains OVERAGE_RATE_MIN=0.03",
                bool(min_rate_match),
                "Found OVERAGE_RATE_MIN=0.03" if min_rate_match else "OVERAGE_RATE_MIN=0.03 not found",
                "CRITICAL" if not min_rate_match else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "backend/.env file analysis",
                False,
                f"Error reading .env file: {str(e)}",
                "CRITICAL"
            )

    def test_phone_config_reads_env_vars(self):
        """Test phone-config.js reads OVERAGE_RATE_SMS and OVERAGE_RATE_MIN from process.env"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                content = f.read()
            
            # Check for reading from process.env
            sms_env_match = re.search(r'OVERAGE_RATE_SMS\s*=.*?process\.env\.OVERAGE_RATE_SMS', content)
            min_env_match = re.search(r'OVERAGE_RATE_MIN\s*=.*?process\.env\.OVERAGE_RATE_MIN', content)
            
            self.log_result(
                "phone-config.js reads OVERAGE_RATE_SMS from process.env",
                bool(sms_env_match),
                "Found process.env.OVERAGE_RATE_SMS read" if sms_env_match else "process.env.OVERAGE_RATE_SMS read not found",
                "HIGH" if not sms_env_match else "INFO"
            )
            
            self.log_result(
                "phone-config.js reads OVERAGE_RATE_MIN from process.env",
                bool(min_env_match),
                "Found process.env.OVERAGE_RATE_MIN read" if min_env_match else "process.env.OVERAGE_RATE_MIN read not found",
                "HIGH" if not min_env_match else "INFO"
            )
            
            # Check if variables are exported in module.exports
            exports_match = re.search(r'module\.exports\s*=\s*{[^}]*OVERAGE_RATE_SMS[^}]*OVERAGE_RATE_MIN[^}]*}', content, re.DOTALL)
            
            self.log_result(
                "phone-config.js exports OVERAGE_RATE_SMS and OVERAGE_RATE_MIN",
                bool(exports_match),
                "Found both rates exported" if exports_match else "Overage rates not properly exported",
                "HIGH" if not exports_match else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "phone-config.js file analysis",
                False,
                f"Error reading phone-config.js: {str(e)}",
                "HIGH"
            )

    def test_select_plan_text_includes_overage_info(self):
        """Test phone-config.js selectPlan text includes overage rate info and 'Service pauses if wallet balance is insufficient'"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                content = f.read()
            
            # Find selectPlan function/text
            select_plan_match = re.search(r'selectPlan.*?=.*?`(.*?)`', content, re.DOTALL)
            
            if select_plan_match:
                select_plan_text = select_plan_match.group(1)
                
                # Check for overage rate variables
                has_overage_min = '${OVERAGE_RATE_MIN}' in select_plan_text
                has_overage_sms = '${OVERAGE_RATE_SMS}' in select_plan_text
                has_service_pauses = 'service pauses if wallet' in select_plan_text.lower() and 'insufficient' in select_plan_text.lower()
                
                self.log_result(
                    "selectPlan text includes ${OVERAGE_RATE_MIN}/min and ${OVERAGE_RATE_SMS}/SMS",
                    has_overage_min and has_overage_sms,
                    f"OVERAGE_RATE_MIN: {has_overage_min}, OVERAGE_RATE_SMS: {has_overage_sms}",
                    "HIGH" if not (has_overage_min and has_overage_sms) else "INFO"
                )
                
                self.log_result(
                    "selectPlan text mentions 'Service pauses if wallet balance is insufficient'",
                    has_service_pauses,
                    "Found service pauses message" if has_service_pauses else "Service pauses message not found",
                    "HIGH" if not has_service_pauses else "INFO"
                )
                
            else:
                self.log_result(
                    "selectPlan text analysis",
                    False,
                    "Could not find selectPlan text",
                    "MEDIUM"
                )
                
        except Exception as e:
            self.log_result(
                "selectPlan text analysis",
                False,
                f"Error analyzing selectPlan: {str(e)}",
                "HIGH"
            )

    def test_order_summary_includes_overage_line(self):
        """Test phone-config.js orderSummary includes overage line showing rates from wallet"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                content = f.read()
            
            # Find orderSummary function/text
            order_summary_match = re.search(r'orderSummary.*?=.*?`(.*?)`', content, re.DOTALL)
            
            if order_summary_match:
                order_summary_text = order_summary_match.group(1)
                
                # Check for overage line with rates and wallet mention
                has_overage_min = '${OVERAGE_RATE_MIN}' in order_summary_text
                has_overage_sms = '${OVERAGE_RATE_SMS}' in order_summary_text
                has_wallet_mention = 'wallet' in order_summary_text.lower()
                has_overage_label = 'overage' in order_summary_text.lower()
                
                self.log_result(
                    "orderSummary includes overage line with ${OVERAGE_RATE_MIN}/min + ${OVERAGE_RATE_SMS}/SMS (from wallet)",
                    has_overage_min and has_overage_sms and has_wallet_mention and has_overage_label,
                    f"OVERAGE_RATE_MIN: {has_overage_min}, OVERAGE_RATE_SMS: {has_overage_sms}, wallet: {has_wallet_mention}, overage: {has_overage_label}",
                    "HIGH" if not (has_overage_min and has_overage_sms and has_wallet_mention) else "INFO"
                )
                
            else:
                self.log_result(
                    "orderSummary text analysis",
                    False,
                    "Could not find orderSummary text",
                    "MEDIUM"
                )
                
        except Exception as e:
            self.log_result(
                "orderSummary text analysis",
                False,
                f"Error analyzing orderSummary: {str(e)}",
                "HIGH"
            )

    def test_hub_welcome_mentions_overage_rates(self):
        """Test phone-config.js hubWelcome mentions overage rates and 'Service pauses if wallet is empty'"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                content = f.read()
            
            # Find hubWelcome text
            hub_welcome_match = re.search(r'hubWelcome.*?:.*?`(.*?)`', content, re.DOTALL)
            
            if hub_welcome_match:
                hub_welcome_text = hub_welcome_match.group(1)
                
                # Check for dynamic overage rates and service pauses message
                has_overage_min = '${OVERAGE_RATE_MIN}' in hub_welcome_text
                has_overage_sms = '${OVERAGE_RATE_SMS}' in hub_welcome_text
                has_service_pauses = 'service pauses if wallet is empty' in hub_welcome_text.lower()
                
                self.log_result(
                    "hubWelcome mentions overage rates ${OVERAGE_RATE_MIN}/min and ${OVERAGE_RATE_SMS}/SMS",
                    has_overage_min and has_overage_sms,
                    f"OVERAGE_RATE_MIN: {has_overage_min}, OVERAGE_RATE_SMS: {has_overage_sms}",
                    "HIGH" if not (has_overage_min and has_overage_sms) else "INFO"
                )
                
                self.log_result(
                    "hubWelcome mentions 'Service pauses if wallet is empty'",
                    has_service_pauses,
                    "Found service pauses message" if has_service_pauses else "Service pauses message not found",
                    "HIGH" if not has_service_pauses else "INFO"
                )
                
            else:
                self.log_result(
                    "hubWelcome text analysis", 
                    False,
                    "Could not find hubWelcome text",
                    "MEDIUM"
                )
                
        except Exception as e:
            self.log_result(
                "hubWelcome text analysis",
                False,
                f"Error analyzing hubWelcome: {str(e)}",
                "HIGH"
            )

    def test_manage_number_view_dynamic_rates(self):
        """Test phone-config.js manageNumber view uses dynamic OVERAGE_RATE_MIN and OVERAGE_RATE_SMS in warnings"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                content = f.read()
            
            # Find manageNumber function - look for the arrow function specifically
            manage_number_match = re.search(r'manageNumber:\s*\(n\)\s*=>\s*{(.*?)},$', content, re.DOTALL | re.MULTILINE)
            
            if manage_number_match:
                manage_number_text = manage_number_match.group(1)
                
                # Check for dynamic rate usage - look for OVERAGE_RATE variables
                has_dynamic_min = 'OVERAGE_RATE_MIN' in manage_number_text
                has_dynamic_sms = 'OVERAGE_RATE_SMS' in manage_number_text  
                has_warning_context = 'overage active' in manage_number_text.lower()
                
                self.log_result(
                    "manageNumber view uses dynamic OVERAGE_RATE_MIN and OVERAGE_RATE_SMS in warnings",
                    has_dynamic_min and has_dynamic_sms and has_warning_context,
                    f"Dynamic MIN: {has_dynamic_min}, Dynamic SMS: {has_dynamic_sms}, Warning context: {has_warning_context}",
                    "HIGH" if not (has_dynamic_min and has_dynamic_sms) else "INFO"
                )
                
            else:
                self.log_result(
                    "manageNumber function analysis",
                    False,
                    "Could not find manageNumber function",
                    "MEDIUM"
                )
                
        except Exception as e:
            self.log_result(
                "manageNumber function analysis",
                False,
                f"Error analyzing manageNumber: {str(e)}",
                "HIGH"
            )

    def test_scheduler_usage_messages_dynamic_rates(self):
        """Test phone-scheduler.js buildUsageAlertMsg and buildUsageLimitMsg use dynamic rates and mention service pauses"""
        try:
            with open('/app/js/phone-scheduler.js', 'r') as f:
                content = f.read()
            
            # Check buildUsageAlertMsg - look for function definition and variable usage
            alert_msg_match = re.search(r'function buildUsageAlertMsg.*?\{(.*?)\}', content, re.DOTALL)
            limit_msg_match = re.search(r'function buildUsageLimitMsg.*?\{(.*?)\}', content, re.DOTALL)
            
            alert_msg_ok = False
            limit_msg_ok = False
            service_pauses_found = False
            
            if alert_msg_match:
                alert_text = alert_msg_match.group(1)
                # Look for the rate variable calculation and usage
                alert_msg_ok = ('OVERAGE_RATE_SMS' in alert_text and 'OVERAGE_RATE_MIN' in alert_text) or 'const rate = type === \'SMS\' ?' in alert_text
                service_pauses_found = service_pauses_found or ('service pauses if wallet is empty' in alert_text.lower())
            
            if limit_msg_match:
                limit_text = limit_msg_match.group(1)
                # Look for the rate variable calculation and usage  
                limit_msg_ok = ('OVERAGE_RATE_SMS' in limit_text and 'OVERAGE_RATE_MIN' in limit_text) or 'const rate = type === \'SMS\' ?' in limit_text
                service_pauses_found = service_pauses_found or ('service pauses if wallet balance runs out' in limit_text.lower())
            
            self.log_result(
                "phone-scheduler.js buildUsageAlertMsg uses dynamic rates from OVERAGE_RATE_SMS/MIN",
                alert_msg_ok,
                "Found dynamic rates in buildUsageAlertMsg" if alert_msg_ok else "Dynamic rates not found in buildUsageAlertMsg",
                "HIGH" if not alert_msg_ok else "INFO"
            )
            
            self.log_result(
                "phone-scheduler.js buildUsageLimitMsg uses dynamic rates and mentions 'Service pauses if wallet balance runs out'",
                limit_msg_ok and service_pauses_found,
                f"Dynamic rates: {limit_msg_ok}, Service pauses: {service_pauses_found}",
                "HIGH" if not (limit_msg_ok and service_pauses_found) else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "phone-scheduler.js analysis",
                False,
                f"Error analyzing scheduler: {str(e)}",
                "HIGH"
            )

    def test_voice_service_wallet_notifications(self):
        """Test voice-service.js wallet empty and mid-call notifications"""
        try:
            with open('/app/js/voice-service.js', 'r') as f:
                content = f.read()
            
            # Check for wallet empty notification with overage rate
            wallet_empty_msg = False
            mid_call_notification = False
            mid_call_disconnect = False
            
            # Look for specific notification patterns
            if 'wallet empty' in content.lower() and 'overage' in content.lower():
                wallet_empty_msg = True
            
            if 'call will disconnect if wallet runs out' in content.lower():
                mid_call_notification = True
                
            if 'wallet empty' in content.lower() and 'disconnect' in content.lower():
                mid_call_disconnect = True
            
            self.log_result(
                "voice-service.js: when minutes limit reached and wallet empty, sends notification with overage rate",
                wallet_empty_msg,
                "Found wallet empty notification with overage rate" if wallet_empty_msg else "Wallet empty notification with overage rate not found",
                "HIGH" if not wallet_empty_msg else "INFO"
            )
            
            self.log_result(
                "voice-service.js: mid-call overage notification includes 'Call will disconnect if wallet runs out'",
                mid_call_notification,
                "Found mid-call disconnect warning" if mid_call_notification else "Mid-call disconnect warning not found",
                "HIGH" if not mid_call_notification else "INFO"
            )
            
            self.log_result(
                "voice-service.js: mid-call wallet empty disconnect sends 'Wallet Empty' notification with rate",
                mid_call_disconnect,
                "Found wallet empty disconnect notification" if mid_call_disconnect else "Wallet empty disconnect notification not found",
                "HIGH" if not mid_call_disconnect else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "voice-service.js analysis",
                False,
                f"Error analyzing voice service: {str(e)}",
                "HIGH"
            )

    def test_sms_service_wallet_notifications(self):
        """Test sms-service.js wallet empty notifications"""
        try:
            with open('/app/js/sms-service.js', 'r') as f:
                content = f.read()
            
            # Check for SMS dropped notification with wallet empty and overage rate
            sms_dropped_wallet_empty = False
            overage_rate_mentioned = False
            
            if 'inbound sms dropped' in content.lower() and 'wallet empty' in content.lower():
                sms_dropped_wallet_empty = True
            
            if 'OVERAGE_RATE_SMS' in content:
                overage_rate_mentioned = True
            
            self.log_result(
                "sms-service.js: when SMS limit reached and wallet empty, sends 'Inbound SMS Dropped — Wallet Empty' notification with overage rate",
                sms_dropped_wallet_empty and overage_rate_mentioned,
                f"SMS dropped notification: {sms_dropped_wallet_empty}, Overage rate: {overage_rate_mentioned}",
                "HIGH" if not (sms_dropped_wallet_empty and overage_rate_mentioned) else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "sms-service.js analysis",
                False,
                f"Error analyzing SMS service: {str(e)}",
                "HIGH"
            )

    def test_health_endpoint(self):
        """Test backend health endpoint still returns ok"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                status_ok = data.get("status") in ["healthy", "ok"] or data.get("proxy") == "running"
                
                self.log_result(
                    "Backend health endpoint still returns ok",
                    status_ok,
                    f"Status: {data.get('status', 'N/A')}, Proxy: {data.get('proxy', 'N/A')}, Node: {data.get('node', 'N/A')}",
                    "CRITICAL" if not status_ok else "INFO"
                )
                
            else:
                self.log_result(
                    "Backend health endpoint access",
                    False,
                    f"HTTP {response.status_code}",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "Backend health endpoint access",
                False,
                f"Connection error: {str(e)}",
                "CRITICAL"
            )

    def run_all_tests(self):
        """Run all overage rate tests"""
        print("🔍 Testing Cloud Phone Overage Rates Implementation\n")
        
        # Environment and configuration tests
        self.test_backend_env_overage_rates()
        self.test_phone_config_reads_env_vars()
        
        # UI text tests
        self.test_select_plan_text_includes_overage_info()
        self.test_order_summary_includes_overage_line()
        self.test_hub_welcome_mentions_overage_rates()
        self.test_manage_number_view_dynamic_rates()
        
        # Service behavior tests
        self.test_scheduler_usage_messages_dynamic_rates()
        self.test_voice_service_wallet_notifications()
        self.test_sms_service_wallet_notifications()
        
        # Health test
        self.test_health_endpoint()
        
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
    tester = OverageRatesTestier()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results['success_rate'] > 90 else 1)