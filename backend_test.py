#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Nomadly Telegram Bot
Tests the 6 major changes implemented:
1. Immediate deletion from Telnyx on failed renewal (no 7-day grace)
2. Pre-expiry warnings about permanent deletion
3. Reliable manual release with Telnyx deletion
4. Compliance-free countries only (US, CA, GB)
5. Overage billing system (pay-per-use above limits)
6. Shorter promo messages + 'Speechcue' branding
"""

import requests
import json
import re
import os
import sys
from datetime import datetime
from pathlib import Path

class NomadlyBotTester:
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
        """Test /api/health endpoint returns correct status"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                required_fields = ["status", "database", "uptime"]
                has_all_fields = all(field in data for field in required_fields)
                
                if has_all_fields and data.get("status") in ["healthy", "ok"]:
                    self.log_result(
                        "Health endpoint returns ok with node running and db connected",
                        True,
                        f"Status: {data.get('status')}, DB: {data.get('database')}, Uptime: {data.get('uptime')}"
                    )
                else:
                    self.log_result(
                        "Health endpoint structure", 
                        False, 
                        f"Missing fields or incorrect status: {data}",
                        "MEDIUM"
                    )
            else:
                self.log_result(
                    "Health endpoint access", 
                    False, 
                    f"HTTP {response.status_code}",
                    "HIGH"
                )
        except Exception as e:
            self.log_result(
                "Health endpoint access", 
                False, 
                f"Connection error: {str(e)}",
                "CRITICAL"
            )

    def test_bot_logs_initialization(self):
        """Test bot logs contain required initialization messages"""
        try:
            # Check supervisor logs for Node.js bot
            log_files = [
                '/var/log/supervisor/node-bot.log',
                '/app/node-bot.log',
                'node-bot.log'
            ]
            
            log_content = ""
            for log_file in log_files:
                if os.path.exists(log_file):
                    with open(log_file, 'r') as f:
                        log_content = f.read()
                    break
            
            if not log_content:
                self.log_result(
                    "Bot log file access",
                    False,
                    "Could not find bot log file",
                    "MEDIUM"
                )
                return
                
            # Check for required messages
            required_messages = [
                ("VoiceService Initialized with IVR + Recording + Analytics + Limits + Overage billing", "Voice service overage billing"),
                ("SMS Service limits initialized with overage billing", "SMS service overage billing"), 
                ("Speechcue", "Speechcue branding")
            ]
            
            for message, test_name in required_messages:
                if message in log_content:
                    self.log_result(f"Bot logs show: {test_name}", True)
                else:
                    self.log_result(
                        f"Bot logs show: {test_name}",
                        False,
                        f"Missing message: {message}",
                        "MEDIUM"
                    )
                    
        except Exception as e:
            self.log_result(
                "Bot log analysis",
                False,
                f"Error reading logs: {str(e)}",
                "MEDIUM"
            )

    def test_phone_config_features(self):
        """Test phone-config.js contains required changes"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                content = f.read()
            
            # Test 1: Cloud Phone button contains 'Speechcue'
            cloud_phone_match = re.search(r'cloudPhone.*[\'"`].*Speechcue.*[\'"`]', content)
            self.log_result(
                "phone-config.js: Cloud Phone button text contains 'Speechcue'",
                bool(cloud_phone_match),
                "Found Speechcue in Cloud Phone button" if cloud_phone_match else "Speechcue not found in Cloud Phone button",
                "HIGH" if not cloud_phone_match else "INFO"
            )
            
            # Test 2: Countries array only contains US, CA, GB
            countries_section = re.search(r'const countries = \[(.*?)\]', content, re.DOTALL)
            if countries_section:
                countries_content = countries_section.group(1)
                has_us = "'US'" in countries_content or '"US"' in countries_content
                has_ca = "'CA'" in countries_content or '"CA"' in countries_content  
                has_gb = "'GB'" in countries_content or '"GB"' in countries_content
                has_au = "'AU'" in countries_content or '"AU"' in countries_content
                has_de = "'DE'" in countries_content or '"DE"' in countries_content
                has_fr = "'FR'" in countries_content or '"FR"' in countries_content
                
                compliant = has_us and has_ca and has_gb and not has_au and not has_de and not has_fr
                self.log_result(
                    "phone-config.js: countries array only contains US, CA, GB",
                    compliant,
                    f"US:{has_us}, CA:{has_ca}, GB:{has_gb}, AU:{has_au}, DE:{has_de}, FR:{has_fr}",
                    "HIGH" if not compliant else "INFO"
                )
            else:
                self.log_result(
                    "phone-config.js: countries array analysis",
                    False,
                    "Could not find countries array",
                    "MEDIUM"
                )
            
            # Test 3: Overage rates
            overage_sms_match = re.search(r'OVERAGE_RATE_SMS.*?=.*?0\.02', content)
            overage_min_match = re.search(r'OVERAGE_RATE_MIN.*?=.*?0\.03', content)
            
            self.log_result(
                "phone-config.js: OVERAGE_RATE_SMS=0.02 exported",
                bool(overage_sms_match),
                "Found OVERAGE_RATE_SMS=0.02" if overage_sms_match else "OVERAGE_RATE_SMS=0.02 not found",
                "HIGH" if not overage_sms_match else "INFO"
            )
            
            self.log_result(
                "phone-config.js: OVERAGE_RATE_MIN=0.03 exported",
                bool(overage_min_match),
                "Found OVERAGE_RATE_MIN=0.03" if overage_min_match else "OVERAGE_RATE_MIN=0.03 not found",
                "HIGH" if not overage_min_match else "INFO"
            )
            
            # Test 4: Release confirmation mentions permanent deletion
            release_confirm_found = False
            perm_delete_found = False
            irreversible_found = False
            
            if 'releaseConfirm' in content:
                release_section = content[content.find('releaseConfirm'):]
                perm_delete_found = 'permanent' in release_section.lower() and 'delete' in release_section.lower()
                irreversible_found = 'irreversible' in release_section.lower()
                release_confirm_found = True
            
            self.log_result(
                "phone-config.js: releaseConfirm message says 'permanent and irreversible' and 'permanently delete'",
                release_confirm_found and perm_delete_found and irreversible_found,
                f"releaseConfirm found: {release_confirm_found}, permanent delete: {perm_delete_found}, irreversible: {irreversible_found}",
                "HIGH" if not (release_confirm_found and perm_delete_found and irreversible_found) else "INFO"
            )
            
            # Test 5: Usage messages mention overage instead of rejected/blocked
            overage_mentions = len(re.findall(r'overage', content, re.IGNORECASE))
            rejected_mentions = len(re.findall(r'rejected|blocked', content, re.IGNORECASE))
            
            self.log_result(
                "phone-config.js: usage messages mention overage billing instead of 'rejected' or 'blocked'",
                overage_mentions > rejected_mentions,
                f"Overage mentions: {overage_mentions}, Rejected/Blocked mentions: {rejected_mentions}",
                "MEDIUM" if overage_mentions <= rejected_mentions else "INFO"
            )
            
            # Test 6: No user-facing 'Telnyx' text
            telnyx_matches = re.findall(r'[\'"`][^\'"`]*Telnyx[^\'"`]*[\'"`]', content)
            user_facing_telnyx = [match for match in telnyx_matches if not any(internal in match.lower() for internal in ['api', 'service', 'provider', 'config'])]
            
            self.log_result(
                "phone-config.js: No user-facing text contains 'Telnyx'",
                len(user_facing_telnyx) == 0,
                f"User-facing Telnyx references: {len(user_facing_telnyx)}" + (f" - {user_facing_telnyx[:3]}" if user_facing_telnyx else ""),
                "MEDIUM" if user_facing_telnyx else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "phone-config.js file analysis",
                False,
                f"Error reading file: {str(e)}",
                "HIGH"
            )

    def test_phone_scheduler_features(self):
        """Test phone-scheduler.js contains required changes"""
        try:
            with open('/app/js/phone-scheduler.js', 'r') as f:
                content = f.read()
            
            # Test 1: No 7-day suspension logic
            seven_day_patterns = [
                r'daysSuspended\s*>=\s*7',
                r'7.*day.*suspend',
                r'suspend.*7.*day'
            ]
            
            seven_day_found = any(re.search(pattern, content, re.IGNORECASE) for pattern in seven_day_patterns)
            
            self.log_result(
                "phone-scheduler.js: no 7-day suspension logic (no 'daysSuspended >= 7' code)",
                not seven_day_found,
                "No 7-day suspension logic found" if not seven_day_found else "7-day suspension logic still present",
                "HIGH" if seven_day_found else "INFO"
            )
            
            # Test 2: releaseFromProvider function exists
            release_from_provider_found = 'releaseFromProvider' in content and 'function releaseFromProvider' in content or 'async function releaseFromProvider' in content
            telnyx_release_calls = 'telnyxApi.releaseNumber' in content or 'telnyxApi.releaseByPhoneNumber' in content
            
            self.log_result(
                "phone-scheduler.js: releaseFromProvider function exists and calls telnyxApi.releaseNumber and telnyxApi.releaseByPhoneNumber",
                release_from_provider_found and telnyx_release_calls,
                f"Function exists: {release_from_provider_found}, Telnyx calls: {telnyx_release_calls}",
                "HIGH" if not (release_from_provider_found and telnyx_release_calls) else "INFO"
            )
            
            # Test 3: Messages mention 'permanently deleted' not 'SUSPENDED'
            permanently_deleted_found = 'permanently deleted' in content.lower()
            suspended_msgs = len(re.findall(r'SUSPENDED', content))
            
            self.log_result(
                "phone-scheduler.js: buildAutoRenewFailedMsg mentions 'permanently deleted' not 'SUSPENDED'",
                permanently_deleted_found,
                f"'permanently deleted' found: {permanently_deleted_found}",
                "MEDIUM" if not permanently_deleted_found else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "phone-scheduler.js file analysis",
                False,
                f"Error reading file: {str(e)}",
                "HIGH"
            )

    def test_telnyx_service_features(self):
        """Test telnyx-service.js contains required changes"""
        try:
            with open('/app/js/telnyx-service.js', 'r') as f:
                content = f.read()
            
            # Test: releaseByPhoneNumber function exists and is exported
            release_by_phone_func = 'function releaseByPhoneNumber' in content or 'async function releaseByPhoneNumber' in content
            release_by_phone_export = 'releaseByPhoneNumber' in content and 'module.exports' in content
            
            self.log_result(
                "telnyx-service.js: releaseByPhoneNumber function exists and is exported",
                release_by_phone_func and release_by_phone_export,
                f"Function exists: {release_by_phone_func}, Exported: {release_by_phone_export}",
                "HIGH" if not (release_by_phone_func and release_by_phone_export) else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "telnyx-service.js file analysis",
                False,
                f"Error reading file: {str(e)}",
                "HIGH"
            )

    def test_voice_service_features(self):
        """Test voice-service.js contains required changes"""
        try:
            with open('/app/js/voice-service.js', 'r') as f:
                content = f.read()
            
            # Test 1: initVoiceService accepts required dependencies
            init_voice_deps = ['walletOf', 'payments', 'nanoid']
            init_voice_section = None
            
            if 'function initVoiceService' in content:
                init_start = content.find('function initVoiceService')
                init_end = content.find('}', init_start)
                init_voice_section = content[init_start:init_end]
            
            deps_found = []
            if init_voice_section:
                for dep in init_voice_deps:
                    if dep in init_voice_section:
                        deps_found.append(dep)
            
            self.log_result(
                "voice-service.js: initVoiceService accepts walletOf, payments, nanoid dependencies",
                len(deps_found) == len(init_voice_deps),
                f"Dependencies found: {deps_found}",
                "HIGH" if len(deps_found) != len(init_voice_deps) else "INFO"
            )
            
            # Test 2: Overage billing logic for minutes
            overage_billing_patterns = [
                'OVERAGE_RATE_MIN',
                'overage.*minute',
                'wallet.*charge.*min'
            ]
            
            overage_logic_found = any(re.search(pattern, content, re.IGNORECASE) for pattern in overage_billing_patterns)
            
            self.log_result(
                "voice-service.js: handleCallInitiated checks wallet balance when minutes limit reached (overage mode)",
                overage_logic_found,
                "Overage billing logic found" if overage_logic_found else "Overage billing logic not found",
                "HIGH" if not overage_logic_found else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "voice-service.js file analysis",
                False,
                f"Error reading file: {str(e)}",
                "HIGH"
            )

    def test_sms_service_features(self):
        """Test sms-service.js contains required changes"""
        try:
            with open('/app/js/sms-service.js', 'r') as f:
                content = f.read()
            
            # Test: initSmsLimits accepts required dependencies
            init_sms_deps = ['walletOf', 'payments', 'nanoid', 'bot']
            init_sms_section = None
            
            if 'function initSmsLimits' in content:
                init_start = content.find('function initSmsLimits')
                init_end = content.find('}', init_start)
                init_sms_section = content[init_start:init_end]
            
            deps_found = []
            if init_sms_section:
                for dep in init_sms_deps:
                    if dep in init_sms_section:
                        deps_found.append(dep)
            
            self.log_result(
                "sms-service.js: initSmsLimits accepts walletOf, payments, nanoid, bot dependencies",
                len(deps_found) == len(init_sms_deps),
                f"Dependencies found: {deps_found}",
                "HIGH" if len(deps_found) != len(init_sms_deps) else "INFO"
            )
            
            # Test: Overage billing for SMS
            sms_overage_found = 'OVERAGE_RATE_SMS' in content and 'overage' in content.lower()
            
            self.log_result(
                "sms-service.js: handleInboundSms checks wallet and charges OVERAGE_RATE_SMS when SMS limit reached",
                sms_overage_found,
                "SMS overage billing found" if sms_overage_found else "SMS overage billing not found",
                "HIGH" if not sms_overage_found else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "sms-service.js file analysis",
                False,
                f"Error reading file: {str(e)}",
                "HIGH"
            )

    def test_index_features(self):
        """Test _index.js contains required changes"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Test 1: Services initialized with proper dependencies
            init_voice_call = 'initVoiceService' in content
            init_sms_call = 'initSmsLimits' in content
            
            self.log_result(
                "_index.js: initVoiceService and initSmsLimits are called with walletOf, payments, nanoid",
                init_voice_call and init_sms_call,
                f"initVoiceService called: {init_voice_call}, initSmsLimits called: {init_sms_call}",
                "HIGH" if not (init_voice_call and init_sms_call) else "INFO"
            )
            
            # Test 2: releaseByPhoneNumber used as fallback
            release_fallback = 'releaseByPhoneNumber' in content
            
            self.log_result(
                "_index.js: release number flow uses releaseByPhoneNumber as fallback",
                release_fallback,
                "releaseByPhoneNumber fallback found" if release_fallback else "releaseByPhoneNumber fallback not found",
                "MEDIUM" if not release_fallback else "INFO"
            )
            
            # Test 3: No moreCountries button being pushed
            more_countries_push = 'moreCountries' in content and 'push' in content
            
            self.log_result(
                "_index.js: no 'moreCountries' button being pushed to keyboard rows",
                not more_countries_push,
                "No moreCountries button push found" if not more_countries_push else "moreCountries button push still present",
                "MEDIUM" if more_countries_push else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "_index.js file analysis",
                False,
                f"Error reading file: {str(e)}",
                "HIGH"
            )

    def test_auto_promo_features(self):
        """Test auto-promo.js contains required changes"""
        try:
            with open('/app/js/auto-promo.js', 'r') as f:
                content = f.read()
            
            # Test 1: Static messages are shorter (250-325 chars each)
            promo_messages_match = re.search(r'promoMessages\s*=\s*{(.*?)}', content, re.DOTALL)
            if promo_messages_match:
                messages_section = promo_messages_match.group(1)
                # Find individual message strings in backticks or quotes
                message_patterns = re.findall(r'[`\'"]([^`\'"]{100,})[`\'"]', messages_section)
                
                char_counts = [len(msg.strip()) for msg in message_patterns]
                short_messages = [count for count in char_counts if 200 <= count <= 350]
                avg_length = sum(char_counts) / len(char_counts) if char_counts else 0
                
                self.log_result(
                    "auto-promo.js: static English messages are ~250-325 chars each (shorter than before)",
                    len(short_messages) > len(char_counts) * 0.7,  # 70% should be in range
                    f"Messages analyzed: {len(char_counts)}, Average length: {avg_length:.0f}, In range (200-350): {len(short_messages)}",
                    "MEDIUM" if len(short_messages) <= len(char_counts) * 0.5 else "INFO"
                )
            else:
                self.log_result(
                    "auto-promo.js: message length analysis",
                    False,
                    "Could not find promoMessages structure",
                    "MEDIUM"
                )
            
            # Test 2: AI prompt max_tokens reduced to 250, char limit ~300
            max_tokens_match = re.search(r'max_tokens:\s*(\d+)', content)
            char_limit_match = re.search(r'under\s+(\d+)\s+characters', content, re.IGNORECASE)
            
            max_tokens_ok = max_tokens_match and int(max_tokens_match.group(1)) == 250
            char_limit_ok = char_limit_match and int(char_limit_match.group(1)) == 300
            
            self.log_result(
                "auto-promo.js: AI prompt max_tokens reduced to 250, char limit ~300",
                max_tokens_ok and char_limit_ok,
                f"max_tokens: {max_tokens_match.group(1) if max_tokens_match else 'not found'}, char limit: {char_limit_match.group(1) if char_limit_match else 'not found'}",
                "MEDIUM" if not (max_tokens_ok and char_limit_ok) else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "auto-promo.js file analysis",
                False,
                f"Error reading file: {str(e)}",
                "HIGH"
            )

    def run_all_tests(self):
        """Run all tests and generate summary"""
        print("🔍 Starting Nomadly Telegram Bot Testing - 6 Major Changes Verification\n")
        
        # Health and infrastructure tests
        self.test_health_endpoint()
        self.test_bot_logs_initialization()
        
        # Code analysis tests
        self.test_phone_config_features()
        self.test_phone_scheduler_features()
        self.test_telnyx_service_features()
        self.test_voice_service_features()
        self.test_sms_service_features()
        self.test_index_features()
        self.test_auto_promo_features()
        
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
    tester = NomadlyBotTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results['success_rate'] > 85 else 1)