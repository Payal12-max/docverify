from flask import Flask
app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, Backend!"

if __name__ == "__main__":
    app.run(debug=True)
from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Form, BackgroundTasks
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timezone
import asyncio
from emergentintegrations.llm.chat import LlmChat, UserMessage
import json
import base64

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="Legal Document Demystifier", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Emergent LLM Key
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY')

# Models
class DocumentAnalysis(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    document_name: str
    document_type: str
    analysis: str
    risk_alerts: List[Dict] = []
    summary: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    user_region: Optional[str] = None
    user_industry: Optional[str] = None

class ChatMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    document_id: str
    question: str
    answer: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DocumentUploadRequest(BaseModel):
    document_name: str
    document_content: str
    document_type: str = "general"
    user_region: str = "US"
    user_industry: str = "general"

class ChatRequest(BaseModel):
    document_id: str
    question: str

class RiskAlert(BaseModel):
    severity: str  # "high", "medium", "low"
    title: str
    description: str
    consequence: str
    action_required: str

# Initialize LLM Chat
def get_llm_chat(session_id: str = None):
    return LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id or str(uuid.uuid4()),
        system_message="""You are an expert legal document analyst that helps users understand complex legal documents in plain language. 

Your role is to:
1. Analyze legal documents and identify key terms, clauses, and potential risks
2. Explain legal concepts in simple, accessible language
3. Provide region-specific and industry-specific guidance when possible
4. Identify potential risks and consequences in real-life terms
5. Suggest actionable next steps

Always be accurate, helpful, and emphasize when users should seek professional legal advice for serious matters."""
    ).with_model("gemini", "gemini-2.0-flash")

# Document Analysis Functions
async def analyze_document_with_ai(content: str, doc_type: str, region: str, industry: str) -> dict:
    """Analyze document using AI and return structured analysis"""
    chat = get_llm_chat()
    
    prompt = f"""
    Analyze this {doc_type} legal document and provide a comprehensive analysis:

    Document Content:
    {content}

    Context:
    - Document Type: {doc_type}
    - User Region: {region}
    - User Industry: {industry}

    Please provide your analysis in the following JSON format:
    {{
        "summary": "Brief 2-3 sentence summary of what this document is about",
        "key_terms": ["list", "of", "important", "terms", "and", "clauses"],
        "risk_alerts": [
            {{
                "severity": "high|medium|low",
                "title": "Risk title",
                "description": "What the risk is about",
                "consequence": "Real-life consequence in plain language",
                "action_required": "What the user should do about it"
            }}
        ],
        "region_specific_notes": "Any notes specific to the user's region",
        "industry_specific_notes": "Any notes specific to the user's industry",
        "plain_language_explanation": "Detailed explanation of the document in simple terms"
    }}

    Focus on practical implications and real-world consequences. Make it accessible and actionable.
    """
    
    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    
    try:
        # Try to extract JSON from the response
        json_start = response.find('{')
        json_end = response.rfind('}') + 1
        if json_start != -1 and json_end != -1:
            json_str = response[json_start:json_end]
            return json.loads(json_str)
        else:
            # Fallback if JSON extraction fails
            return {
                "summary": "Document analysis completed",
                "key_terms": [],
                "risk_alerts": [],
                "region_specific_notes": "",
                "industry_specific_notes": "",
                "plain_language_explanation": response
            }
    except:
        return {
            "summary": "Document analysis completed",
            "key_terms": [],
            "risk_alerts": [],
            "region_specific_notes": "",
            "industry_specific_notes": "",
            "plain_language_explanation": response
        }

