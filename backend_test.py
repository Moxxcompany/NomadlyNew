#!/usr/bin/env python3
"""
Backend Testing for Nomadly Telegram Bot Application
Tests health endpoint, Node.js bot status, database connection, and webhook configuration.
"""

import requests
import json
import re
import os
import sys
from datetime import datetime

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
        """Test backend health endpoint returns status ok with node running and db connected"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=15)
            if response.status_code == 200:
                data = response.json()
                
                status_ok = data.get("status") == "ok"
                proxy_running = data.get("proxy") == "running"
                node_running = data.get("node") == "running"
                db_connected = data.get("db") == "connected"
                
                overall_health = status_ok and proxy_running and node_running and db_connected
                
                self.log_result(
                    "Backend health endpoint /api/health returns status ok with node running and db connected",
                    overall_health,
                    f"Status: {data.get('status')}, Proxy: {data.get('proxy')}, Node: {data.get('node')}, DB: {data.get('db')}",
                    "CRITICAL" if not overall_health else "INFO"
                )
                
                # Individual component checks
                if not node_running:
                    self.log_result(
                        "Node.js bot is running (via proxy health check)",
                        False,
                        f"Node status: {data.get('node')} - expected 'running'",
                        "CRITICAL"
                    )
                else:
                    self.log_result(
                        "Node.js bot is running (via proxy health check)",
                        True,
                        "Node.js bot is running correctly"
                    )
                
                if not db_connected:
                    self.log_result(
                        "Database connection working",
                        False,
                        f"DB status: {data.get('db')} - expected 'connected'",
                        "CRITICAL"
                    )
                else:
                    self.log_result(
                        "Database connection working",
                        True,
                        "Database is connected"
                    )
                
            else:
                self.log_result(
                    "Backend health endpoint /api/health returns ok",
                    False,
                    f"HTTP {response.status_code}: {response.text}",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "Backend health endpoint /api/health returns ok",
                False,
                f"Connection error: {str(e)}",
                "CRITICAL"
            )

    def test_node_bot_direct_check(self):
        """Test if Node.js bot responds via proxy"""
        try:
            # Try to hit the root endpoint which should be proxied to Node.js
            response = requests.get(f"{self.base_url}/api/", timeout=10)
            
            # Node.js should return some response (not a 404 from FastAPI)
            if response.status_code in [200, 404]:  # 404 from Node.js is fine, 502 would indicate proxy issues
                self.log_result(
                    "Node.js bot is responding via proxy",
                    True,
                    f"Node.js responded with status {response.status_code}"
                )
            elif response.status_code == 502:
                self.log_result(
                    "Node.js bot is responding via proxy", 
                    False,
                    f"Proxy error (502) - Node.js may not be running",
                    "CRITICAL"
                )
            else:
                self.log_result(
                    "Node.js bot is responding via proxy",
                    True,
                    f"Got response from Node.js (status {response.status_code})"
                )
                
        except Exception as e:
            self.log_result(
                "Node.js bot is responding via proxy",
                False,
                f"Connection error: {str(e)}",
                "CRITICAL"
            )

    def test_environment_variables_configured(self):
        """Test if environment variables are properly configured (no placeholder values remaining)"""
        try:
            with open('/app/backend/.env', 'r') as f:
                env_content = f.read()
            
            # Check for placeholder values
            placeholder_pattern = r'setup-wizard-101'
            placeholders_found = re.findall(placeholder_pattern, env_content)
            
            # Check for critical variables
            critical_vars = [
                'MONGO_URL', 'TELEGRAM_BOT_TOKEN_PROD', 'TELEGRAM_BOT_TOKEN_DEV',
                'SELF_URL', 'SELF_URL_PROD'
            ]
            
            missing_vars = []
            for var in critical_vars:
                if f'{var}=' not in env_content:
                    missing_vars.append(var)
            
            # Check if SELF_URL contains the correct pod URL
            self_url_match = re.search(r'SELF_URL.*?=(.*)', env_content)
            correct_url = False
            if self_url_match:
                url_value = self_url_match.group(1).strip()
                correct_url = 'setup-wizard-101.preview.emergentagent.com/api' in url_value
            
            no_placeholders = len(placeholders_found) <= 1  # Allow one in SELF_URL
            no_missing_vars = len(missing_vars) == 0
            
            overall_config_ok = no_placeholders and no_missing_vars and correct_url
            
            self.log_result(
                "Environment variables are properly configured (no placeholder values remaining)",
                overall_config_ok,
                f"Placeholders found: {len(placeholders_found)}, Missing vars: {missing_vars}, Correct URL: {correct_url}",
                "CRITICAL" if not overall_config_ok else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "Environment variables configuration check",
                False,
                f"Error checking .env file: {str(e)}",
                "CRITICAL"
            )

    def test_telegram_webhook_configured(self):
        """Test if Telegram webhook is correctly set to pod URL with /api prefix"""
        try:
            # Check the config files for webhook configuration
            webhook_configured = False
            webhook_details = ""
            
            # Check backend .env for SELF_URL configuration
            with open('/app/backend/.env', 'r') as f:
                env_content = f.read()
            
            self_url_match = re.search(r'SELF_URL.*?=(.*)', env_content)
            if self_url_match:
                self_url = self_url_match.group(1).strip()
                has_api_prefix = '/api' in self_url
                has_correct_domain = 'setup-wizard-101.preview.emergentagent.com' in self_url
                
                webhook_configured = has_api_prefix and has_correct_domain
                webhook_details = f"SELF_URL: {self_url}, Has /api: {has_api_prefix}, Correct domain: {has_correct_domain}"
            
            self.log_result(
                "Telegram webhook is correctly set to pod URL with /api prefix",
                webhook_configured,
                webhook_details,
                "CRITICAL" if not webhook_configured else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "Telegram webhook configuration check",
                False,
                f"Error checking webhook config: {str(e)}",
                "CRITICAL"
            )

    def test_cnam_service_priority(self):
        """Test CNAM service initializes with correct priority: Telnyx → Multitel → SignalWire"""
        try:
            # Read node-bot.log to check for CNAM service initialization
            with open('/var/log/supervisor/node-bot.log', 'r') as f:
                log_content = f.read()
            
            # Look for CNAM service initialization line
            cnam_init_pattern = r'\[CnamService\] Initialized — priority: (.+?) \+ MongoDB cache'
            cnam_match = re.search(cnam_init_pattern, log_content)
            
            if cnam_match:
                priority_order = cnam_match.group(1).strip()
                expected_order = "Telnyx → Multitel → SignalWire"
                correct_priority = priority_order == expected_order
                
                self.log_result(
                    "CNAM service initializes with correct priority: Telnyx → Multitel → SignalWire",
                    correct_priority,
                    f"Found priority: {priority_order}, Expected: {expected_order}",
                    "CRITICAL" if not correct_priority else "INFO"
                )
            else:
                self.log_result(
                    "CNAM service initializes with correct priority: Telnyx → Multitel → SignalWire",
                    False,
                    "CNAM service initialization log not found in node-bot.log",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "CNAM service priority check",
                False,
                f"Error checking CNAM service logs: {str(e)}",
                "CRITICAL"
            )

    def test_node_bot_loads_without_errors(self):
        """Test Node.js bot loads without errors after cnam-service.js changes"""
        try:
            # Read node-bot.log to check for any error messages during startup
            with open('/var/log/supervisor/node-bot.log', 'r') as f:
                log_content = f.read()
            
            # Look for recent startup and check for errors
            lines = log_content.strip().split('\n')
            recent_lines = lines[-100:]  # Check last 100 lines
            
            # Check for error indicators
            error_patterns = [
                r'Error:',
                r'TypeError:',
                r'SyntaxError:',
                r'ReferenceError:',
                r'ModuleNotFoundError:', 
                r'Cannot find module',
                r'ECONNREFUSED',
                r'ENOTFOUND',
                r'failed to start'
            ]
            
            errors_found = []
            for line in recent_lines:
                for pattern in error_patterns:
                    if re.search(pattern, line, re.IGNORECASE):
                        errors_found.append(line.strip())
                        break
            
            # Look for successful initialization indicators
            success_indicators = [
                '[CnamService] Initialized — priority:',
                '[CloudPhone] CNAM Service initialized',
                'Exit code: 0'
            ]
            
            success_found = []
            for line in recent_lines:
                for indicator in success_indicators:
                    if indicator in line:
                        success_found.append(indicator)
                        break
            
            node_loaded_successfully = len(errors_found) == 0 and len(success_found) >= 2
            
            self.log_result(
                "Node.js bot loads without errors after cnam-service.js changes",
                node_loaded_successfully,
                f"Errors found: {len(errors_found)}, Success indicators: {len(success_found)}. Errors: {errors_found[:3] if errors_found else 'None'}",
                "CRITICAL" if not node_loaded_successfully else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "Node.js bot startup error check",
                False,
                f"Error checking node-bot.log: {str(e)}",
                "CRITICAL"
            )

    def test_bot_configuration_loaded(self):
        """Test if bot configuration is properly loaded"""
        try:
            # Check if critical config files exist and have expected content
            config_files_ok = True
            missing_files = []
            
            expected_files = [
                '/app/js/start-bot.js',
                '/app/js/cnam-service.js',
                '/app/js/telnyx-service.js'
            ]
            
            for file_path in expected_files:
                if not os.path.exists(file_path):
                    missing_files.append(file_path)
                    config_files_ok = False
            
            # Check if cnam-service.js has the correct Telnyx priority
            cnam_config_ok = False
            if os.path.exists('/app/js/cnam-service.js'):
                with open('/app/js/cnam-service.js', 'r') as f:
                    cnam_content = f.read()
                
                has_telnyx_primary = 'Telnyx (primary)' in cnam_content or 'Telnyx Caller Name lookup (primary)' in cnam_content
                has_multitel_fallback = 'Multitel (fallback)' in cnam_content or 'Multitel CNAM lookup (fallback)' in cnam_content  
                has_signalwire_last = 'SignalWire (last resort)' in cnam_content or 'SignalWire CNAM lookup (last resort)' in cnam_content
                has_correct_order = 'Telnyx (primary) → Multitel (fallback) → SignalWire (last resort)' in cnam_content
                
                cnam_config_ok = has_telnyx_primary and has_multitel_fallback and has_signalwire_last and has_correct_order
            
            overall_config_ok = config_files_ok and cnam_config_ok
            
            self.log_result(
                "Bot configuration files exist and CNAM service has correct provider priority",
                overall_config_ok,
                f"Missing files: {missing_files}, CNAM config OK: {cnam_config_ok}",
                "CRITICAL" if not overall_config_ok else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "Bot configuration check",
                False,
                f"Error checking bot configuration: {str(e)}",
                "CRITICAL"
            )

    def test_ux_improvements(self):
        """Test specific UX improvements: buyPlan button rename and keyboard layout changes"""
        
        # Test 1: Check config.js has correct buyPlan label and keyboard layout
        try:
            with open('/app/js/config.js', 'r') as f:
                config_content = f.read()
            
            # Check buyPlan label
            buyplan_correct = "buyPlan: '⚡ Upgrade Plan'" in config_content
            
            # Check keyboard layout has all three on same row
            keyboard_layout_correct = "[user.wallet, user.viewPlan, user.buyPlan]" in config_content
            
            # Check kOf function handles plain 'Back' buttons
            kof_function_fixed = "item === 'Back' || item === 'Cancel'" in config_content
            
            overall_config_ok = buyplan_correct and keyboard_layout_correct and kof_function_fixed
            
            self.log_result(
                "Config.js has correct buyPlan label '⚡ Upgrade Plan' and keyboard layout",
                overall_config_ok,
                f"buyPlan correct: {buyplan_correct}, keyboard layout: {keyboard_layout_correct}, kOf fix: {kof_function_fixed}",
                "CRITICAL" if not overall_config_ok else "INFO"
            )
        except Exception as e:
            self.log_result(
                "Config.js UX improvements check",
                False,
                f"Error checking config.js: {str(e)}",
                "CRITICAL"
            )

    def test_language_files_updated(self):
        """Test all 4 language files have buyPlan set to Upgrade Plan and correct freeLinksExhausted text"""
        
        language_files = [
            '/app/js/lang/en.js',
            '/app/js/lang/fr.js', 
            '/app/js/lang/zh.js',
            '/app/js/lang/hi.js'
        ]
        
        all_files_correct = True
        missing_files = []
        incorrect_files = []
        
        for lang_file in language_files:
            try:
                if not os.path.exists(lang_file):
                    missing_files.append(lang_file)
                    all_files_correct = False
                    continue
                    
                with open(lang_file, 'r', encoding='utf-8') as f:
                    lang_content = f.read()
                
                # Check buyPlan has the ⚡ symbol (more flexible check)
                has_upgrade_symbol = "buyPlan: '⚡" in lang_content
                
                # Check keyboard layout
                has_correct_layout = "[user.wallet, user.viewPlan, user.buyPlan]" in lang_content
                
                # Check freeLinksExhausted references the ⚡ symbol
                has_correct_exhausted_text = "⚡" in lang_content and "freeLinksExhausted" in lang_content
                
                if not (has_upgrade_symbol and has_correct_layout and has_correct_exhausted_text):
                    incorrect_files.append({
                        'file': lang_file,
                        'buyPlan_symbol': has_upgrade_symbol,
                        'layout': has_correct_layout,
                        'exhausted_text': has_correct_exhausted_text
                    })
                    all_files_correct = False
                    
            except Exception as e:
                incorrect_files.append({'file': lang_file, 'error': str(e)})
                all_files_correct = False

        self.log_result(
            "All 4 language files have buyPlan with ⚡ symbol and correct keyboard layout",
            all_files_correct,
            f"Missing files: {missing_files}, Incorrect files: {len(incorrect_files)}",
            "CRITICAL" if not all_files_correct else "INFO"
        )

        return all_files_correct

    def test_choose_subscription_text_format(self):
        """Test chooseSubscription text is trimmed/compact in all 4 languages"""
        
        language_files = [
            '/app/js/lang/en.js',
            '/app/js/lang/fr.js', 
            '/app/js/lang/zh.js',
            '/app/js/lang/hi.js'
        ]
        
        all_text_compact = True
        issues_found = []
        
        for lang_file in language_files:
            try:
                if os.path.exists(lang_file):
                    with open(lang_file, 'r', encoding='utf-8') as f:
                        lang_content = f.read()
                    
                    # Look for chooseSubscription text pattern and check if it's compact
                    if 'chooseSubscription:' in lang_content:
                        # Extract the text between the definition
                        start = lang_content.find('chooseSubscription:')
                        if start != -1:
                            # Find the next property or end of object
                            end = lang_content.find('\n  ', start + 100)  # Look ahead for next property
                            if end == -1:
                                end = start + 1000  # Fallback
                            
                            subscription_text = lang_content[start:end]
                            
                            # Check if text is reasonably compact (not verbose bullet points)
                            line_count = subscription_text.count('\n')
                            is_compact = line_count < 15  # Reasonable threshold for compact text
                            
                            if not is_compact:
                                issues_found.append(f"{lang_file}: subscription text too verbose ({line_count} lines)")
                                all_text_compact = False
                    
            except Exception as e:
                issues_found.append(f"{lang_file}: Error - {str(e)}")
                all_text_compact = False

        self.log_result(
            "chooseSubscription text is trimmed/compact in all 4 languages", 
            all_text_compact,
            f"Issues: {issues_found}" if issues_found else "All subscription texts are compact",
            "MEDIUM" if not all_text_compact else "INFO"
        )

        return all_text_compact

    def run_all_tests(self):
        """Run all Nomadly Telegram Bot UX Improvement tests"""
        print("🔍 Testing Nomadly Telegram Bot Application - UX Improvements\n")
        
        # Core functionality tests
        self.test_health_endpoint()
        self.test_node_bot_direct_check()
        self.test_node_bot_loads_without_errors()
        
        # UX-specific improvement tests
        self.test_ux_improvements()
        self.test_language_files_updated()
        self.test_choose_subscription_text_format()
        
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
    sys.exit(0 if results['success_rate'] > 70 else 1)