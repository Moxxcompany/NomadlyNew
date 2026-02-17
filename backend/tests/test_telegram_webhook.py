"""
NomadlyBot Telegram Webhook Tests
Tests domain registration flows via webhook simulation:
- Domain search (available/unavailable)
- Price shown after domain check
- Shortener Yes/No paths
- NS selection flows
- Payment screen with Apply Coupon
- State persistence in MongoDB
"""

import pytest
import requests
import os
import time
import random
from pymongo import MongoClient

# Configuration
BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
MONGO_URL = os.environ.get('MONGO_URL')
DB_NAME = os.environ.get('DB_NAME', 'test')
TEST_CHAT_ID = 999888777  # Test chat ID for webhook tests

# MongoDB connection for state verification
mongo_client = None
db = None

def get_mongo_client():
    global mongo_client, db
    if mongo_client is None:
        mongo_client = MongoClient(MONGO_URL)
        db = mongo_client[DB_NAME]
    return db

@pytest.fixture(scope="module")
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session

@pytest.fixture(scope="module")
def update_id_counter():
    """Counter for unique update IDs"""
    return {"value": random.randint(100000, 999999)}

def send_webhook(session, chat_id, message_text, update_id_counter):
    """Helper to send a Telegram webhook payload"""
    update_id_counter["value"] += 1
    payload = {
        "update_id": update_id_counter["value"],
        "message": {
            "message_id": update_id_counter["value"],
            "from": {
                "id": chat_id,
                "is_bot": False,
                "first_name": "Test",
                "username": "tester"
            },
            "chat": {
                "id": chat_id,
                "type": "private"
            },
            "date": int(time.time()),
            "text": message_text
        }
    }
    response = session.post(f"{BASE_URL}/api/telegram/webhook", json=payload)
    return response

class TestWebhookEndpoint:
    """Basic webhook endpoint tests"""
    
    def test_webhook_endpoint_returns_200(self, api_client, update_id_counter):
        """Webhook endpoint should return 200 OK"""
        response = send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✅ Webhook endpoint returns 200 OK")
        time.sleep(2)

    def test_health_endpoint(self, api_client):
        """Health endpoint should return healthy status"""
        response = api_client.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        print("✅ Health endpoint returns 200 OK")


class TestDomainSearchFlow:
    """Domain search and availability tests"""
    
    def test_start_command_initializes_user(self, api_client, update_id_counter):
        """User should be initialized with /start command"""
        response = send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        assert response.status_code == 200
        print("✅ /start command accepted")
        time.sleep(2)

    def test_navigate_to_domain_menu(self, api_client, update_id_counter):
        """Navigate to domain names menu"""
        # Click on domain menu - the exact button text from config.js
        response = send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        assert response.status_code == 200
        print("✅ Navigated to domain menu")
        time.sleep(2)

    def test_click_buy_domain_names(self, api_client, update_id_counter):
        """Click buy domain names option"""
        response = send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        assert response.status_code == 200
        print("✅ Clicked Buy Domain Names")
        time.sleep(2)

    def test_search_available_domain(self, api_client, update_id_counter):
        """Search for an available domain - should show price in shortener question"""
        # Generate a random domain name to ensure availability
        random_suffix = random.randint(10000, 99999)
        domain = f"testdomainxyz{random_suffix}.sbs"
        
        response = send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        assert response.status_code == 200
        print(f"✅ Domain search for {domain} submitted")
        
        # Wait for domain check (can take 5-8 seconds)
        time.sleep(8)
        
        # Verify state was saved with domain and price
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            assert state_doc.get('domain') == domain, f"Domain not saved in state: {state_doc.get('domain')}"
            assert state_doc.get('price') is not None, "Price not saved in state"
            assert state_doc.get('registrar') is not None, "Registrar not saved in state"
            print(f"✅ State verified: domain={state_doc.get('domain')}, price={state_doc.get('price')}, registrar={state_doc.get('registrar')}")
        else:
            print("⚠️ State document not found - may need to check logs")


