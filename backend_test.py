#!/usr/bin/env python3

import requests
import json
import subprocess
import sys
import re

class NomadlyTelegramBotTester:
    def __init__(self):
        self.base_url = "http://localhost:5000"
        self.tests_run = 0
        self.tests_passed = 0
        self.results = []

    def log_result(self, test_name, passed, details=""):
        """Log test result"""
        self.tests_run += 1
        if passed:
            self.tests_passed += 1
            status = "✅ PASS"
        else:
            status = "❌ FAIL"
        
        result = f"{status} - {test_name}"
        if details:
            result += f": {details}"
        
        self.results.append({"name": test_name, "passed": passed, "details": details})
        print(result)

    def test_health_endpoint(self):
        """Test /api/health endpoint returns ok with node running and db connected"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy" and data.get("database") == "connected":
                    self.log_result("Backend health check /api/health", True, "Status healthy, DB connected")
                    return True
                else:
                    self.log_result("Backend health check /api/health", False, f"Unexpected response: {data}")
                    return False
            else:
                self.log_result("Backend health check /api/health", False, f"HTTP {response.status_code}")
                return False
        except Exception as e:
            self.log_result("Backend health check /api/health", False, f"Error: {str(e)}")
            return False

    def test_no_rawmsg_references(self):
        """Verify NO remaining references to 'rawMsg' in _index.js"""
        try:
            result = subprocess.run(['grep', '-n', 'rawMsg', '/app/js/_index.js'], 
                                 capture_output=True, text=True)
            if result.returncode != 0:  # grep returns 1 when no matches found
                self.log_result("No rawMsg references in _index.js", True, "All rawMsg references removed")
                return True
            else:
                matches = result.stdout.strip()
                self.log_result("No rawMsg references in _index.js", False, f"Found rawMsg: {matches}")
                return False
        except Exception as e:
            self.log_result("No rawMsg references in _index.js", False, f"Error: {str(e)}")
            return False

    def test_voices_count_and_ids(self):
        """Verify VOICES in tts-service.js has 15 voices with real ElevenLabs voice IDs"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            # Extract VOICES object - look for const VOICES = { ... }
            voices_match = re.search(r'const VOICES = \{(.*?)\}', content, re.DOTALL)
            if not voices_match:
                self.log_result("15 voices with ElevenLabs IDs", False, "VOICES object not found")
                return False
            
            voices_content = voices_match.group(1)
            
            # Count voice entries
            voice_entries = re.findall(r'(\w+):\s*\{[^}]*voiceId:\s*[\'"]([^\'\"]+)[\'"]', voices_content)
            voice_count = len(voice_entries)
            
            if voice_count == 15:
                # Check if voice IDs look like ElevenLabs IDs (20-character alphanumeric)
                valid_ids = all(len(voice_id) >= 15 and re.match(r'^[A-Za-z0-9]+$', voice_id) 
                              for _, voice_id in voice_entries)
                if valid_ids:
                    voice_names = [name for name, _ in voice_entries]
                    self.log_result("15 voices with ElevenLabs IDs", True, f"Found {voice_count} voices: {', '.join(voice_names)}")
                    return True
                else:
                    self.log_result("15 voices with ElevenLabs IDs", False, "Some voice IDs don't look like ElevenLabs IDs")
                    return False
            else:
                self.log_result("15 voices with ElevenLabs IDs", False, f"Found {voice_count} voices, expected 15")
                return False
        except Exception as e:
            self.log_result("15 voices with ElevenLabs IDs", False, f"Error: {str(e)}")
            return False

    def test_voice_gender_distribution(self):
        """Verify voice list includes both females and males with expected names"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            # Extract voice names and genders
            voice_matches = re.findall(r'(\w+):\s*\{[^}]*name:\s*[\'"]([^\'\"]+)[\'"][^}]*gender:\s*[\'"]([FM])[\'"]', content)
            
            if not voice_matches:
                self.log_result("Voice gender distribution", False, "No voice entries with gender found")
                return False
            
            females = [name for _, name, gender in voice_matches if gender == 'F']
            males = [name for _, name, gender in voice_matches if gender == 'M']
            
            expected_females = {'Rachel', 'Sarah', 'Laura', 'Emily', 'Domi', 'Dorothy', 'Glinda'}
            expected_males = {'Drew', 'Charlie', 'Clyde', 'Adam', 'Josh', 'Arnold', 'Sam', 'Thomas'}
            
            found_females = set(females)
            found_males = set(males)
            
            females_ok = expected_females.issubset(found_females)
            males_ok = expected_males.issubset(found_males)
            
            if females_ok and males_ok:
                self.log_result("Voice gender distribution", True, f"Females: {len(females)}, Males: {len(males)}")
                return True
            else:
                missing_f = expected_females - found_females
                missing_m = expected_males - found_males
                self.log_result("Voice gender distribution", False, f"Missing females: {missing_f}, Missing males: {missing_m}")
                return False
        except Exception as e:
            self.log_result("Voice gender distribution", False, f"Error: {str(e)}")
            return False

    def test_generatetts_voiceid_parameter(self):
        """Verify generateTTS function passes voice.voiceId as the option parameter to EdenAI API"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            # Look for the generateTTS function and option parameter
            generate_match = re.search(r'async function generateTTS\([^{]*\{(.*?)^\}', content, re.DOTALL | re.MULTILINE)
            if not generate_match:
                self.log_result("generateTTS uses voiceId", False, "generateTTS function not found")
                return False
            
            func_content = generate_match.group(1)
            
            # Check if option is set to voice.voiceId
            if 'option: voice.voiceId' in func_content:
                self.log_result("generateTTS uses voiceId", True, "Function correctly uses voice.voiceId as option")
                return True
            else:
                self.log_result("generateTTS uses voiceId", False, "option parameter not set to voice.voiceId")
                return False
        except Exception as e:
            self.log_result("generateTTS uses voiceId", False, f"Error: {str(e)}")
            return False

    def test_edenai_endpoint(self):
        """Verify EdenAI API endpoint is api.edenai.run/v2/audio/text_to_speech with providers: 'elevenlabs'"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            # Check for the correct endpoint
            endpoint_found = 'https://api.edenai.run/v2/audio/text_to_speech' in content
            providers_found = "providers: 'elevenlabs'" in content
            
            if endpoint_found and providers_found:
                self.log_result("EdenAI endpoint configuration", True, "Correct endpoint and provider configured")
                return True
            else:
                details = []
                if not endpoint_found:
                    details.append("endpoint not found")
                if not providers_found:
                    details.append("elevenlabs provider not found")
                self.log_result("EdenAI endpoint configuration", False, ", ".join(details))
                return False
        except Exception as e:
            self.log_result("EdenAI endpoint configuration", False, f"Error: {str(e)}")
            return False

    def test_getvoicebuttons_returns_all_voices(self):
        """Verify getVoiceButtons returns all 15 voices regardless of language"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            # Look for getVoiceButtons function
            func_match = re.search(r'function getVoiceButtons\([^{]*\{(.*?)^\}', content, re.DOTALL | re.MULTILINE)
            if not func_match:
                self.log_result("getVoiceButtons returns all voices", False, "getVoiceButtons function not found")
                return False
            
            func_content = func_match.group(1)
            
            # Check that it uses VOICES and doesn't filter by language (should show all voices)
            if 'Object.entries(VOICES)' in func_content and 'filter' in func_content and 'gender' in func_content:
                # This indicates it's showing all voices, just grouped by gender
                self.log_result("getVoiceButtons returns all voices", True, "Function returns all voices grouped by gender")
                return True
            else:
                self.log_result("getVoiceButtons returns all voices", False, "Function may not return all voices")
                return False
        except Exception as e:
            self.log_result("getVoiceButtons returns all voices", False, f"Error: {str(e)}")
            return False

    def test_getvoicekeybybutton_matches_all_voices(self):
        """Verify getVoiceKeyByButton matches voice name for all 15 voices"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            # Look for getVoiceKeyByButton function
            func_match = re.search(r'function getVoiceKeyByButton\([^{]*\{(.*?)^\}', content, re.DOTALL | re.MULTILINE)
            if not func_match:
                self.log_result("getVoiceKeyByButton matches voices", False, "getVoiceKeyByButton function not found")
                return False
            
            func_content = func_match.group(1)
            
            # Check that it iterates through all VOICES
            if 'Object.entries(VOICES)' in func_content and 'buttonText.startsWith(v.name)' in func_content:
                self.log_result("getVoiceKeyByButton matches voices", True, "Function matches all voice names")
                return True
            else:
                self.log_result("getVoiceKeyByButton matches voices", False, "Function may not handle all voices")
                return False
        except Exception as e:
            self.log_result("getVoiceKeyByButton matches voices", False, f"Error: {str(e)}")
            return False

    def test_generic_voices_equals_voices(self):
        """Verify GENERIC_VOICES is set to VOICES (same voice library for all languages)"""
        try:
            with open('/app/js/tts-service.js', 'r') as f:
                content = f.read()
            
            # Look for GENERIC_VOICES = VOICES
            if 'const GENERIC_VOICES = VOICES' in content or 'GENERIC_VOICES = VOICES' in content:
                self.log_result("GENERIC_VOICES equals VOICES", True, "Same voice library for all languages")
                return True
            else:
                self.log_result("GENERIC_VOICES equals VOICES", False, "GENERIC_VOICES not set to VOICES")
                return False
        except Exception as e:
            self.log_result("GENERIC_VOICES equals VOICES", False, f"Error: {str(e)}")
            return False

    def test_handlers_use_msg_not_rawmsg(self):
        """Verify IVR option preview and VM greeting preview handlers use 'msg' not 'rawMsg'"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for the handler sections
            ivr_preview_section = re.search(r'if \(action === a\.cpIvrOptionPreview\)(.*?)(?=if \(action ===|\Z)', content, re.DOTALL)
            vm_preview_section = re.search(r'if \(action === a\.cpVmGreetingPreview\)(.*?)(?=if \(action ===|\Z)', content, re.DOTALL)
            
            issues = []
            
            if ivr_preview_section:
                ivr_content = ivr_preview_section.group(1)
                if 'msg?.voice' in ivr_content or 'msg?.audio' in ivr_content:
                    if 'rawMsg' not in ivr_content:
                        # Good - using msg, not rawMsg
                        pass
                    else:
                        issues.append("IVR preview handler still has rawMsg references")
                else:
                    issues.append("IVR preview handler doesn't handle audio uploads")
            
            if vm_preview_section:
                vm_content = vm_preview_section.group(1)
                if 'msg?.voice' in vm_content or 'msg?.audio' in vm_content:
                    if 'rawMsg' not in vm_content:
                        # Good - using msg, not rawMsg
                        pass
                    else:
                        issues.append("VM preview handler still has rawMsg references")
                else:
                    issues.append("VM preview handler doesn't handle audio uploads")
            
            if not issues:
                self.log_result("Handlers use 'msg' not 'rawMsg'", True, "Both handlers correctly use 'msg' for audio uploads")
                return True
            else:
                self.log_result("Handlers use 'msg' not 'rawMsg'", False, "; ".join(issues))
                return False
                
        except Exception as e:
            self.log_result("Handlers use 'msg' not 'rawMsg'", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run all tests"""
        print("🧪 Starting Nomadly Telegram Bot Testing...")
        print("=" * 60)
        
        # Run all tests
        self.test_health_endpoint()
        self.test_no_rawmsg_references()
        self.test_voices_count_and_ids()
        self.test_voice_gender_distribution()
        self.test_generatetts_voiceid_parameter()
        self.test_edenai_endpoint()
        self.test_getvoicebuttons_returns_all_voices()
        self.test_getvoicekeybybutton_matches_all_voices()
        self.test_generic_voices_equals_voices()
        self.test_handlers_use_msg_not_rawmsg()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print("❌ Some tests failed!")
            return 1

def main():
    tester = NomadlyTelegramBotTester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())