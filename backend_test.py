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
                self.failed_tests.append(name)
            return success
        except Exception as e:
            self.log(f"❌ {name} - ERROR: {str(e)}")
            self.failed_tests.append(name)
            return False

    def test_backend_health(self):
        """Test /api/health endpoint returns ok"""
        try:
            response = requests.get(f"{self.backend_url}/api/health", timeout=10)
            if response.status_code != 200:
                self.log(f"Health check failed with status {response.status_code}")
                return False
                
            data = response.json()
            self.log(f"Health response: {json.dumps(data, indent=2)}")
            
            # Check if status is 'ok' as mentioned in requirements
            if data.get('status') != 'ok':
                self.log(f"Health status is not 'ok': {data.get('status')}")
                return False
                
            return True
            
        except requests.exceptions.RequestException as e:
            self.log(f"Request failed: {str(e)}")
            return False

    def test_node_bot_syntax(self):
        """Test Node.js bot loads without syntax errors after major IVR/VM rewrite"""
        try:
            # Test syntax of main files affected by IVR/VM rewrite
            main_files = [
                "/app/js/_index.js",
                "/app/js/phone-config.js",
                "/app/js/tts-service.js"
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

    def test_tts_service_loading(self):
        """Test tts-service.js loads correctly with EDENAI_API_KEY from .env"""
        try:
            tts_file = "/app/js/tts-service.js"
            if not os.path.exists(tts_file):
                self.log(f"TTS service file not found: {tts_file}")
                return False
            
            # Check if file can be loaded without syntax errors
            result = subprocess.run(
                ["node", "--check", tts_file],
                capture_output=True,
                text=True,
                cwd="/app"
            )
            
            if result.returncode != 0:
                self.log(f"TTS service syntax error: {result.stderr}")
                return False
            
            # Check EDENAI_API_KEY usage
            with open(tts_file, 'r') as f:
                content = f.read()
            
            if "process.env.EDENAI_API_KEY" not in content:
                self.log("TTS service doesn't load EDENAI_API_KEY from .env")
                return False
                
            self.log("TTS service loads correctly and references EDENAI_API_KEY")
            return True
            
        except Exception as e:
            self.log(f"TTS service loading check failed: {str(e)}")
            return False

    def test_tts_service_exports(self):
        """Test tts-service.js exports: generateTTS, downloadTelegramAudio, getVoiceButtons, getVoiceKeyByButton, VOICES"""
        try:
            tts_file = "/app/js/tts-service.js"
            with open(tts_file, 'r') as f:
                content = f.read()
            
            required_exports = [
                'generateTTS',
                'downloadTelegramAudio', 
                'getVoiceButtons',
                'getVoiceKeyByButton',
                'VOICES'
            ]
            
            exports_found = []
            for export in required_exports:
                if f"module.exports" in content and export in content:
                    exports_found.append(export)
            
            self.log(f"TTS exports found: {exports_found}")
            
            if len(exports_found) != len(required_exports):
                missing = [e for e in required_exports if e not in exports_found]
                self.log(f"Missing TTS exports: {missing}")
                return False
                
            return True
            
        except Exception as e:
            self.log(f"TTS service exports check failed: {str(e)}")
            return False

    def test_tts_voices_config(self):
        """Test tts-service.js VOICES has 6 voices (rachel, sarah, laura, drew, charlie, clyde)"""
        try:
            tts_file = "/app/js/tts-service.js"
            with open(tts_file, 'r') as f:
                content = f.read()
            
            expected_voices = ['rachel', 'sarah', 'laura', 'drew', 'charlie', 'clyde']
            found_voices = []
            
            # Look for VOICES object definition
            lines = content.split('\n')
            in_voices = False
            
            for line in lines:
                if 'const VOICES = {' in line or 'VOICES = {' in line:
                    in_voices = True
                    continue
                elif in_voices and line.strip().startswith('}'):
                    break
                elif in_voices and ':' in line:
                    voice_name = line.split(':')[0].strip()
                    if voice_name in expected_voices:
                        found_voices.append(voice_name)
            
            self.log(f"Found voices: {found_voices}")
            
            if len(found_voices) != 6 or set(found_voices) != set(expected_voices):
                self.log(f"Expected 6 voices {expected_voices}, found {len(found_voices)}: {found_voices}")
                return False
                
            return True
            
        except Exception as e:
            self.log(f"TTS voices config check failed: {str(e)}")
            return False

    def test_edenai_api_key(self):
        """Test EDENAI_API_KEY is properly set in backend/.env on its own line"""
        try:
            env_file = "/app/backend/.env"
            if not os.path.exists(env_file):
                self.log(f"Backend .env file not found: {env_file}")
                return False
            
            with open(env_file, 'r') as f:
                lines = f.readlines()
            
            # Check if EDENAI_API_KEY is present on its own line and not empty
            edenai_key_found = False
            for line in lines:
                line = line.strip()
                if line.startswith('EDENAI_API_KEY=') and len(line) > len('EDENAI_API_KEY='):
                    edenai_key_found = True
                    key_value = line.split('=', 1)[1]
                    self.log(f"EDENAI_API_KEY found on its own line (length: {len(key_value)})")
                    break
            
            if not edenai_key_found:
                self.log("EDENAI_API_KEY not found or empty in backend/.env")
                return False
                
            return True
            
        except Exception as e:
            self.log(f"EDENAI API key check failed: {str(e)}")
            return False

    def test_ivr_greeting_flow(self):
        """Test IVR Greeting flow: entry shows 'Type Text (AI Voice)' and 'Upload Audio' options"""
        try:
            # Check phone-config.js and _index.js for IVR greeting options
            files_to_check = ["/app/js/phone-config.js", "/app/js/_index.js"]
            
            found_type_text = False
            found_upload_audio = False
            
            for file_path in files_to_check:
                if os.path.exists(file_path):
                    with open(file_path, 'r') as f:
                        content = f.read()
                    
                    # Look for Type Text (AI Voice) option
                    if "Type Text" in content and ("AI Voice" in content or "TTS" in content):
                        found_type_text = True
                        self.log(f"Found 'Type Text (AI Voice)' option in {file_path}")
                    
                    # Look for Upload Audio option
                    if "Upload Audio" in content:
                        found_upload_audio = True
                        self.log(f"Found 'Upload Audio' option in {file_path}")
            
            if not found_type_text:
                self.log("IVR Greeting flow missing 'Type Text (AI Voice)' option")
                return False
                
            if not found_upload_audio:
                self.log("IVR Greeting flow missing 'Upload Audio' option")
                return False
                
            return True
            
        except Exception as e:
            self.log(f"IVR greeting flow check failed: {str(e)}")
            return False

    def test_ivr_add_option_flow(self):
        """Test IVR Add Option flow: step-by-step wizard with key selection (0-9), action (Forward/Voicemail), message config"""
        try:
            files_to_check = ["/app/js/_index.js", "/app/js/phone-config.js"]
            
            found_key_selection = False
            found_action_selection = False
            found_message_config = False
            
            for file_path in files_to_check:
                if os.path.exists(file_path):
                    with open(file_path, 'r') as f:
                        content = f.read()
                    
                    # Look for key selection (0-9)
                    if "cpIvrOptionKey" in content or ("key" in content.lower() and "0-9" in content):
                        found_key_selection = True
                        self.log(f"Found key selection logic in {file_path}")
                    
                    # Look for action selection (Forward/Voicemail)
                    if "cpIvrOptionAction" in content or ("Forward" in content and "Voicemail" in content):
                        found_action_selection = True
                        self.log(f"Found action selection logic in {file_path}")
                    
                    # Look for message config
                    if "cpIvrOptionMsg" in content or "message config" in content.lower():
                        found_message_config = True
                        self.log(f"Found message config logic in {file_path}")
            
            missing = []
            if not found_key_selection:
                missing.append("key selection (0-9)")
            if not found_action_selection:
                missing.append("action selection (Forward/Voicemail)")
            if not found_message_config:
                missing.append("message config")
                
            if missing:
                self.log(f"IVR Add Option flow missing: {', '.join(missing)}")
                return False
                
            return True
            
        except Exception as e:
            self.log(f"IVR Add Option flow check failed: {str(e)}")
            return False

    def test_vm_greeting_flow(self):
        """Test VM Greeting flow: Custom Greeting shows TTS and Upload options"""
        try:
            files_to_check = ["/app/js/_index.js", "/app/js/phone-config.js"]
            
            found_tts_option = False
            found_upload_option = False
            
            for file_path in files_to_check:
                if os.path.exists(file_path):
                    with open(file_path, 'r') as f:
                        content = f.read()
                    
                    # Look for VM TTS/Voice option
                    if "cpVmGreetingVoice" in content or ("voicemail" in content.lower() and "tts" in content.lower()):
                        found_tts_option = True
                        self.log(f"Found VM TTS option in {file_path}")
                    
                    # Look for VM Upload option
                    if "cpVmAudioUpload" in content or ("voicemail" in content.lower() and "upload" in content.lower()):
                        found_upload_option = True
                        self.log(f"Found VM upload option in {file_path}")
            
            missing = []
            if not found_tts_option:
                missing.append("TTS option")
            if not found_upload_option:
                missing.append("Upload option")
                
            if missing:
                self.log(f"VM Greeting flow missing: {', '.join(missing)}")
                return False
                
            return True
            
        except Exception as e:
            self.log(f"VM Greeting flow check failed: {str(e)}")
            return False

    def test_new_action_states(self):
        """Test new action states registered: cpIvrGreetingVoice, cpIvrGreetingPreview, cpIvrOptionKey, cpIvrOptionAction, cpIvrOptionMsg, cpIvrOptionVoice, cpIvrOptionPreview, cpVmGreetingVoice, cpVmGreetingPreview"""
        try:
            expected_states = [
                'cpIvrGreetingVoice',
                'cpIvrGreetingPreview', 
                'cpIvrOptionKey',
                'cpIvrOptionAction',
                'cpIvrOptionMsg',
                'cpIvrOptionVoice',
                'cpIvrOptionPreview',
                'cpVmGreetingVoice',
                'cpVmGreetingPreview'
            ]
            
            # Check phone-config.js and _index.js for action states
            files_to_check = ["/app/js/phone-config.js", "/app/js/_index.js"]
            
            found_states = []
            
            for file_path in files_to_check:
                if os.path.exists(file_path):
                    with open(file_path, 'r') as f:
                        content = f.read()
                    
                    for state in expected_states:
                        if state in content and state not in found_states:
                            found_states.append(state)
            
            self.log(f"Found action states: {found_states}")
            
            missing_states = [s for s in expected_states if s not in found_states]
            if missing_states:
                self.log(f"Missing action states: {missing_states}")
                return False
                
            return True
            
        except Exception as e:
            self.log(f"Action states check failed: {str(e)}")
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