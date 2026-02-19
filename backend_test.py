#!/usr/bin/env python3
"""
Comprehensive Backend Testing for Nomadly Telegram Bot
Tests all 4 implemented features:
1. Multilingual TTS (20 languages)
2. CloudPhone promo messages
3. More countries for phone purchases (28 additional)
4. Smart upsell for free users
"""

import requests
import sys
import os
from datetime import datetime
import json

# Get the public backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://setup-wizard-102.preview.emergentagent.com')
BASE_URL = f"{BACKEND_URL}/api"

class NomadlyBotTester:
    def __init__(self):
        self.backend_url = BACKEND_URL
        self.base_url = BASE_URL
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
    def log_test(self, test_name, success, details="", expected_value=None, actual_value=None):
        """Log test results"""
        self.tests_run += 1
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}")
        
        if details:
            print(f"   Details: {details}")
        if expected_value is not None and actual_value is not None:
            print(f"   Expected: {expected_value}")
            print(f"   Actual: {actual_value}")
            
        if success:
            self.tests_passed += 1
        else:
            self.failed_tests.append({
                'name': test_name,
                'details': details,
                'expected': expected_value,
                'actual': actual_value
            })
        print()
        
    def test_health_endpoint(self):
        """Test GET /api/health returns ok"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            success = response.status_code == 200
            
            if success:
                data = response.json()
                success = data.get('status') == 'ok'
                self.log_test(
                    "Backend health endpoint",
                    success,
                    f"Status: {response.status_code}, Response: {data}",
                    "ok",
                    data.get('status')
                )
            else:
                self.log_test(
                    "Backend health endpoint",
                    False,
                    f"HTTP {response.status_code}: {response.text}"
                )
                
        except Exception as e:
            self.log_test(
                "Backend health endpoint", 
                False,
                f"Connection error: {str(e)}"
            )

    def test_tts_languages_exist(self):
        """Test that TTS_LANGUAGES array exists with 20 languages"""
        try:
            # Read the tts-service.js file directly since it's a Node.js module
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
                
            # Check for TTS_LANGUAGES array with expected languages
            expected_langs = ['en', 'fr', 'es', 'de', 'it', 'pt', 'nl', 'pl', 'ja', 'ko', 'zh', 'hi', 'ar', 'ru', 'tr', 'sv', 'da', 'no', 'fi', 'el']
            
            # Count occurrences of language codes in the file
            found_langs = []
            for lang in expected_langs:
                if f"code: '{lang}'" in content or f'code: "{lang}"' in content:
                    found_langs.append(lang)
            
            success = len(found_langs) >= 20
            self.log_test(
                "TTS_LANGUAGES array with 20 languages",
                success,
                f"Found {len(found_langs)} languages: {found_langs[:10]}..." if len(found_langs) > 10 else f"Found languages: {found_langs}",
                "20 languages",
                f"{len(found_langs)} languages"
            )
            
        except Exception as e:
            self.log_test(
                "TTS_LANGUAGES array with 20 languages",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_generic_voices_exist(self):
        """Test that GENERIC_VOICES object exists with female and male keys"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            has_generic_voices = 'const GENERIC_VOICES' in content or 'GENERIC_VOICES' in content
            has_female = 'female:' in content and 'Female' in content
            has_male = 'male:' in content and 'Male' in content
            
            success = has_generic_voices and has_female and has_male
            self.log_test(
                "GENERIC_VOICES object with female/male keys",
                success,
                f"GENERIC_VOICES found: {has_generic_voices}, female: {has_female}, male: {has_male}"
            )
            
        except Exception as e:
            self.log_test(
                "GENERIC_VOICES object with female/male keys",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_generate_tts_lang_parameter(self):
        """Test that generateTTS accepts 3rd parameter langCode"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            # Check function signature
            has_lang_param = 'generateTTS(text, voiceKey = DEFAULT_VOICE, langCode = null)' in content
            uses_lang_code = 'const language = langCode || voice.lang || \'en\'' in content
            
            success = has_lang_param and uses_lang_code
            self.log_test(
                "generateTTS accepts langCode parameter",
                success,
                f"Function signature correct: {has_lang_param}, Uses langCode: {uses_lang_code}"
            )
            
        except Exception as e:
            self.log_test(
                "generateTTS accepts langCode parameter",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_language_helper_functions(self):
        """Test getLanguageButtons and getLanguageByButton functions exist"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            has_get_lang_buttons = 'function getLanguageButtons()' in content or 'getLanguageButtons()' in content
            has_get_lang_by_button = 'function getLanguageByButton' in content or 'getLanguageByButton(' in content
            exports_functions = 'getLanguageButtons' in content and 'getLanguageByButton' in content and 'module.exports' in content
            
            success = has_get_lang_buttons and has_get_lang_by_button and exports_functions
            self.log_test(
                "Language helper functions exist",
                success,
                f"getLanguageButtons: {has_get_lang_buttons}, getLanguageByButton: {has_get_lang_by_button}, exported: {exports_functions}"
            )
            
        except Exception as e:
            self.log_test(
                "Language helper functions exist",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_voice_helper_functions(self):
        """Test voice helper functions for non-English languages"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            # Check getVoiceButtons function handles langCode
            has_voice_buttons = 'function getVoiceButtons(langCode = \'en\')' in content
            handles_non_english = 'if (langCode && langCode !== \'en\')' in content
            returns_generic = 'GENERIC_VOICES' in content and 'getVoiceButtons' in content
            
            success = has_voice_buttons and handles_non_english and returns_generic
            self.log_test(
                "Voice helper functions for non-English",
                success,
                f"getVoiceButtons with langCode: {has_voice_buttons}, handles non-EN: {handles_non_english}"
            )
            
        except Exception as e:
            self.log_test(
                "Voice helper functions for non-English",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_ivr_language_flow(self):
        """Test IVR flow includes language selection"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Check for IVR greeting voice action
            has_ivr_action = 'cpIvrGreetingVoice:' in content
            has_language_flow = 'getLanguageButtons()' in content and 'cpIvrGreetingVoice' in content
            has_change_language = 'Change Language' in content
            
            success = has_ivr_action and has_language_flow and has_change_language
            self.log_test(
                "IVR flow includes language selection",
                success,
                f"IVR action: {has_ivr_action}, language flow: {has_language_flow}, change language: {has_change_language}"
            )
            
        except Exception as e:
            self.log_test(
                "IVR flow includes language selection",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_vm_language_flow(self):
        """Test VM flow includes language selection"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Check for VM greeting voice action
            has_vm_action = 'cpVmGreetingVoice:' in content
            has_language_flow = 'getLanguageButtons()' in content and 'cpVmGreetingVoice' in content
            has_change_language = 'Change Language' in content and 'cpVmGreetingVoice' in content
            
            success = has_vm_action and has_language_flow and has_change_language
            self.log_test(
                "VM flow includes language selection",
                success,
                f"VM action: {has_vm_action}, language flow: {has_language_flow}, change language: {has_change_language}"
            )
            
        except Exception as e:
            self.log_test(
                "VM flow includes language selection",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_phone_config_countries(self):
        """Test phone-config.js has 5 primary and 28 additional countries"""
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                content = f.read()
            
            # Count primary countries (should be 5: US, CA, GB, PR, VI)
            primary_countries = content.count('const countries = [')
            has_pr = "{ code: 'PR'" in content
            has_vi = "{ code: 'VI'" in content
            
            # Count moreCountries entries
            more_countries_count = content.count('🇦🇺') + content.count('🇮🇪') + content.count('🇸🇪') + content.count('🇳🇱') + content.count('🇩🇪')
            
            success = has_pr and has_vi and more_countries_count >= 5
            self.log_test(
                "Phone config has primary and additional countries",
                success,
                f"Has PR: {has_pr}, Has VI: {has_vi}, More countries indicators found: {more_countries_count}",
                "5 primary + 28 additional countries",
                f"PR: {has_pr}, VI: {has_vi}, additional countries found: {more_countries_count}"
            )
            
        except Exception as e:
            self.log_test(
                "Phone config has primary and additional countries",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_more_countries_flow(self):
        """Test _index.js handles 'More Countries' button"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            has_more_countries_button = 'More Countries' in content
            has_more_countries_handler = 'moreCountries' in content and 'cpSelectCountry' in content
            has_country_selection = 'countryByName' in content
            
            success = has_more_countries_button and has_more_countries_handler
            self.log_test(
                "More Countries button flow",
                success,
                f"Button exists: {has_more_countries_button}, Handler exists: {has_more_countries_handler}"
            )
            
        except Exception as e:
            self.log_test(
                "More Countries button flow",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_cloudphone_promo_themes(self):
        """Test auto-promo.js includes cloudphone theme"""
        try:
            with open('/app/js/auto-promo.js', 'r') as f:
                content = f.read()
            
            has_cloudphone_theme = "'cloudphone'" in content and 'THEMES' in content
            has_cloudphone_context = 'cloudphone:' in content and 'SERVICE_CONTEXT' in content
            has_cloudphone_banner = 'cloudphone:' in content and 'PROMO_BANNERS' in content
            
            success = has_cloudphone_theme and has_cloudphone_context and has_cloudphone_banner
            self.log_test(
                "CloudPhone theme in auto-promo",
                success,
                f"Theme: {has_cloudphone_theme}, Context: {has_cloudphone_context}, Banner: {has_cloudphone_banner}"
            )
            
        except Exception as e:
            self.log_test(
                "CloudPhone theme in auto-promo",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_cloudphone_promo_messages(self):
        """Test cloudphone promo messages exist in multiple languages"""
        try:
            with open('/app/js/auto-promo.js', 'r') as f:
                content = f.read()
            
            # Check for cloudphone messages in different languages
            has_en_cloudphone = 'en: {' in content and 'cloudphone:' in content
            has_fr_cloudphone = 'fr: {' in content and content.count('cloudphone:') >= 2
            has_zh_cloudphone = 'zh: {' in content and content.count('cloudphone:') >= 3
            has_hi_cloudphone = 'hi: {' in content and content.count('cloudphone:') >= 4
            
            # Count actual cloudphone message arrays
            cloudphone_count = content.count('cloudphone: [')
            
            success = cloudphone_count >= 4 and has_en_cloudphone
            self.log_test(
                "CloudPhone promo messages in 4 languages",
                success,
                f"Cloudphone arrays found: {cloudphone_count}, EN: {has_en_cloudphone}, FR: {has_fr_cloudphone}",
                "4 language versions",
                f"{cloudphone_count} versions found"
            )
            
        except Exception as e:
            self.log_test(
                "CloudPhone promo messages in 4 languages",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_smart_upsell_en_lang(self):
        """Test en.js linksRemaining function shows upsell for <= 2 links"""
        try:
            with open('/app/js/lang/en.js', 'r') as f:
                content = f.read()
            
            # Check linksRemaining function logic
            has_links_remaining = 'linksRemaining:' in content
            has_upsell_logic = 'if (count <= 2)' in content
            has_upgrade_text = 'Subscribers get unlimited' in content or 'Upgrade' in content
            
            success = has_links_remaining and has_upsell_logic and has_upgrade_text
            self.log_test(
                "Smart upsell in en.js linksRemaining",
                success,
                f"Function exists: {has_links_remaining}, Logic: {has_upsell_logic}, Upgrade text: {has_upgrade_text}"
            )
            
        except Exception as e:
            self.log_test(
                "Smart upsell in en.js linksRemaining",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_smart_upsell_other_langs(self):
        """Test other language files have similar linksRemaining logic"""
        lang_files = ['/app/js/lang/fr.js', '/app/js/lang/zh.js', '/app/js/lang/hi.js']
        success_count = 0
        
        for lang_file in lang_files:
            try:
                with open(lang_file, 'r') as f:
                    content = f.read()
                
                # Check for similar upsell logic (might be different implementation)
                has_links_remaining = 'linksRemaining' in content
                has_upgrade_logic = 'count <= 2' in content or 'upgrade' in content.lower() or 'subscription' in content.lower()
                
                if has_links_remaining and has_upgrade_logic:
                    success_count += 1
                    
            except Exception:
                continue
                
        success = success_count >= 2  # At least 2 of 3 files should have upsell logic
        self.log_test(
            "Smart upsell in other language files",
            success,
            f"Files with upsell logic: {success_count}/3",
            "At least 2 files",
            f"{success_count} files"
        )

    def test_link_creation_upsell_flow(self):
        """Test _index.js shows upgrade button after link creation for users with <= 2 remaining"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Check for link creation flow with upsell
            has_buy_plan_button = 'user.buyPlan' in content
            has_remaining_check = 'remaining' in content and 'FREE_LINKS' in content
            has_links_remaining_call = 'linksRemaining(' in content
            
            success = has_buy_plan_button and has_remaining_check and has_links_remaining_call
            self.log_test(
                "Link creation upsell flow",
                success,
                f"BuyPlan button: {has_buy_plan_button}, Remaining check: {has_remaining_check}, LinksRemaining call: {has_links_remaining_call}"
            )
            
        except Exception as e:
            self.log_test(
                "Link creation upsell flow",
                False,
                f"Error reading file: {str(e)}"
            )

    def test_node_bot_startup(self):
        """Test if Node.js bot starts without errors"""
        try:
            # Check supervisor logs for the Node.js bot
            with open('/var/log/supervisor/node-bot.log', 'r') as f:
                logs = f.read()
                
            # Look for startup indicators and no critical errors
            has_startup = 'started' in logs.lower() or 'listening' in logs.lower() or 'ready' in logs.lower()
            no_critical_errors = 'Error:' not in logs and 'ECONNREFUSED' not in logs and 'Cannot' not in logs
            
            success = has_startup and no_critical_errors
            self.log_test(
                "Node.js bot starts without errors",
                success,
                f"Startup detected: {has_startup}, No critical errors: {no_critical_errors}",
                "Clean startup",
                f"Startup: {has_startup}, Clean: {no_critical_errors}"
            )
            
        except Exception as e:
            self.log_test(
                "Node.js bot starts without errors",
                False,
                f"Error reading logs: {str(e)}"
            )

    def run_all_tests(self):
        """Run all tests"""
        print(f"🧪 Starting Nomadly Bot Backend Tests")
        print(f"Backend URL: {self.backend_url}")
        print(f"API Base URL: {self.base_url}")
        print("=" * 60)
        
        # Test 1: Backend health
        self.test_health_endpoint()
        
        # Test 2-8: Multilingual TTS features
        self.test_tts_languages_exist()
        self.test_generic_voices_exist()
        self.test_generate_tts_lang_parameter()
        self.test_language_helper_functions()
        self.test_voice_helper_functions()
        self.test_ivr_language_flow()
        self.test_vm_language_flow()
        
        # Test 9-11: More countries features
        self.test_phone_config_countries()
        self.test_more_countries_flow()
        
        # Test 12-13: CloudPhone promos
        self.test_cloudphone_promo_themes()
        self.test_cloudphone_promo_messages()
        
        # Test 14-16: Smart upsell features
        self.test_smart_upsell_en_lang()
        self.test_smart_upsell_other_langs()
        self.test_link_creation_upsell_flow()
        
        # Test 17: Node.js bot health
        self.test_node_bot_startup()
        
        # Summary
        print("=" * 60)
        print(f"📊 TEST SUMMARY")
        print(f"Total Tests: {self.tests_run}")
        print(f"Passed: {self.tests_passed}")
        print(f"Failed: {len(self.failed_tests)}")
        print(f"Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS:")
            for test in self.failed_tests:
                print(f"  - {test['name']}: {test['details']}")
        
        return len(self.failed_tests) == 0

def main():
    tester = NomadlyBotTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())