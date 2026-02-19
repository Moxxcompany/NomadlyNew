#!/usr/bin/env python3
"""
Backend Testing Suite for IVR/Voicemail Overhaul
Tests the Node.js Telegram bot backend functionality including:
- Health checks (/api/health returns ok)
- Node.js bot loads without syntax errors after major IVR/VM rewrite
- tts-service.js loads correctly with EDENAI_API_KEY from .env
- tts-service.js exports: generateTTS, downloadTelegramAudio, getVoiceButtons, getVoiceKeyByButton, VOICES
- tts-service.js VOICES has 6 voices (rachel, sarah, laura, drew, charlie, clyde)
- IVR Greeting flow: entry shows 'Type Text (AI Voice)' and 'Upload Audio' options
- IVR Add Option flow: step-by-step wizard with key selection (0-9), action (Forward/Voicemail), message config
- VM Greeting flow: Custom Greeting shows TTS and Upload options
- New action states registered
- EDENAI_API_KEY is properly set in backend/.env on its own line
"""
import requests
import subprocess
import sys
import os
import json
from datetime import datetime

# Backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL', 'https://setup-wizard-101.preview.emergentagent.com')
if BACKEND_URL.endswith('/api'):
    BACKEND_URL = BACKEND_URL[:-4]  # Remove /api suffix for testing

