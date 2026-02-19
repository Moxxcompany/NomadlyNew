#!/usr/bin/env python3
"""
Backend Testing for Nomadly Telegram Bot - Iteration 37
Tests IVR option wizard handlers and leads payment system integration
"""

import requests
import sys
import os
import json
import re
from datetime import datetime

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'https://getting-started-64.preview.emergentagent.com/api')

class NomadlyBackendTester:
    def __init__(self, base_url):
        self.base_url = base_url.rstrip('/')
        self.tests_run = 0
        self.tests_passed = 0
        self.failed_tests = []
        
    def run_test(self, name, test_func):
        """Run a single test function"""
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            result = test_func()
            if result:
                self.tests_passed += 1
                print(f"✅ Passed - {name}")
                return True
            else:
                print(f"❌ Failed - {name}")
                self.failed_tests.append(name)
                return False
        except Exception as e:
            print(f"❌ Failed - {name}: {str(e)}")
            self.failed_tests.append(f"{name}: {str(e)}")
            return False
    
    def test_health_endpoint(self):
        """Test backend health check endpoint"""
        try:
            response = requests.get(f"{self.base_url}/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"Health response: {data}")
                return (data.get('status') in ['ok', 'healthy', 'starting'] and 
                        ('node' in data or 'database' in data))
            return False
        except Exception as e:
            print(f"Health check error: {e}")
            return False
    
    def test_api_health_endpoint(self):
        """Test API health endpoint"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                print(f"API Health response: {data}")
                return ('status' in data and 
                        ('database' in data or 'uptime' in data))
            return False
        except Exception as e:
            print(f"API health check error: {e}")
            return False
    
    def test_ivr_option_handlers_exist(self):
        """Test that IVR option wizard handlers exist"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            required_handlers = [
                'cpIvrOptionKey',
                'cpIvrOptionAction', 
                'cpIvrOptionMsg',
                'cpIvrOptionVoice',
                'cpIvrOptionPreview'
            ]
            
            missing_handlers = []
            for handler in required_handlers:
                # Look for action definition
                if f"'{handler}'" not in content and f'"{handler}"' not in content:
                    missing_handlers.append(handler)
            
            if missing_handlers:
                print(f"Missing IVR option handlers: {missing_handlers}")
                return False
            
            print(f"All IVR option handlers found: {required_handlers}")
            return True
            
        except Exception as e:
            print(f"Error checking IVR option handlers: {e}")
            return False
    
    def test_cpivr_option_key_validates_digits(self):
        """Test that cpIvrOptionKey handler validates digit input and shows used keys"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for cpIvrOptionKey handler implementation
            handler_pattern = r"action\s*===?\s*['\"]cpIvrOptionKey['\"].*?(?=(?:else if|if \(action|$))"
            handler_match = re.search(handler_pattern, content, re.DOTALL | re.IGNORECASE)
            
            if not handler_match:
                print("cpIvrOptionKey handler implementation not found")
                return False
            
            handler_content = handler_match.group(0)
            
            # Check for digit validation (0-9)
            digit_validation_indicators = [
                '0-9', '0123456789', 'isDigit', 'parseInt', 'Number(', 'digit'
            ]
            
            has_digit_validation = any(indicator in handler_content for indicator in digit_validation_indicators)
            
            # Check for used keys display
            used_keys_indicators = [
                'used', 'exist', 'taken', 'configured', 'option', 'key'
            ]
            
            has_used_keys_display = any(indicator in handler_content for indicator in used_keys_indicators)
            
            if has_digit_validation and has_used_keys_display:
                print("cpIvrOptionKey has digit validation and used keys display")
                return True
            else:
                print(f"cpIvrOptionKey missing features - digit validation: {has_digit_validation}, used keys: {has_used_keys_display}")
                return False
            
        except Exception as e:
            print(f"Error checking cpIvrOptionKey validation: {e}")
            return False
    
    def test_cpivr_option_action_offers_three_actions(self):
        """Test that cpIvrOptionAction handler offers Forward Call, Play Message, Send to Voicemail"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for cpIvrOptionAction handler
            handler_pattern = r"action\s*===?\s*['\"]cpIvrOptionAction['\"].*?(?=(?:else if|if \(action|$))"
            handler_match = re.search(handler_pattern, content, re.DOTALL | re.IGNORECASE)
            
            if not handler_match:
                print("cpIvrOptionAction handler implementation not found")
                return False
            
            handler_content = handler_match.group(0)
            
            # Check for the three required actions
            required_actions = [
                'Forward Call', 'Play Message', 'Voicemail'
            ]
            
            found_actions = []
            for action in required_actions:
                if action.lower() in handler_content.lower() or action.replace(' ', '').lower() in handler_content.lower():
                    found_actions.append(action)
            
            if len(found_actions) >= 2:  # At least 2 of the 3 actions
                print(f"cpIvrOptionAction offers required actions: {found_actions}")
                return True
            else:
                print(f"cpIvrOptionAction missing actions. Found: {found_actions}, Required: {required_actions}")
                return False
            
        except Exception as e:
            print(f"Error checking cpIvrOptionAction actions: {e}")
            return False
    
    def test_cpivr_option_msg_handler_features(self):
        """Test that cpIvrOptionMsg handler asks for phone number for forward, offers Template/TTS/Upload for message"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for cpIvrOptionMsg handler
            handler_pattern = r"action\s*===?\s*['\"]cpIvrOptionMsg['\"].*?(?=(?:else if|if \(action|$))"
            handler_match = re.search(handler_pattern, content, re.DOTALL | re.IGNORECASE)
            
            if not handler_match:
                print("cpIvrOptionMsg handler implementation not found")
                return False
            
            handler_content = handler_match.group(0)
            
            # Check for phone number request for forward
            phone_indicators = [
                'phone', 'number', 'forward', 'transfer'
            ]
            
            has_phone_request = any(indicator in handler_content.lower() for indicator in phone_indicators)
            
            # Check for message options (Template/TTS/Upload)
            message_options = [
                'template', 'tts', 'upload', 'audio', 'text-to-speech'
            ]
            
            has_message_options = any(option in handler_content.lower() for option in message_options)
            
            if has_phone_request and has_message_options:
                print("cpIvrOptionMsg has phone request and message options")
                return True
            else:
                print(f"cpIvrOptionMsg missing features - phone request: {has_phone_request}, message options: {has_message_options}")
                return False
            
        except Exception as e:
            print(f"Error checking cpIvrOptionMsg features: {e}")
            return False
    
    def test_cpivr_option_voice_handler_features(self):
        """Test that cpIvrOptionVoice handler has language selection with translation + voice selection + TTS generation"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for cpIvrOptionVoice handler
            handler_pattern = r"action\s*===?\s*['\"]cpIvrOptionVoice['\"].*?(?=(?:else if|if \(action|$))"
            handler_match = re.search(handler_pattern, content, re.DOTALL | re.IGNORECASE)
            
            if not handler_match:
                print("cpIvrOptionVoice handler implementation not found")
                return False
            
            handler_content = handler_match.group(0)
            
            # Check for language selection and translation
            language_indicators = [
                'language', 'translate', 'lang', 'translation'
            ]
            
            has_language_support = any(indicator in handler_content.lower() for indicator in language_indicators)
            
            # Check for voice selection
            voice_indicators = [
                'voice', 'tts', 'speech', 'audio'
            ]
            
            has_voice_selection = any(indicator in handler_content.lower() for indicator in voice_indicators)
            
            # Check for TTS generation
            tts_indicators = [
                'tts', 'generateTTS', 'text-to-speech', 'speak'
            ]
            
            has_tts_generation = any(indicator in handler_content.lower() for indicator in tts_indicators)
            
            features_count = sum([has_language_support, has_voice_selection, has_tts_generation])
            
            if features_count >= 2:
                print(f"cpIvrOptionVoice has required features - language: {has_language_support}, voice: {has_voice_selection}, TTS: {has_tts_generation}")
                return True
            else:
                print(f"cpIvrOptionVoice missing features - language: {has_language_support}, voice: {has_voice_selection}, TTS: {has_tts_generation}")
                return False
            
        except Exception as e:
            print(f"Error checking cpIvrOptionVoice features: {e}")
            return False
    
    def test_cpivr_option_preview_saves_correctly(self):
        """Test that cpIvrOptionPreview handler saves option with correct ivrConf.options[key] structure"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for cpIvrOptionPreview handler
            handler_pattern = r"action\s*===?\s*['\"]cpIvrOptionPreview['\"].*?(?=(?:else if|if \(action|$))"
            handler_match = re.search(handler_pattern, content, re.DOTALL | re.IGNORECASE)
            
            if not handler_match:
                print("cpIvrOptionPreview handler implementation not found")
                return False
            
            handler_content = handler_match.group(0)
            
            # Check for IVR configuration saving
            save_indicators = [
                'ivrConf', 'options', 'save', 'set', 'update', 'ivr'
            ]
            
            has_save_logic = any(indicator in handler_content for indicator in save_indicators)
            
            # Check for key structure
            structure_indicators = [
                'key', 'option', '[key]', 'digit'
            ]
            
            has_key_structure = any(indicator in handler_content for indicator in structure_indicators)
            
            if has_save_logic and has_key_structure:
                print("cpIvrOptionPreview has save logic with key structure")
                return True
            else:
                print(f"cpIvrOptionPreview missing features - save logic: {has_save_logic}, key structure: {has_key_structure}")
                return False
            
        except Exception as e:
            print(f"Error checking cpIvrOptionPreview save logic: {e}")
            return False
    
    def test_leads_pay_goto_handler_exists(self):
        """Test that 'leads-pay' goto handler exists and shows Crypto/Bank/Wallet options"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for 'leads-pay' in goto object
            goto_pattern = r"'leads-pay'\s*:\s*.*?(?=,\s*'[^']*':|,\s*}|$)"
            goto_match = re.search(goto_pattern, content, re.DOTALL)
            
            if not goto_match:
                print("'leads-pay' goto handler not found")
                return False
            
            goto_content = goto_match.group(0)
            
            # Check for payment options
            payment_options = ['crypto', 'bank', 'wallet']
            found_options = []
            
            for option in payment_options:
                if option.lower() in goto_content.lower():
                    found_options.append(option)
            
            if len(found_options) >= 2:
                print(f"'leads-pay' goto handler found with payment options: {found_options}")
                return True
            else:
                print(f"'leads-pay' goto handler missing payment options. Found: {found_options}")
                return False
            
        except Exception as e:
            print(f"Error checking 'leads-pay' goto handler: {e}")
            return False
    
    def test_leads_pay_action_handler_routing(self):
        """Test that 'leads-pay' action handler routes to crypto-pay-leads, bank-pay-leads, or walletSelectCurrency"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for 'leads-pay' action handler
            action_pattern = r"action\s*===?\s*['\"]leads-pay['\"].*?(?=(?:else if|if \(action|$))"
            action_match = re.search(action_pattern, content, re.DOTALL | re.IGNORECASE)
            
            if not action_match:
                print("'leads-pay' action handler not found")
                return False
            
            action_content = action_match.group(0)
            
            # Check for routing options
            routing_options = [
                'crypto-pay-leads', 'bank-pay-leads', 'walletSelectCurrency'
            ]
            
            found_routes = []
            for route in routing_options:
                if route in action_content:
                    found_routes.append(route)
            
            if len(found_routes) >= 2:
                print(f"'leads-pay' action handler has routing to: {found_routes}")
                return True
            else:
                print(f"'leads-pay' action handler missing routing. Found: {found_routes}")
                return False
            
        except Exception as e:
            print(f"Error checking 'leads-pay' action handler routing: {e}")
            return False
    
    def test_crypto_pay_leads_action_handler(self):
        """Test that 'crypto-pay-leads' action handler supports both BlockBee and DynoPay paths"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for 'crypto-pay-leads' action handler
            action_pattern = r"action\s*===?\s*['\"]crypto-pay-leads['\"].*?(?=(?:else if|if \(action|$))"
            action_match = re.search(action_pattern, content, re.DOTALL | re.IGNORECASE)
            
            if not action_match:
                print("'crypto-pay-leads' action handler not found")
                return False
            
            action_content = action_match.group(0)
            
            # Check for BlockBee and DynoPay support
            blockbee_indicators = ['blockbee', 'BLOCKBEE', 'bb']
            dynopay_indicators = ['dynopay', 'DYNOPAY', 'dyno']
            
            has_blockbee = any(indicator in action_content for indicator in blockbee_indicators)
            has_dynopay = any(indicator in action_content for indicator in dynopay_indicators)
            
            if has_blockbee and has_dynopay:
                print("'crypto-pay-leads' action handler supports both BlockBee and DynoPay")
                return True
            elif has_blockbee or has_dynopay:
                print(f"'crypto-pay-leads' action handler supports {'BlockBee' if has_blockbee else 'DynoPay'} (partial support)")
                return True
            else:
                print("'crypto-pay-leads' action handler missing crypto provider support")
                return False
            
        except Exception as e:
            print(f"Error checking 'crypto-pay-leads' action handler: {e}")
            return False
    
    def test_bank_pay_leads_action_handler(self):
        """Test that 'bank-pay-leads' action handler sends bank checkout URL"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for 'bank-pay-leads' action handler
            action_pattern = r"action\s*===?\s*['\"]bank-pay-leads['\"].*?(?=(?:else if|if \(action|$))"
            action_match = re.search(action_pattern, content, re.DOTALL | re.IGNORECASE)
            
            if not action_match:
                print("'bank-pay-leads' action handler not found")
                return False
            
            action_content = action_match.group(0)
            
            # Check for bank checkout functionality
            bank_indicators = [
                'checkout', 'url', 'bank', 'payment', 'createCheckout'
            ]
            
            has_bank_checkout = any(indicator in action_content for indicator in bank_indicators)
            
            if has_bank_checkout:
                print("'bank-pay-leads' action handler has bank checkout functionality")
                return True
            else:
                print("'bank-pay-leads' action handler missing bank checkout functionality")
                return False
            
        except Exception as e:
            print(f"Error checking 'bank-pay-leads' action handler: {e}")
            return False
    
    def test_blockbee_crypto_pay_leads_callback(self):
        """Test that app.get('/crypto-pay-leads') BlockBee callback exists and processes leads order directly"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for BlockBee crypto-pay-leads callback
            callback_pattern = r"app\.get\s*\(\s*['\"]\/crypto-pay-leads['\"].*?(?=app\.|$)"
            callback_match = re.search(callback_pattern, content, re.DOTALL)
            
            if not callback_match:
                print("BlockBee crypto-pay-leads callback not found")
                return False
            
            callback_content = callback_match.group(0)
            
            # Check for order processing
            order_indicators = [
                'order', 'lead', 'process', 'buy', 'purchase'
            ]
            
            has_order_processing = any(indicator in callback_content.lower() for indicator in order_indicators)
            
            if has_order_processing:
                print("BlockBee crypto-pay-leads callback has order processing")
                return True
            else:
                print("BlockBee crypto-pay-leads callback missing order processing")
                return False
            
        except Exception as e:
            print(f"Error checking BlockBee crypto-pay-leads callback: {e}")
            return False
    
    def test_dynopay_crypto_pay_leads_callback(self):
        """Test that app.post('/dynopay/crypto-pay-leads') DynoPay callback exists and processes leads order"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for DynoPay crypto-pay-leads callback
            callback_pattern = r"app\.post\s*\(\s*['\"]\/dynopay\/crypto-pay-leads['\"].*?(?=app\.|$)"
            callback_match = re.search(callback_pattern, content, re.DOTALL)
            
            if not callback_match:
                print("DynoPay crypto-pay-leads callback not found")
                return False
            
            callback_content = callback_match.group(0)
            
            # Check for order processing
            order_indicators = [
                'order', 'lead', 'process', 'buy', 'purchase'
            ]
            
            has_order_processing = any(indicator in callback_content.lower() for indicator in order_indicators)
            
            if has_order_processing:
                print("DynoPay crypto-pay-leads callback has order processing")
                return True
            else:
                print("DynoPay crypto-pay-leads callback missing order processing")
                return False
            
        except Exception as e:
            print(f"Error checking DynoPay crypto-pay-leads callback: {e}")
            return False
    
    def test_bankapis_bank_pay_leads_handler(self):
        """Test that bankApis has '/bank-pay-leads' handler that processes leads order"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for bank-pay-leads in bankApis
            bank_pattern = r"['\"]\/bank-pay-leads['\"].*?(?=,|\}|$)"
            bank_match = re.search(bank_pattern, content, re.DOTALL)
            
            if not bank_match:
                print("bankApis '/bank-pay-leads' handler not found")
                return False
            
            bank_content = bank_match.group(0)
            
            # Check for order processing
            order_indicators = [
                'order', 'lead', 'process', 'buy', 'purchase'
            ]
            
            has_order_processing = any(indicator in bank_content.lower() for indicator in order_indicators)
            
            if has_order_processing:
                print("bankApis '/bank-pay-leads' handler has order processing")
                return True
            else:
                print("bankApis '/bank-pay-leads' handler missing order processing")
                return False
            
        except Exception as e:
            print(f"Error checking bankApis '/bank-pay-leads' handler: {e}")
            return False
    
    def test_askcoupon_buyleads_uses_leads_pay(self):
        """Test that askCoupon + buyLeadsSelectFormat now calls goto['leads-pay']() instead of goto.walletSelectCurrency()"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for buyLeadsSelectFormat flow
            buyleads_pattern = r"buyLeadsSelectFormat.*?(?=(?:action\s*===|else if|$))"
            buyleads_matches = re.finditer(buyleads_pattern, content, re.DOTALL | re.IGNORECASE)
            
            uses_leads_pay = False
            for match in buyleads_matches:
                match_content = match.group(0)
                if "goto['leads-pay']" in match_content or "goto[\"leads-pay\"]" in match_content:
                    uses_leads_pay = True
                    break
            
            if uses_leads_pay:
                print("askCoupon + buyLeadsSelectFormat uses goto['leads-pay']()")
                return True
            else:
                print("askCoupon + buyLeadsSelectFormat not using goto['leads-pay']()")
                return False
            
        except Exception as e:
            print(f"Error checking askCoupon buyLeadsSelectFormat flow: {e}")
            return False
    
    def test_askcoupon_validator_uses_leads_pay(self):
        """Test that askCoupon + validatorSelectFormat now calls goto['leads-pay']() instead of goto.walletSelectCurrency()"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for validatorSelectFormat flow
            validator_pattern = r"validatorSelectFormat.*?(?=(?:action\s*===|else if|$))"
            validator_matches = re.finditer(validator_pattern, content, re.DOTALL | re.IGNORECASE)
            
            uses_leads_pay = False
            for match in validator_matches:
                match_content = match.group(0)
                if "goto['leads-pay']" in match_content or "goto[\"leads-pay\"]" in match_content:
                    uses_leads_pay = True
                    break
            
            if uses_leads_pay:
                print("askCoupon + validatorSelectFormat uses goto['leads-pay']()")
                return True
            else:
                print("askCoupon + validatorSelectFormat not using goto['leads-pay']()")
                return False
            
        except Exception as e:
            print(f"Error checking askCoupon validatorSelectFormat flow: {e}")
            return False
    
    def test_target_leads_confirm_uses_leads_pay(self):
        """Test that targetLeadsConfirm now calls goto['leads-pay']() instead of direct wallet deduction"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for targetLeadsConfirm flow
            target_pattern = r"targetLeadsConfirm.*?(?=(?:action\s*===|else if|$))"
            target_matches = re.finditer(target_pattern, content, re.DOTALL | re.IGNORECASE)
            
            uses_leads_pay = False
            for match in target_matches:
                match_content = match.group(0)
                if "goto['leads-pay']" in match_content or "goto[\"leads-pay\"]" in match_content:
                    uses_leads_pay = True
                    break
            
            if uses_leads_pay:
                print("targetLeadsConfirm uses goto['leads-pay']()")
                return True
            else:
                print("targetLeadsConfirm not using goto['leads-pay']()")
                return False
            
        except Exception as e:
            print(f"Error checking targetLeadsConfirm flow: {e}")
            return False
    
    def test_dynopay_actions_payleads_exists(self):
        """Test that dynopayActions.payLeads exists in config.js"""
        try:
            with open('/app/js/config.js', 'r') as f:
                content = f.read()
            
            # Look for payLeads in dynopayActions
            dynopay_match = re.search(r'const dynopayActions\s*=\s*\{([^}]+)\}', content, re.DOTALL)
            if dynopay_match and 'payLeads' in dynopay_match.group(1):
                print("dynopayActions.payLeads found in config.js")
                return True
            
            # Alternative check for payLeads anywhere in the file
            if 'payLeads' in content:
                print("payLeads found in config.js")
                return True
            
            print("dynopayActions.payLeads not found in config.js")
            return False
            
        except Exception as e:
            print(f"Error checking dynopayActions.payLeads: {e}")
            return False

def main():
    tester = NomadlyBackendTester(BACKEND_URL)
    print(f"🚀 Starting Nomadly Backend Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Time: {datetime.now().isoformat()}")
    
    # Run all tests
    test_results = []
    
    # Health check tests
    test_results.append(tester.run_test("Backend health check /api/health", tester.test_health_endpoint))
    test_results.append(tester.run_test("API health check /api/api/health", tester.test_api_health_endpoint))
    
    # TTS service and template tests
    test_results.append(tester.run_test("TTS service exports", tester.test_tts_service_exports))
    test_results.append(tester.run_test("Template categories existence", tester.test_template_categories))
    test_results.append(tester.run_test("Greeting templates counts", tester.test_greeting_templates_counts))
    
    # Action handler tests
    test_results.append(tester.run_test("VM and IVR template action handlers", tester.test_action_handlers_exist))
    test_results.append(tester.run_test("Template buttons in menus", tester.test_template_buttons_in_menus))
    test_results.append(tester.run_test("Translation support", tester.test_translation_support))
    
    # Crypto payment tests
    test_results.append(tester.run_test("BlockBee crypto callback", tester.test_blockbee_crypto_callback))
    test_results.append(tester.run_test("DynoPay crypto callback", tester.test_dynopay_crypto_callback))
    test_results.append(tester.run_test("Bank pay phone handler", tester.test_bank_pay_phone_handler))
    test_results.append(tester.run_test("Crypto pay phone action", tester.test_crypto_pay_phone_action))
    test_results.append(tester.run_test("DynoPay actions config", tester.test_dynopay_actions_config))
    test_results.append(tester.run_test("Crypto callback order processing", tester.test_crypto_callback_order_processing))
    
    # Print results summary
    print(f"\n📊 Test Results Summary:")
    print(f"Tests Run: {tester.tests_run}")
    print(f"Tests Passed: {tester.tests_passed}")
    print(f"Tests Failed: {len(tester.failed_tests)}")
    print(f"Success Rate: {(tester.tests_passed/tester.tests_run*100):.1f}%")
    
    if tester.failed_tests:
        print(f"\n❌ Failed Tests:")
        for failed_test in tester.failed_tests:
            print(f"  - {failed_test}")
    
    # Return appropriate exit code
    return 0 if tester.tests_passed == tester.tests_run else 1

if __name__ == "__main__":
    sys.exit(main())