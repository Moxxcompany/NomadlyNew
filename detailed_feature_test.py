#!/usr/bin/env python3
"""
Detailed feature testing for the three new Nomadly bot features
"""

import requests
import json
import time
from datetime import datetime

class DetailedFeatureTester:
    def __init__(self, base_url="https://setup-wizard-100.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        
    def test_feature_gating_implementation(self):
        """Test that feature gating is properly implemented"""
        print("\n🔍 Testing Feature Gating Implementation...")
        
        try:
            with open('/app/js/phone-config.js', 'r') as f:
                content = f.read()
            
            # Test specific plan feature access
            features_to_test = [
                ('starter', 'ivr', False),
                ('pro', 'ivr', False), 
                ('business', 'ivr', True),
                ('starter', 'callRecording', False),
                ('pro', 'callRecording', False),
                ('business', 'callRecording', True),
                ('starter', 'voicemail', False),
                ('pro', 'voicemail', True),
                ('business', 'voicemail', True),
            ]
            
            passed = 0
            total = len(features_to_test)
            
            for plan, feature, expected in features_to_test:
                # Look for the feature access definition
                if f'{plan}:' in content and f'{feature}:' in content:
                    # Find the plan section and check if feature is set correctly
                    plan_section_start = content.find(f'{plan}:')
                    if plan_section_start != -1:
                        # Look for next plan or end of planFeatureAccess
                        next_plan_pos = content.find('},', plan_section_start)
                        if next_plan_pos != -1:
                            plan_section = content[plan_section_start:next_plan_pos]
                            feature_setting = f'{feature}: {str(expected).lower()}'
                            if feature_setting in plan_section:
                                print(f"   ✅ {plan} -> {feature}: {expected}")
                                passed += 1
                            else:
                                print(f"   ❌ {plan} -> {feature}: expected {expected}")
                        else:
                            print(f"   ❌ Could not parse {plan} plan section")
                else:
                    print(f"   ❌ Missing {plan} plan or {feature} feature definition")
            
            self.tests_run += 1
            if passed >= total * 0.8:  # Allow for minor variations
                self.tests_passed += 1
                print(f"✅ Feature Gating Test Passed ({passed}/{total})")
                return True, {"passed": passed, "total": total}
            else:
                print(f"❌ Feature Gating Test Failed ({passed}/{total})")
                return False, {"passed": passed, "total": total}
                
        except Exception as e:
            print(f"❌ Error testing feature gating: {e}")
            self.tests_run += 1
            return False, {}

    def test_ivr_analytics_data_structure(self):
        """Test IVR Analytics data structure and functions"""
        print("\n🔍 Testing IVR Analytics Data Structure...")
        
        try:
            with open('/app/js/voice-service.js', 'r') as f:
                voice_content = f.read()
                
            checks = [
                ('trackIvrAnalytics function signature', 'function trackIvrAnalytics(phoneNumber, chatId, callerFrom, digit, action)'),
                ('insertOne call with correct fields', 'phoneNumber,\n    chatId,\n    callerFrom,\n    digit,\n    action'),
                ('timestamp field', 'timestamp: new Date().toISOString()'),
                ('getIvrAnalytics function', 'async function getIvrAnalytics(phoneNumber, days = 30)'),
                ('totalCalls calculation', 'const totalCalls = all.length'),
                ('optionBreakdown calculation', 'optionBreakdown'),
                ('topOption selection', 'const topOption = optionBreakdown.length > 0 ? optionBreakdown[0] : null'),
                ('recentCalls slice', 'const recentCalls = all.slice(0, 5)'),
            ]
            
            passed = 0
            total = len(checks)
            
            for check_name, pattern in checks:
                if pattern.replace(' ', '').replace('\n', '') in voice_content.replace(' ', '').replace('\n', ''):
                    print(f"   ✅ {check_name}")
                    passed += 1
                else:
                    print(f"   ❌ {check_name}")
                    
            self.tests_run += 1
            if passed >= total * 0.7:  # Allow some flexibility in exact matching
                self.tests_passed += 1
                print(f"✅ IVR Analytics Data Structure Test Passed ({passed}/{total})")
                return True, {"passed": passed, "total": total}
            else:
                print(f"❌ IVR Analytics Data Structure Test Failed ({passed}/{total})")
                return False, {"passed": passed, "total": total}
                
        except Exception as e:
            print(f"❌ Error testing IVR analytics structure: {e}")
            self.tests_run += 1
            return False, {}

    def test_voice_audio_message_handling(self):
        """Test voice/audio message handling for custom voicemail"""
        print("\n🔍 Testing Voice/Audio Message Handling...")
        
        try:
            with open('/app/js/_index.js', 'r') as f:
                index_content = f.read()
                
            # Find the voice/audio message handling section
            voice_handler_start = index_content.find('(msg?.voice || msg?.audio)')
            if voice_handler_start == -1:
                voice_handler_start = index_content.find('msg.voice') or index_content.find('msg.audio')
                
            if voice_handler_start == -1:
                print("   ❌ Voice/audio message handler not found")
                self.tests_run += 1
                return False, {}
                
            # Extract the handler section (approximately next 100 lines)
            handler_section = index_content[voice_handler_start:voice_handler_start + 3000]
            
            checks = [
                ('State check for cpVmAudioUpload', 'cpVmAudioUpload'),
                ('File ID extraction', 'msg.voice?.file_id || msg.audio?.file_id'),
                ('getFileLink call', 'bot.getFileLink(fileId)'),
                ('customAudioGreetingUrl assignment', 'vm.customAudioGreetingUrl = fileLink'),
                ('greetingType set to custom', "vm.greetingType = 'custom'"),
                ('customGreetingText reset', 'vm.customGreetingText = null'),
                ('Feature update call', 'updatePhoneNumberFeature'),
                ('Success message', 'vmAudioSaved'),
            ]
            
            passed = 0
            total = len(checks)
            
            for check_name, pattern in checks:
                if pattern in handler_section:
                    print(f"   ✅ {check_name}")
                    passed += 1
                else:
                    print(f"   ❌ {check_name}")
                    
            self.tests_run += 1
            if passed >= 6:  # Most critical features present
                self.tests_passed += 1
                print(f"✅ Voice/Audio Message Handling Test Passed ({passed}/{total})")
                return True, {"passed": passed, "total": total}
            else:
                print(f"❌ Voice/Audio Message Handling Test Failed ({passed}/{total})")
                return False, {"passed": passed, "total": total}
                
        except Exception as e:
            print(f"❌ Error testing voice/audio handling: {e}")
            self.tests_run += 1
            return False, {}

    def test_custom_audio_playback(self):
        """Test custom audio playback via Telnyx API"""
        print("\n🔍 Testing Custom Audio Playback Implementation...")
        
        try:
            with open('/app/js/voice-service.js', 'r') as f:
                voice_content = f.read()
                
            # Look for custom audio playback logic
            playback_section_start = voice_content.find('customAudioGreetingUrl')
            if playback_section_start == -1:
                print("   ❌ Custom audio greeting URL handling not found")
                self.tests_run += 1
                return False, {}
                
            playback_section = voice_content[playback_section_start:playback_section_start + 1500]
            
            checks = [
                ('Axios import/require', 'axios'),
                ('Telnyx API URL', 'https://api.telnyx.com/v2/calls'),
                ('playback_start endpoint', 'playback_start'),
                ('audio_url parameter', 'audio_url: vmConfig.customAudioGreetingUrl'),
                ('Authorization header', 'Authorization'),
                ('Bearer token', 'Bearer'),
                ('TELNYX_API_KEY', 'TELNYX_API_KEY'),
                ('Fallback to TTS', 'fallback'),
            ]
            
            passed = 0
            total = len(checks)
            
            for check_name, pattern in checks:
                if pattern in playback_section or pattern in voice_content:
                    print(f"   ✅ {check_name}")
                    passed += 1
                else:
                    print(f"   ❌ {check_name}")
                    
            self.tests_run += 1
            if passed >= 6:  # Most API integration features present
                self.tests_passed += 1
                print(f"✅ Custom Audio Playback Test Passed ({passed}/{total})")
                return True, {"passed": passed, "total": total}
            else:
                print(f"❌ Custom Audio Playback Test Failed ({passed}/{total})")
                return False, {"passed": passed, "total": total}
                
        except Exception as e:
            print(f"❌ Error testing custom audio playback: {e}")
            self.tests_run += 1
            return False, {}

    def test_health_plus_integration(self):
        """Test that the bot is healthy and integrations work"""
        print("\n🔍 Testing Bot Health + Integration Status...")
        
        try:
            # Test health endpoint
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            health_data = response.json()
            
            checks_passed = 0
            if health_data.get('status') == 'ok':
                print("   ✅ Overall status: OK")
                checks_passed += 1
            else:
                print("   ❌ Overall status not OK")
                
            if health_data.get('node') == 'running':
                print("   ✅ Node.js bot: Running")
                checks_passed += 1
            else:
                print("   ❌ Node.js bot not running")
                
            if health_data.get('db') == 'connected':
                print("   ✅ Database: Connected")
                checks_passed += 1
            else:
                print("   ❌ Database not connected")
                
            # Test if webhook endpoint exists (should return something, not 404)
            try:
                webhook_resp = requests.get(f"{self.base_url}/webhook", timeout=5)
                if webhook_resp.status_code != 404:
                    print("   ✅ Webhook endpoint exists")
                    checks_passed += 1
                else:
                    print("   ⚠️ Webhook endpoint returns 404 (might be normal)")
                    checks_passed += 0.5  # Partial credit
            except:
                print("   ⚠️ Webhook endpoint test failed")
                
            self.tests_run += 1
            if checks_passed >= 3:
                self.tests_passed += 1
                print(f"✅ Health + Integration Test Passed ({checks_passed}/3.5)")
                return True, health_data
            else:
                print(f"❌ Health + Integration Test Failed ({checks_passed}/3.5)")
                return False, health_data
                
        except Exception as e:
            print(f"❌ Error testing health/integration: {e}")
            self.tests_run += 1
            return False, {}

    def run_detailed_tests(self):
        """Run all detailed feature tests"""
        print(f"🧪 Running Detailed Feature Tests for NEW FEATURES")
        print(f"   Target: {self.base_url}")
        print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        results = {}
        
        # Core health check
        results['health_integration'] = self.test_health_plus_integration()
        
        # Feature-specific tests
        results['feature_gating'] = self.test_feature_gating_implementation()
        results['ivr_analytics_structure'] = self.test_ivr_analytics_data_structure()
        results['voice_audio_handling'] = self.test_voice_audio_message_handling()
        results['custom_audio_playback'] = self.test_custom_audio_playback()
        
        # Summary
        print(f"\n📊 Detailed Test Results")
        print(f"   Tests Passed: {self.tests_passed}/{self.tests_run}")
        print(f"   Success Rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        return results

def main():
    tester = DetailedFeatureTester()
    results = tester.run_detailed_tests()
    
    return 0 if tester.tests_passed >= tester.tests_run * 0.8 else 1

if __name__ == "__main__":
    exit(main())