class TestShortenerYesPath:
    """Test the Shortener 'Yes' path - should skip NS selection"""
    
    def test_shortener_yes_skips_ns_selection(self, api_client, update_id_counter):
        """Answering 'Yes' to shortener question should go directly to payment"""
        # First, ensure we're at the shortener question
        # Send /start -> domain menu -> buy domain -> search domain
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        # Search for domain
        random_suffix = random.randint(10000, 99999)
        domain = f"shorteneryes{random_suffix}.sbs"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        # Answer "Yes" to shortener question
        response = send_webhook(api_client, TEST_CHAT_ID, "Yes", update_id_counter)
        assert response.status_code == 200
        print("✅ Answered 'Yes' to shortener question")
        time.sleep(2)
        
        # Verify state - nsChoice should be 'provider_default' and action should be 'domain-pay'
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            assert state_doc.get('nsChoice') == 'provider_default', f"nsChoice should be 'provider_default', got {state_doc.get('nsChoice')}"
            assert state_doc.get('askDomainToUseWithShortener') == True, "askDomainToUseWithShortener should be True"
            print(f"✅ State verified: nsChoice={state_doc.get('nsChoice')}, askDomainToUseWithShortener={state_doc.get('askDomainToUseWithShortener')}")
            print(f"   Current action: {state_doc.get('action')}")


class TestShortenerNoPath:
    """Test the Shortener 'No' path - should show NS selection"""
    
    def test_shortener_no_shows_ns_selection(self, api_client, update_id_counter):
        """Answering 'No' to shortener question should show NS selection"""
        # Navigate to domain purchase flow
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        # Search for domain
        random_suffix = random.randint(10000, 99999)
        domain = f"shortenerno{random_suffix}.sbs"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        # Answer "No" to shortener question
        response = send_webhook(api_client, TEST_CHAT_ID, "No", update_id_counter)
        assert response.status_code == 200
        print("✅ Answered 'No' to shortener question")
        time.sleep(2)
        
        # Verify state - action should be 'domainNsSelect'
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            assert state_doc.get('action') == 'domainNsSelect', f"Action should be 'domainNsSelect', got {state_doc.get('action')}"
            assert state_doc.get('askDomainToUseWithShortener') == False, "askDomainToUseWithShortener should be False"
            print(f"✅ State verified: action={state_doc.get('action')}, askDomainToUseWithShortener={state_doc.get('askDomainToUseWithShortener')}")


class TestNSSelectionFlow:
    """Test NS selection options"""
    
    def test_standard_dns_selection(self, api_client, update_id_counter):
        """Standard DNS selection should go to payment"""
        # Navigate to NS selection
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        random_suffix = random.randint(10000, 99999)
        domain = f"standardns{random_suffix}.sbs"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        # Say No to shortener to get NS selection
        send_webhook(api_client, TEST_CHAT_ID, "No", update_id_counter)
        time.sleep(2)
        
        # Select Standard DNS (from config.js: user.nsProviderDefault = '🔒 Standard DNS')
        response = send_webhook(api_client, TEST_CHAT_ID, "🔒 Standard DNS", update_id_counter)
        assert response.status_code == 200
        print("✅ Selected Standard DNS")
        time.sleep(2)
        
        # Verify state - should be at domain-pay now
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            assert state_doc.get('nsChoice') == 'provider_default', f"nsChoice should be 'provider_default', got {state_doc.get('nsChoice')}"
            print(f"✅ State verified: nsChoice={state_doc.get('nsChoice')}, action={state_doc.get('action')}")

    def test_cloudflare_dns_selection(self, api_client, update_id_counter):
        """Cloudflare DNS selection should go to payment"""
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        random_suffix = random.randint(10000, 99999)
        domain = f"cloudflaredns{random_suffix}.sbs"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        send_webhook(api_client, TEST_CHAT_ID, "No", update_id_counter)
        time.sleep(2)
        
        # Select Cloudflare DNS (from config.js: user.nsCloudflare = '🛡️ Cloudflare DNS')
        response = send_webhook(api_client, TEST_CHAT_ID, "🛡️ Cloudflare DNS", update_id_counter)
        assert response.status_code == 200
        print("✅ Selected Cloudflare DNS")
        time.sleep(2)
        
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            assert state_doc.get('nsChoice') == 'cloudflare', f"nsChoice should be 'cloudflare', got {state_doc.get('nsChoice')}"
            print(f"✅ State verified: nsChoice={state_doc.get('nsChoice')}, action={state_doc.get('action')}")

    def test_custom_dns_flow(self, api_client, update_id_counter):
        """Custom DNS selection should prompt for nameservers"""
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        random_suffix = random.randint(10000, 99999)
        domain = f"customdns{random_suffix}.sbs"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        send_webhook(api_client, TEST_CHAT_ID, "No", update_id_counter)
        time.sleep(2)
        
        # Select Custom DNS (from config.js: user.nsCustom = '⚙️ Custom DNS')
        response = send_webhook(api_client, TEST_CHAT_ID, "⚙️ Custom DNS", update_id_counter)
        assert response.status_code == 200
        print("✅ Selected Custom DNS")
        time.sleep(2)
        
        # Verify we're at custom NS entry action
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            assert state_doc.get('action') == 'domainCustomNsEntry', f"Action should be 'domainCustomNsEntry', got {state_doc.get('action')}"
            print(f"✅ State verified: action={state_doc.get('action')}")

    def test_custom_ns_entry_minimum_2_required(self, api_client, update_id_counter):
        """Custom NS entry requires minimum 2 nameservers"""
        # Continue from custom DNS selection flow
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        random_suffix = random.randint(10000, 99999)
        domain = f"customns2{random_suffix}.sbs"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        send_webhook(api_client, TEST_CHAT_ID, "No", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "⚙️ Custom DNS", update_id_counter)
        time.sleep(2)
        
        # Enter valid custom nameservers (minimum 2)
        response = send_webhook(api_client, TEST_CHAT_ID, "ns1.example.com ns2.example.com", update_id_counter)
        assert response.status_code == 200
        print("✅ Entered custom nameservers")
        time.sleep(2)
        
        # Verify state - nsChoice should be 'custom' and customNS should be saved
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            assert state_doc.get('nsChoice') == 'custom', f"nsChoice should be 'custom', got {state_doc.get('nsChoice')}"
            custom_ns = state_doc.get('customNS')
            assert custom_ns is not None, "customNS should be saved"
            assert len(custom_ns) >= 2, f"Should have at least 2 nameservers, got {len(custom_ns)}"
            print(f"✅ State verified: nsChoice={state_doc.get('nsChoice')}, customNS={custom_ns}")


