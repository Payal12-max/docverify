import requests
import sys
import json
from datetime import datetime

class LegalDocumentAPITester:
    def __init__(self, base_url="https://legalclarity-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.document_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else f"{self.api_url}/"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error: {response.text}")
                return False, {}

        except requests.exceptions.Timeout:
            print(f"❌ Failed - Request timed out after {timeout} seconds")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test the health check endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "",
            200
        )
        if success and isinstance(response, dict):
            expected_message = "Legal Document Demystifier API"
            if response.get('message') == expected_message:
                print(f"   ✅ Correct message: {expected_message}")
                return True
            else:
                print(f"   ❌ Unexpected message: {response.get('message')}")
        return False

    def test_document_analysis(self):
        """Test document analysis with sample employment contract"""
        sample_document = """
EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into on January 1, 2024 between TechCorp Inc., a Delaware corporation ("Company"), and John Doe ("Employee").

1. POSITION AND DUTIES
Employee will serve as Software Engineer and will perform such duties as assigned by the Company. Employee agrees to devote full-time attention to the business of the Company.

2. COMPENSATION
Employee will receive a base salary of $80,000 per year, payable in accordance with Company's regular payroll practices.

3. TERMINATION
This agreement may be terminated by either party with or without cause upon 30 days written notice.

4. CONFIDENTIALITY
Employee agrees to maintain confidentiality of all proprietary information and trade secrets of the Company.

5. NON-COMPETE
Employee agrees not to compete with the Company for a period of 12 months after termination.
        """.strip()

        success, response = self.run_test(
            "Document Analysis",
            "POST",
            "documents/analyze",
            200,
            data={
                "document_name": "Test Employment Contract",
                "document_content": sample_document,
                "document_type": "employment",
                "user_region": "US",
                "user_industry": "technology"
            },
            timeout=60  # AI analysis might take longer
        )
        
        if success and isinstance(response, dict):
            # Store document ID for further tests
            self.document_id = response.get('id')
            print(f"   ✅ Document ID: {self.document_id}")
            
            # Check required fields
            required_fields = ['id', 'summary', 'analysis', 'risk_alerts']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"   ❌ Missing fields: {missing_fields}")
                return False
            
            # Check if risk alerts were detected
            risk_alerts = response.get('risk_alerts', [])
            print(f"   ✅ Risk alerts detected: {len(risk_alerts)}")
            for alert in risk_alerts:
                print(f"      - {alert.get('severity', 'unknown').upper()}: {alert.get('title', 'No title')}")
            
            return True
        return False

    def test_get_document(self):
        """Test retrieving document by ID"""
        if not self.document_id:
            print("❌ Skipping - No document ID available")
            return False
            
        success, response = self.run_test(
            "Get Document",
            "GET",
            f"documents/{self.document_id}",
            200
        )
        
        if success and isinstance(response, dict):
            # Check that document content is not returned (security)
            if 'document_content' in response:
                print("   ❌ Security issue: document_content should not be returned")
                return False
            print("   ✅ Document content properly excluded for security")
            return True
        return False

    def test_chat_functionality(self):
        """Test Q&A chat about the document"""
        if not self.document_id:
            print("❌ Skipping - No document ID available")
            return False
            
        test_question = "Can I be fired without cause according to this contract?"
        
        success, response = self.run_test(
            "Chat Question",
            "POST",
            f"documents/{self.document_id}/chat",
            200,
            data={
                "document_id": self.document_id,
                "question": test_question
            },
            timeout=60  # AI response might take longer
        )
        
        if success and isinstance(response, dict):
            required_fields = ['id', 'question', 'answer']
            missing_fields = [field for field in required_fields if field not in response]
            if missing_fields:
                print(f"   ❌ Missing fields: {missing_fields}")
                return False
                
            print(f"   ✅ Question: {response.get('question')}")
            print(f"   ✅ Answer length: {len(response.get('answer', ''))}")
            return True
        return False

    def test_get_chat_history(self):
        """Test retrieving chat history"""
        if not self.document_id:
            print("❌ Skipping - No document ID available")
            return False
            
        success, response = self.run_test(
            "Get Chat History",
            "GET",
            f"documents/{self.document_id}/chat",
            200
        )
        
        if success and isinstance(response, dict):
            messages = response.get('messages', [])
            print(f"   ✅ Chat messages found: {len(messages)}")
            return True
        return False

    def test_get_all_documents(self):
        """Test retrieving all documents"""
        success, response = self.run_test(
            "Get All Documents",
            "GET",
            "documents",
            200
        )
        
        if success and isinstance(response, dict):
            documents = response.get('documents', [])
            print(f"   ✅ Documents found: {len(documents)}")
            
            # Check that document content is not returned in list view
            for doc in documents:
                if 'document_content' in doc:
                    print("   ❌ Security issue: document_content should not be in list view")
                    return False
            print("   ✅ Document content properly excluded in list view")
            return True
        return False

def main():
    print("🚀 Starting Legal Document Demystifier API Tests")
    print("=" * 60)
    
    tester = LegalDocumentAPITester()
    
    # Run all tests in sequence
    tests = [
        tester.test_health_check,
        tester.test_document_analysis,
        tester.test_get_document,
        tester.test_chat_functionality,
        tester.test_get_chat_history,
        tester.test_get_all_documents
    ]
    
    for test in tests:
        try:
            test()
        except Exception as e:
            print(f"❌ Test failed with exception: {str(e)}")
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())