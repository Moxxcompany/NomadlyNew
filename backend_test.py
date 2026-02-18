#!/usr/bin/env python3
"""
Backend Testing for Username Sync Implementation
Tests the username change detection and automatic update functionality.
"""

import requests
import json
import re
import os
import sys
import pymongo
from datetime import datetime
from pathlib import Path

class UsernameSyncTester:
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
        
        # Get MongoDB connection from backend .env
        try:
            with open('/app/backend/.env', 'r') as f:
                content = f.read()
                mongo_url_match = re.search(r'MONGO_URL=(.+)', content)
                db_name_match = re.search(r'DB_NAME=(.+)', content)
                if mongo_url_match and db_name_match:
                    self.mongo_url = mongo_url_match.group(1).strip()
                    self.db_name = db_name_match.group(1).strip()
                    self.mongo_client = pymongo.MongoClient(self.mongo_url)
                    self.db = self.mongo_client[self.db_name]
                else:
                    self.mongo_client = None
                    self.db = None
        except Exception as e:
            print(f"Warning: Could not connect to MongoDB: {e}")
            self.mongo_client = None
            self.db = None
        
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
        """Test backend health endpoint returns ok"""
        try:
            response = requests.get(f"{self.base_url}/api/health", timeout=10)
            if response.status_code == 200:
                data = response.json()
                status_ok = data.get("status") in ["healthy", "ok"] or data.get("proxy") == "running"
                
                self.log_result(
                    "Backend health endpoint at /api/health returns ok",
                    status_ok,
                    f"Status: {data.get('status', 'N/A')}, Proxy: {data.get('proxy', 'N/A')}, Node: {data.get('node', 'N/A')}",
                    "CRITICAL" if not status_ok else "INFO"
                )
                
            else:
                self.log_result(
                    "Backend health endpoint returns ok",
                    False,
                    f"HTTP {response.status_code}",
                    "CRITICAL"
                )
                
        except Exception as e:
            self.log_result(
                "Backend health endpoint returns ok",
                False,
                f"Connection error: {str(e)}",
                "CRITICAL"
            )

    def test_username_sync_code_exists(self):
        """Test _index.js line ~848-866: reads msg.from.username as currentUsername"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                lines = f.readlines()
            
            # Check lines 848-866 for username sync logic
            target_lines = lines[847:866] if len(lines) >= 866 else []
            content = ''.join(target_lines)
            
            # Test conditions
            reads_username = 'msg?.from?.username' in content
            uses_current_username = 'currentUsername' in content
            checks_difference = 'currentUsername !== nameOfChatId' in content or 'currentUsername && currentUsername !== nameOfChatId' in content
            logs_username_sync = '[UsernameSync]' in content
            
            self.log_result(
                "_index.js line ~848-866: reads msg.from.username as currentUsername",
                reads_username and uses_current_username,
                f"Reads username: {reads_username}, Uses currentUsername: {uses_current_username}",
                "CRITICAL" if not (reads_username and uses_current_username) else "INFO"
            )
            
            self.log_result(
                "_index.js: if nameOfChatId exists AND currentUsername differs from nameOfChatId, it updates nameOf with new username",
                checks_difference,
                f"Checks username difference: {checks_difference}",
                "CRITICAL" if not checks_difference else "INFO"
            )
            
            self.log_result(
                "_index.js: logs '[UsernameSync]' when username change is detected",
                logs_username_sync,
                f"Contains [UsernameSync] log: {logs_username_sync}",
                "CRITICAL" if not logs_username_sync else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "_index.js username sync code analysis",
                False,
                f"Error reading _index.js: {str(e)}",
                "CRITICAL"
            )

    def test_username_sync_updates_collections(self):
        """Test _index.js: when username changes, it creates new chatIdOf mapping and deletes old mapping"""
        try:
            with open('/app/js/_index.js', 'r') as f:
                content = f.read()
            
            # Look for specific patterns in the code
            updates_nameOf = 'set(nameOf, chatId, currentUsername)' in content
            creates_chatIdOf = 'set(chatIdOf, currentUsername, chatId)' in content
            deletes_old_mapping = 'chatIdOf.deleteOne({ _id: nameOfChatId })' in content
            
            self.log_result(
                "_index.js: when username changes, it creates new chatIdOf mapping (set chatIdOf, currentUsername, chatId)",
                creates_chatIdOf,
                f"Creates new chatIdOf mapping: {creates_chatIdOf}",
                "CRITICAL" if not creates_chatIdOf else "INFO"
            )
            
            self.log_result(
                "_index.js: when username changes, it deletes old chatIdOf mapping (chatIdOf.deleteOne _id: nameOfChatId)",
                deletes_old_mapping,
                f"Deletes old chatIdOf mapping: {deletes_old_mapping}",
                "CRITICAL" if not deletes_old_mapping else "INFO"
            )
            
            self.log_result(
                "_index.js: updates nameOf collection with new username",
                updates_nameOf,
                f"Updates nameOf: {updates_nameOf}",
                "CRITICAL" if not updates_nameOf else "INFO"
            )
                
        except Exception as e:
            self.log_result(
                "_index.js username sync collection updates",
                False,
                f"Error analyzing username sync logic: {str(e)}",
                "CRITICAL"
            )

    def test_mongodb_nameOf_hostbay_support(self):
        """Test MongoDB nameOf for chatId 5168006768 has val 'Hostbay_support'"""
        if self.db is None:
            self.log_result(
                "MongoDB nameOf for chatId 5168006768 has val 'Hostbay_support'",
                False,
                "MongoDB connection not available",
                "CRITICAL"
            )
            return
        
        try:
            nameOf_collection = self.db['nameOf']
            result = nameOf_collection.find_one({'_id': 5168006768})
            
            has_correct_value = result and result.get('val') == 'Hostbay_support'
            
            self.log_result(
                "MongoDB nameOf for chatId 5168006768 has val 'Hostbay_support'",
                has_correct_value,
                f"Found value: {result.get('val') if result else 'Not found'}",
                "CRITICAL" if not has_correct_value else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "MongoDB nameOf query for chatId 5168006768",
                False,
                f"Database query error: {str(e)}",
                "CRITICAL"
            )

    def test_mongodb_chatIdOf_hostbay_support(self):
        """Test MongoDB chatIdOf has entry _id:'Hostbay_support' val:5168006768"""
        if not self.db:
            self.log_result(
                "MongoDB chatIdOf has entry _id:'Hostbay_support' val:5168006768",
                False,
                "MongoDB connection not available",
                "CRITICAL"
            )
            return
        
        try:
            chatIdOf_collection = self.db['chatIdOf']
            result = chatIdOf_collection.find_one({'_id': 'Hostbay_support'})
            
            has_correct_value = result and result.get('val') == 5168006768
            
            self.log_result(
                "MongoDB chatIdOf has entry _id:'Hostbay_support' val:5168006768",
                has_correct_value,
                f"Found value: {result.get('val') if result else 'Not found'}",
                "CRITICAL" if not has_correct_value else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "MongoDB chatIdOf query for 'Hostbay_support'",
                False,
                f"Database query error: {str(e)}",
                "CRITICAL"
            )

    def test_mongodb_chatIdOf_no_onarrival2(self):
        """Test MongoDB chatIdOf does NOT have entry _id:'onarrival2' (stale mapping removed)"""
        if not self.db:
            self.log_result(
                "MongoDB chatIdOf does NOT have entry _id:'onarrival2' (stale mapping removed)",
                False,
                "MongoDB connection not available",
                "CRITICAL"
            )
            return
        
        try:
            chatIdOf_collection = self.db['chatIdOf']
            result = chatIdOf_collection.find_one({'_id': 'onarrival2'})
            
            no_stale_mapping = result is None
            
            self.log_result(
                "MongoDB chatIdOf does NOT have entry _id:'onarrival2' (stale mapping removed)",
                no_stale_mapping,
                f"onarrival2 entry exists: {result is not None}" if result else "onarrival2 entry does not exist (correct)",
                "MEDIUM" if not no_stale_mapping else "INFO"
            )
            
        except Exception as e:
            self.log_result(
                "MongoDB chatIdOf query for 'onarrival2'",
                False,
                f"Database query error: {str(e)}",
                "CRITICAL"
            )

    def test_mongodb_phoneNumbersOf_entry(self):
        """Test MongoDB phoneNumbersOf for chatId 5168006768 has number +18556820054 with starter plan and status active"""
        if not self.db:
            self.log_result(
                "MongoDB phoneNumbersOf for chatId 5168006768 has number +18556820054 with starter plan and status active",
                False,
                "MongoDB connection not available",
                "CRITICAL"
            )
            return
        
        try:
            phoneNumbersOf_collection = self.db['phoneNumbersOf']
            result = phoneNumbersOf_collection.find_one({'_id': 5168006768})
            
            if result and result.get('val'):
                phone_entries = result['val']
                target_phone = None
                
                # Find the specific phone number
                for phone_number, phone_data in phone_entries.items():
                    if phone_number == '+18556820054':
                        target_phone = phone_data
                        break
                
                if target_phone:
                    has_starter_plan = target_phone.get('plan') == 'starter'
                    has_active_status = target_phone.get('status') == 'active'
                    
                    self.log_result(
                        "MongoDB phoneNumbersOf for chatId 5168006768 has number +18556820054 with starter plan and status active",
                        has_starter_plan and has_active_status,
                        f"Plan: {target_phone.get('plan')}, Status: {target_phone.get('status')}",
                        "MEDIUM" if not (has_starter_plan and has_active_status) else "INFO"
                    )
                else:
                    self.log_result(
                        "MongoDB phoneNumbersOf for chatId 5168006768 has number +18556820054",
                        False,
                        f"Phone number +18556820054 not found. Available numbers: {list(phone_entries.keys()) if phone_entries else 'None'}",
                        "MEDIUM"
                    )
            else:
                self.log_result(
                    "MongoDB phoneNumbersOf for chatId 5168006768",
                    False,
                    "No phone numbers found for chatId 5168006768",
                    "MEDIUM"
                )
                
        except Exception as e:
            self.log_result(
                "MongoDB phoneNumbersOf query for chatId 5168006768",
                False,
                f"Database query error: {str(e)}",
                "CRITICAL"
            )

    def run_all_tests(self):
        """Run all username sync tests"""
        print("🔍 Testing Username Sync Implementation\n")
        
        # Health endpoint test
        self.test_health_endpoint()
        
        # Code analysis tests
        self.test_username_sync_code_exists()
        self.test_username_sync_updates_collections()
        
        # Database state verification tests
        self.test_mongodb_nameOf_hostbay_support()
        self.test_mongodb_chatIdOf_hostbay_support()
        self.test_mongodb_chatIdOf_no_onarrival2()
        self.test_mongodb_phoneNumbersOf_entry()
        
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
        
        # Close MongoDB connection
        if self.mongo_client:
            self.mongo_client.close()
        
        return {
            'tests_run': self.tests_run,
            'tests_passed': self.tests_passed, 
            'success_rate': round(self.tests_passed/self.tests_run*100, 1),
            'issues': self.issues,
            'passed_tests': self.passed_tests
        }

if __name__ == "__main__":
    tester = UsernameSyncTester()
    results = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if results['success_rate'] > 80 else 1)