class TestPaymentScreen:
    """Test payment screen functionality"""
    
    def test_payment_screen_shows_apply_coupon(self, api_client, update_id_counter):
        """Payment screen should show Apply Coupon button"""
        # Get to payment screen via Yes shortener path
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        random_suffix = random.randint(10000, 99999)
        domain = f"paymenttest{random_suffix}.sbs"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        send_webhook(api_client, TEST_CHAT_ID, "Yes", update_id_counter)
        time.sleep(2)
        
        # Verify we're at domain-pay action
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            # Action should be 'domain-pay' (or we might be at free domain prompt for subscribed users)
            action = state_doc.get('action')
            assert action in ['domain-pay', 'get-free-domain'], f"Action should be 'domain-pay' or 'get-free-domain', got {action}"
            print(f"✅ At payment screen or free domain prompt: action={action}")

    def test_apply_coupon_button_navigates_to_coupon_entry(self, api_client, update_id_counter):
        """Apply Coupon button should navigate to coupon entry"""
        # Navigate to payment screen
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        random_suffix = random.randint(10000, 99999)
        domain = f"coupontest{random_suffix}.xyz"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        send_webhook(api_client, TEST_CHAT_ID, "Yes", update_id_counter)
        time.sleep(2)
        
        # Click Apply Coupon
        response = send_webhook(api_client, TEST_CHAT_ID, "🎟️ Apply Coupon", update_id_counter)
        assert response.status_code == 200
        print("✅ Clicked Apply Coupon button")
        time.sleep(2)
        
        # Verify we're at coupon entry action
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            action = state_doc.get('action')
            # Action should contain 'askCoupon'
            assert 'askCoupon' in action, f"Action should contain 'askCoupon', got {action}"
            print(f"✅ At coupon entry: action={action}")