async def answer_question_about_document(document_content: str, question: str, context: dict) -> str:
    """Answer user question about the document"""
    chat = get_llm_chat()
    
    prompt = f"""
    Based on this legal document, answer the user's question in a helpful, accessible way:

    Document Content:
    {document_content}

    User Question: {question}

    Context:
    - Document Type: {context.get('document_type', 'general')}
    - User Region: {context.get('user_region', 'US')}
    - User Industry: {context.get('user_industry', 'general')}

    Please provide a clear, actionable answer that:
    1. Directly addresses their question
    2. References specific parts of the document when relevant
    3. Explains any legal concepts in plain language
    4. Provides practical next steps or recommendations
    5. Mentions when they should seek professional legal advice

    Keep your answer concise but comprehensive.
    """
    
    message = UserMessage(text=prompt)
    response = await chat.send_message(message)
    return response

# API Routes
@api_router.get("/")
async def root():
    return {"message": "Legal Document Demystifier API"}

@api_router.post("/documents/analyze")
async def analyze_document(request: DocumentUploadRequest):
    """Analyze a legal document and return insights"""
    try:
        # Analyze document with AI
        analysis_result = await analyze_document_with_ai(
            request.document_content, 
            request.document_type,
            request.user_region,
            request.user_industry
        )
        
        # Create document analysis record
        doc_analysis = DocumentAnalysis(
            document_name=request.document_name,
            document_type=request.document_type,
            analysis=analysis_result.get("plain_language_explanation", ""),
            summary=analysis_result.get("summary", ""),
            risk_alerts=analysis_result.get("risk_alerts", []),
            user_region=request.user_region,
            user_industry=request.user_industry
        )
        
        # Store in database
        doc_dict = doc_analysis.dict()
        doc_dict['document_content'] = request.document_content  # Store original content for Q&A
        await db.document_analyses.insert_one(doc_dict)
        
        return {
            "id": doc_analysis.id,
            "summary": doc_analysis.summary,
            "analysis": doc_analysis.analysis,
            "risk_alerts": doc_analysis.risk_alerts,
            "key_terms": analysis_result.get("key_terms", []),
            "region_specific_notes": analysis_result.get("region_specific_notes", ""),
            "industry_specific_notes": analysis_result.get("industry_specific_notes", ""),
            "created_at": doc_analysis.created_at
        }
        
    except Exception as e:
        logging.error(f"Error analyzing document: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error analyzing document: {str(e)}")

@api_router.post("/documents/{document_id}/chat")
async def chat_about_document(document_id: str, request: ChatRequest):
    """Ask questions about a specific document"""
    try:
        # Get document from database
        doc = await db.document_analyses.find_one({"id": document_id})
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Answer question using AI
        context = {
            "document_type": doc.get("document_type"),
            "user_region": doc.get("user_region"),
            "user_industry": doc.get("user_industry")
        }
        
        answer = await answer_question_about_document(
            doc.get("document_content", ""),
            request.question,
            context
        )
        
        # Save chat message
        chat_message = ChatMessage(
            document_id=document_id,
            question=request.question,
            answer=answer
        )
        
        await db.chat_messages.insert_one(chat_message.dict())
        
        return {
            "id": chat_message.id,
            "question": chat_message.question,
            "answer": chat_message.answer,
            "created_at": chat_message.created_at
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error in chat: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

@api_router.get("/documents/{document_id}")
async def get_document(document_id: str):
    """Get document analysis by ID"""
    doc = await db.document_analyses.find_one({"id": document_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Remove document_content from response for security
    doc.pop("document_content", None)
    doc.pop("_id", None)
    return doc

@api_router.get("/documents/{document_id}/chat")
async def get_document_chat_history(document_id: str):
    """Get chat history for a document"""
    messages = await db.chat_messages.find({"document_id": document_id}).sort("created_at", 1).to_list(100)
    for msg in messages:
        msg.pop("_id", None)
    return {"messages": messages}

@api_router.get("/documents")
async def get_user_documents():
    """Get all analyzed documents (in a real app, this would be user-specific)"""
    docs = await db.document_analyses.find().sort("created_at", -1).to_list(50)
    for doc in docs:
        doc.pop("_id", None)
        doc.pop("document_content", None)  # Don't return content in list view
    return {"documents": docs}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()