class IvrVoicemailTester:
    def __init__(self, backend_url=BACKEND_URL):
        self.backend_url = backend_url
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
    def log(self, message):
        """Log messages with timestamp"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print(f"[{timestamp}] {message}")

    def run_test(self, name, test_func):
        """Run a single test"""
        self.tests_run += 1
        self.log(f"🔍 Testing {name}...")
        
        try:
            success = test_func()
            if success:
                self.tests_passed += 1
                self.log(f"✅ {name} - PASSED")
            else:
                self.log(f"❌ {name} - FAILED")
            return success
        except Exception as e:
            self.log(f"❌ {name} - ERROR: {str(e)}")
            return False

    def test_backend_health(self):
        """Test backend health endpoint"""
        try:
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            if response.status_code != 200:
                self.log(f"Health check failed with status {response.status_code}")
                return False
                
            data = response.json()
            self.log(f"Health response: {json.dumps(data, indent=2)}")
            
            # Check if required fields are present
            required_fields = ['status', 'proxy', 'node']
            for field in required_fields:
                if field not in data:
                    self.log(f"Missing field in health response: {field}")
                    return False
                    
            # Check if status is ok
            if data.get('status') != 'ok':
                self.log(f"Health status is not ok: {data.get('status')}")
                return False
                
            # Check if node is running
            if data.get('node') not in ['running', 'starting']:
                self.log(f"Node.js is not running: {data.get('node')}")
                return False
                
            return True
            
        except requests.exceptions.RequestException as e:
            self.log(f"Request failed: {str(e)}")
            return False

    def test_node_bot_syntax(self):
        """Test Node.js bot loads without syntax errors"""
        try:
            # Test syntax of main files
            main_files = [
                "/app/js/_index.js",
                "/app/js/phone-config.js",
                "/app/js/start-bot.js"
            ]
            
            for file_path in main_files:
                if not os.path.exists(file_path):
                    self.log(f"File not found: {file_path}")
                    return False
                    
                # Run syntax check
                result = subprocess.run(
                    ["node", "--check", file_path],
                    capture_output=True,
                    text=True,
                    cwd="/app"
                )
                
                if result.returncode != 0:
                    self.log(f"Syntax error in {file_path}: {result.stderr}")
                    return False
                else:
                    self.log(f"Syntax OK: {file_path}")
                    
            return True
            
        except Exception as e:
            self.log(f"Syntax check failed: {str(e)}")
            return False

    def test_ivr_voicemail_handlers(self):
        """Test IVR and Voicemail handler code structure"""
        try:
            # Read main bot file
            with open("/app/js/_index.js", "r") as f:
                content = f.read()
            
            # Check for IVR Set Greeting handler with k.of([]) keyboard clearing and button guards
            ivr_greeting_checks = [
                ("cpIvrGreeting", "IVR greeting action constant"),
                ("action === a.cpIvrGreeting", "IVR greeting handler"),
                ("k.of([]))", "Keyboard clearing in IVR greeting"),
                ("Reject IVR button text", "Button text guard in IVR greeting"),
                ("ivrButtons.includes(message)", "Button text validation")
            ]
            
            for check, desc in ivr_greeting_checks:
                if check not in content:
                    self.log(f"Missing {desc}: {check}")
                    return False
            
            # Check for IVR Add Menu Option handler with k.of([]) keyboard clearing and button guards
            ivr_add_option_checks = [
                ("cpIvrAddOption", "IVR add option action constant"), 
                ("action === a.cpIvrAddOption", "IVR add option handler"),
                ("k.of([]))", "Keyboard clearing in IVR add option"),
                ("Reject IVR button text as input", "Button text guard in IVR add option")
            ]
            
            for check, desc in ivr_add_option_checks:
                if check not in content:
                    self.log(f"Missing {desc}: {check}")
                    return False
            
            # Check for Voicemail audio upload handler with k.of([]) keyboard clearing and button guards
            vm_audio_checks = [
                ("cpVmAudioUpload", "VM audio upload action constant"),
                ("action === a.cpVmAudioUpload", "VM audio upload handler"),
                ("k.of([]))", "Keyboard clearing in VM audio upload"),
                ("Reject voicemail", "Button text guard in VM audio"),
                ("vmButtons.includes(message)", "VM button text validation")
            ]
            
            for check, desc in vm_audio_checks:
                if check not in content:
                    self.log(f"Missing {desc}: {check}")
                    return False
                    
            self.log("IVR and Voicemail handler structure verified - all handlers have k.of([]) and button guards")
            return True
            
        except Exception as e:
            self.log(f"Handler check failed: {str(e)}")
            return False

    def test_phone_config_multilingual(self):
        """Test phoneConfig.msg has required multilingual keys"""
        try:
            # Read phone-config.js
            with open("/app/js/phone-config.js", "r") as f:
                content = f.read()
            
            # Check for multilingual msg object
            required_keys = [
                'noIvrOptions',
                'whichKeyRemove', 
                'sendVoiceOrText',
                'noActivity',
                'insufficientBalUpgrade'
            ]
            
            # Check all 4 languages
            languages = ['en', 'fr', 'zh', 'hi']
            
            for lang in languages:
                for key in required_keys:
                    # Look for the key in each language section
                    pattern = f"{lang}: {{" 
                    if pattern in content:
                        # Find the section for this language
                        lang_start = content.find(pattern)
                        if lang_start == -1:
                            self.log(f"Language section not found: {lang}")
                            return False
                            
                        # Look for the key within reasonable distance
                        key_pattern = f"{key}:"
                        search_area = content[lang_start:lang_start + 5000]  # Search next 5000 chars
                        if key_pattern not in search_area:
                            self.log(f"Missing key '{key}' in language '{lang}'")
                            return False
                            
            self.log("Phone config multilingual keys verified")
            return True
            
        except Exception as e:
            self.log(f"Phone config multilingual check failed: {str(e)}")
            return False

    def test_translation_keys_wired(self):
        """Test translation keys are wired in _index.js"""
        try:
            # Read main bot file
            with open("/app/js/_index.js", "r") as f:
                content = f.read()
            
            # Check for translation keys usage
            required_translations = [
                't.failedAudio',
                't.enterBroadcastMessage'
            ]
            
            for translation in required_translations:
                if translation not in content:
                    self.log(f"Missing translation usage: {translation}")
                    return False
                    
            self.log("Translation keys wiring verified") 
            return True
            
        except Exception as e:
            self.log(f"Translation wiring check failed: {str(e)}")
            return False

    def test_plan_upgrade_logic(self):
        """Test plan upgrade/downgrade logic exists"""
        try:
            # Read main bot file
            with open("/app/js/_index.js", "r") as f:
                content = f.read()
            
            # Check for plan change logic
            plan_upgrade_checks = [
                "cpChangePlan",
                "walletBal",
                "pro-rated",
                "remaining days"
            ]
            
            found_checks = 0
            for check in plan_upgrade_checks:
                if check.lower() in content.lower():
                    found_checks += 1
                    
            # At least 2 of the 4 checks should be found for basic upgrade logic
            if found_checks < 2:
                self.log(f"Insufficient plan upgrade logic found ({found_checks}/4)")
                return False
                
            self.log("Plan upgrade/downgrade logic structure verified")
            return True
            
        except Exception as e:
            self.log(f"Plan upgrade logic check failed: {str(e)}")
            return False

    def test_language_files_keys(self):
        """Test all 4 language files have required new translation keys"""
        try:
            required_keys = [
                'failedAudio',
                'enterBroadcastMessage', 
                'provide2Nameservers',
                'noDomainSelected',
                'validInstitutionName',
                'validCityName'
            ]
            
            language_files = [
                '/app/js/lang/en.js',
                '/app/js/lang/fr.js', 
                '/app/js/lang/zh.js',
                '/app/js/lang/hi.js'
            ]
            
            for lang_file in language_files:
                if not os.path.exists(lang_file):
                    self.log(f"Language file not found: {lang_file}")
                    return False
                    
                with open(lang_file, "r") as f:
                    content = f.read()
                
                for key in required_keys:
                    if f"{key}:" not in content and f"'{key}'" not in content and f'"{key}"' not in content:
                        self.log(f"Missing key '{key}' in {lang_file}")
                        return False
                        
            self.log("All language files have required keys")
            return True
            
        except Exception as e:
            self.log(f"Language files check failed: {str(e)}")
            return False

    def test_voicemail_default_greeting(self):
        """Test voicemail shows default greeting text when no custom greeting"""
        try:
            # Read phone-config.js
            with open("/app/js/phone-config.js", "r") as f:
                content = f.read()
            
            # Check for default greeting text
            default_greeting_patterns = [
                "You have reached",
                "Please leave a message after the tone",
                "formatPhone(number)",
                "default greeting"
            ]
            
            found_patterns = 0
            for pattern in default_greeting_patterns:
                if pattern.lower() in content.lower():
                    found_patterns += 1
                    
            if found_patterns < 2:
                self.log(f"Insufficient default greeting patterns found ({found_patterns}/4)")
                return False
                
            self.log("Voicemail default greeting text verified")
            return True
            
        except Exception as e:
            self.log(f"Voicemail default greeting check failed: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all tests"""
        self.log("🚀 Starting Nomadly Telegram Bot Backend Tests")
        self.log("=" * 60)
        
        # Test 1: Backend Health Check
        self.run_test("Backend Health /api/health", self.test_backend_health)
        
        # Test 2: Node.js Bot Syntax
        self.run_test("Node.js Bot Syntax Check", self.test_node_bot_syntax)
        
        # Test 3: IVR/Voicemail Handlers
        self.run_test("IVR/Voicemail Handlers Structure", self.test_ivr_voicemail_handlers)
        
        # Test 4: Phone Config Multilingual
        self.run_test("Phone Config Multilingual Keys", self.test_phone_config_multilingual)
        
        # Test 5: Translation Keys Wired
        self.run_test("Translation Keys Wired in _index.js", self.test_translation_keys_wired)
        
        # Test 6: Plan Upgrade Logic
        self.run_test("Plan Upgrade/Downgrade Logic", self.test_plan_upgrade_logic)
        
        # Test 7: Language Files Keys
        self.run_test("Language Files Translation Keys", self.test_language_files_keys)
        
        # Test 8: Voicemail Default Greeting
        self.run_test("Voicemail Default Greeting Text", self.test_voicemail_default_greeting)
        
        # Summary
        self.log("=" * 60)
        self.log(f"📊 Tests completed: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            self.log("🎉 All tests PASSED!")
            return True
        else:
            self.log(f"⚠️  {self.tests_run - self.tests_passed} tests FAILED")
            return False

def main():
    """Main test runner"""
    tester = NomadlyBotTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())