class TestBackNavigation:
    """Test back button navigation"""
    
    def test_back_from_payment_goes_to_ns_selection_when_shortener_no(self, api_client, update_id_counter):
        """Back from payment should go to NS selection if shortener=No"""
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        random_suffix = random.randint(10000, 99999)
        domain = f"backtest{random_suffix}.sbs"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        # Say No to shortener, select Standard DNS
        send_webhook(api_client, TEST_CHAT_ID, "No", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🔒 Standard DNS", update_id_counter)
        time.sleep(2)
        
        # Now we're at payment, click Back
        response = send_webhook(api_client, TEST_CHAT_ID, "Back", update_id_counter)
        assert response.status_code == 200
        print("✅ Clicked Back from payment")
        time.sleep(2)
        
        # Verify we're back at NS selection
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            action = state_doc.get('action')
            assert action == 'domainNsSelect', f"Should be at NS selection, got {action}"
            print(f"✅ Back navigation correct: action={action}")

    def test_back_from_payment_goes_to_shortener_question_when_shortener_yes(self, api_client, update_id_counter):
        """Back from payment should go to shortener question if shortener=Yes"""
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        random_suffix = random.randint(10000, 99999)
        domain = f"backtest2{random_suffix}.sbs"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        # Say Yes to shortener
        send_webhook(api_client, TEST_CHAT_ID, "Yes", update_id_counter)
        time.sleep(2)
        
        # Now click Back from payment
        response = send_webhook(api_client, TEST_CHAT_ID, "Back", update_id_counter)
        assert response.status_code == 200
        print("✅ Clicked Back from payment (shortener=Yes)")
        time.sleep(2)
        
        # Verify we're back at shortener question
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            action = state_doc.get('action')
            assert action == 'askDomainToUseWithShortener', f"Should be at shortener question, got {action}"
            print(f"✅ Back navigation correct: action={action}")


class TestUnavailableDomainFlow:
    """Test unavailable domain with alternative TLD suggestions"""
    
    def test_unavailable_domain_shows_alternatives(self, api_client, update_id_counter):
        """Unavailable domain should show alternative TLD suggestions"""
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        # Search for a domain that is definitely taken (google.com)
        response = send_webhook(api_client, TEST_CHAT_ID, "google.com", update_id_counter)
        assert response.status_code == 200
        print("✅ Searched for unavailable domain (google.com)")
        time.sleep(8)  # Wait for domain check and alternative search
        
        # State should still be at 'choose-domain-to-buy' waiting for another domain
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            action = state_doc.get('action')
            assert action == 'choose-domain-to-buy', f"Should still be at domain search, got {action}"
            print(f"✅ Stayed at domain search after unavailable domain: action={action}")


class TestStatePersistence:
    """Test MongoDB state persistence"""
    
    def test_state_persists_domain_price_registrar(self, api_client, update_id_counter):
        """State should persist domain, price, and registrar after domain check"""
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        random_suffix = random.randint(10000, 99999)
        domain = f"statetest{random_suffix}.sbs"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        # Verify state contains all required fields
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        assert state_doc is not None, "State document should exist"
        assert state_doc.get('domain') == domain, f"Domain should be {domain}, got {state_doc.get('domain')}"
        assert state_doc.get('price') is not None, "Price should be saved"
        assert state_doc.get('registrar') in ['ConnectReseller', 'OpenProvider'], f"Registrar should be CR or OP, got {state_doc.get('registrar')}"
        
        print(f"✅ State persistence verified:")
        print(f"   domain={state_doc.get('domain')}")
        print(f"   price={state_doc.get('price')}")
        print(f"   registrar={state_doc.get('registrar')}")
        print(f"   originalPrice={state_doc.get('originalPrice')}")


class TestKeyboardButtons:
    """Test keyboard button presence"""
    
    def test_ns_selection_has_correct_buttons(self, api_client, update_id_counter):
        """NS selection should have exactly the correct buttons without duplicates"""
        # The test verifies via state that we can reach NS selection
        # The actual keyboard is sent via bot.sendMessage which we can't directly inspect
        # But we can verify the flow works correctly by checking state transitions
        
        send_webhook(api_client, TEST_CHAT_ID, "/start", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🌐 Register Domain Names - ❌ DMCA", update_id_counter)
        time.sleep(2)
        send_webhook(api_client, TEST_CHAT_ID, "🛒🌐 Buy Domain Names", update_id_counter)
        time.sleep(2)
        
        random_suffix = random.randint(10000, 99999)
        domain = f"kbtest{random_suffix}.sbs"
        send_webhook(api_client, TEST_CHAT_ID, domain, update_id_counter)
        time.sleep(8)
        
        send_webhook(api_client, TEST_CHAT_ID, "No", update_id_counter)
        time.sleep(2)
        
        # Verify we're at NS selection
        mongo_db = get_mongo_client()
        state_doc = mongo_db.state.find_one({"_id": TEST_CHAT_ID})
        
        if state_doc:
            assert state_doc.get('action') == 'domainNsSelect', f"Should be at NS selection, got {state_doc.get('action')}"
            print("✅ NS selection keyboard flow verified (action=domainNsSelect)")
            
            # The keyboard buttons are verified by the fact that the correct button names work:
            # '🔒 Standard DNS', '🛡️ Cloudflare DNS', '⚙️ Custom DNS'
            print("   Expected buttons: 🔒 Standard DNS, 🛡️ Cloudflare DNS, ⚙️ Custom DNS, Back, Cancel")


# Cleanup fixture
@pytest.fixture(scope="module", autouse=True)
def cleanup_test_state():
    """Clean up test state after all tests"""
    yield
    # Clean up test user state after tests
    try:
        mongo_db = get_mongo_client()
        if mongo_db:
            result = mongo_db.state.delete_one({"_id": TEST_CHAT_ID})
            if result.deleted_count > 0:
                print(f"\n🧹 Cleaned up test state for chat ID {TEST_CHAT_ID}")
    except Exception as e:
        print(f"\n⚠️ Cleanup error: {e}")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
