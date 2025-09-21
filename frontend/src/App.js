import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card.jsx';
import { Button } from './components/ui/button.jsx';
import { Textarea } from './components/ui/textarea.jsx';
import { Input } from './components/ui/input.jsx';
import { Label } from './components/ui/label.jsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select.jsx';
import { Badge } from './components/ui/badge.jsx';
import { Alert, AlertDescription } from './components/ui/alert.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs.jsx';
import { Separator } from './components/ui/separator.jsx';
import { ScrollArea } from './components/ui/scroll-area.jsx';
import { Toaster } from 'sonner';
import { useToast } from './hooks/use-toast.js';
import { 
  FileText, 
  Upload, 
  MessageCircle, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  MessageSquare,
  Globe,
  Building,
  Sparkles,
  Users,
  Scale,
  Book,
  ArrowRight,
  Star,
  Award
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const HomePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API}/documents`);
      setDocuments(response.data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast({
        title: "Error",
        description: "Failed to load documents",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRiskBadgeColor = (severity) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-white to-stone-100">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1603796846097-bee99e4a601f"
            alt="Legal collaboration"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-amber-50/85 to-stone-100/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-2 bg-amber-100 text-amber-900 px-4 py-2 rounded-full border border-amber-200">
                <Scale className="h-5 w-5" />
                <span className="font-medium">Legal Document Demystifier</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight text-shadow-lg">
              Make Legal Documents
              <span className="text-amber-800 block drop-shadow-sm">Crystal Clear</span>
            </h1>
            <p className="text-xl text-gray-800 mb-8 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-sm">
              Transform complex legal jargon into plain English. Get personalized insights, risk alerts, and actionable guidance for any legal document.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/upload')}
                size="lg"
                className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-0"
              >
                <Upload className="mr-2 h-5 w-5" />
                Analyze Your Document
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-gray-400 text-gray-800 hover:bg-stone-100 px-8 py-3 text-lg rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                <Book className="mr-2 h-5 w-5" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white relative">
        <div className="absolute inset-0 opacity-5">
          <img 
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72"
            alt="Professional office"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powered by advanced AI to provide accurate, region-specific legal guidance
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-stone-50 to-white hover:transform hover:scale-105 group">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto w-24 h-24 mb-4 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1600880292089-90a7e086ee0c"
                    alt="Team collaboration"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-amber-800/20 flex items-center justify-center">
                    <MessageCircle className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <CardTitle className="text-xl text-gray-900">Smart Q&A</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Ask any question about your document and get instant, personalized answers in plain language.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-amber-50 to-white hover:transform hover:scale-105 group">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto w-24 h-24 mb-4 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.pexels.com/photos/5669602/pexels-photo-5669602.jpeg"
                    alt="Scales of justice"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-stone-800/20 flex items-center justify-center">
                    <Shield className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <CardTitle className="text-xl text-gray-900">Risk Detection</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Automatically identify hidden risks and understand real-world consequences before signing.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-neutral-50 to-white hover:transform hover:scale-105 group">
              <CardHeader className="text-center pb-4">
                <div className="relative mx-auto w-24 h-24 mb-4 rounded-xl overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1521791136064-7986c2920216"
                    alt="Professional handshake"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gray-800/20 flex items-center justify-center">
                    <Globe className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <CardTitle className="text-xl text-gray-900">Region-Aware</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600">
                  Get legally accurate guidance tailored to your specific location and industry context.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-20 bg-stone-50 relative">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg"
            alt="Professional meeting"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Trusted by Professionals
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
                  <Users className="h-8 w-8 text-amber-800" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">10,000+</div>
                <div className="text-gray-600">Documents Analyzed</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-300">
                  <Award className="h-8 w-8 text-stone-800" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">98%</div>
                <div className="text-gray-600">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-300">
                  <Star className="h-8 w-8 text-gray-800" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">4.9/5</div>
                <div className="text-gray-600">User Rating</div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg max-w-4xl mx-auto">
              <blockquote className="text-lg text-gray-700 italic mb-4">
                "This platform transformed how I handle legal documents. The AI explanations are incredibly accurate and the risk alerts have saved me from potential issues multiple times."
              </blockquote>
              <div className="flex items-center justify-center space-x-4">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
                  alt="User testimonial"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="text-left">
                  <div className="font-semibold text-gray-900">Sarah Johnson</div>
                  <div className="text-gray-600">Small Business Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Documents */}
      {documents && documents.length > 0 && (
        <div className="py-20 bg-white relative">
          <div className="absolute inset-0 opacity-5">
            <img 
              src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg"
              alt="Legal documents"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Recent Analyses</h2>
              <p className="text-lg text-gray-600">Your recently analyzed documents</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents && documents.slice(0, 6).map((doc) => (
                <Card 
                  key={doc.id} 
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 bg-white border-0 shadow-md hover:transform hover:scale-105 group"
                  onClick={() => navigate(`/document/${doc.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center border border-amber-200">
                          <FileText className="h-5 w-5 text-amber-800" />
                        </div>
                        <CardTitle className="text-lg text-gray-900 truncate">
                          {doc.document_name}
                        </CardTitle>
                      </div>
                      <Badge variant="outline" className="text-xs border-stone-300 text-stone-700">
                        {doc.document_type}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {doc.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{formatDate(doc.created_at)}</span>
                      {doc.risk_alerts && doc.risk_alerts.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-3 w-3 text-amber-600" />
                          <span>{doc.risk_alerts.length} alerts</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-amber-800 text-sm font-medium group-hover:text-amber-900">
                      <span>View Analysis</span>
                      <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="py-20 bg-gradient-to-r from-amber-800 to-amber-900 relative">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72"
            alt="Professional corridor"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Understand Your Legal Documents?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Join thousands of professionals who trust our AI-powered analysis
          </p>
          <Button 
            onClick={() => navigate('/upload')}
            size="lg"
            className="bg-white text-amber-800 hover:bg-gray-100 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Upload className="mr-2 h-5 w-5" />
            Start Your Free Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

const UploadPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    document_name: '',
    document_content: '',
    document_type: 'general',
    user_region: 'US',
    user_industry: 'general'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.document_name.trim() || !formData.document_content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API}/documents/analyze`, formData);
      toast({
        title: "Success!",
        description: "Your document has been analyzed successfully",
      });
      navigate(`/document/${response.data.id}`);
    } catch (error) {
      console.error('Error analyzing document:', error);
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to analyze document",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-50 py-12 relative">
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg"
          alt="Legal documents background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-gray-700 hover:text-gray-900 hover:bg-stone-100"
          >
            ← Back to Home
          </Button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upload Your Legal Document
          </h1>
          <p className="text-lg text-gray-600">
            Get instant analysis, risk alerts, and personalized guidance
          </p>
        </div>

        <Card className="bg-white shadow-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-100 to-stone-100 p-6 border-b">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-16 h-16 bg-amber-800 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <div className="text-center">
                <CardTitle className="text-2xl text-gray-900">Document Analysis</CardTitle>
                <CardDescription className="text-gray-600">
                  Paste your document text below and we'll analyze it for you
                </CardDescription>
              </div>
            </div>
          </div>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="document_name" className="text-gray-800 font-medium">
                    Document Name *
                  </Label>
                  <Input
                    id="document_name"
                    placeholder="e.g., Employment Contract"
                    value={formData.document_name}
                    onChange={(e) => setFormData({...formData, document_name: e.target.value})}
                    className="border-stone-300 focus:border-amber-600 focus:ring-amber-600"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document_type" className="text-gray-800 font-medium">
                    Document Type
                  </Label>
                  <Select 
                    value={formData.document_type} 
                    onValueChange={(value) => setFormData({...formData, document_type: value})}
                  >
                    <SelectTrigger className="border-stone-300 focus:border-amber-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="employment">Employment Contract</SelectItem>
                      <SelectItem value="lease">Lease Agreement</SelectItem>
                      <SelectItem value="freelance">Freelance Contract</SelectItem>
                      <SelectItem value="nda">Non-Disclosure Agreement</SelectItem>
                      <SelectItem value="terms">Terms of Service</SelectItem>
                      <SelectItem value="privacy">Privacy Policy</SelectItem>
                      <SelectItem value="partnership">Partnership Agreement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_region" className="text-gray-800 font-medium">
                    Your Region
                  </Label>
                  <Select 
                    value={formData.user_region} 
                    onValueChange={(value) => setFormData({...formData, user_region: value})}
                  >
                    <SelectTrigger className="border-stone-300 focus:border-amber-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="US">United States</SelectItem>
                      <SelectItem value="CA">Canada</SelectItem>
                      <SelectItem value="UK">United Kingdom</SelectItem>
                      <SelectItem value="AU">Australia</SelectItem>
                      <SelectItem value="EU">European Union</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_industry" className="text-gray-800 font-medium">
                    Your Industry
                  </Label>
                  <Select 
                    value={formData.user_industry} 
                    onValueChange={(value) => setFormData({...formData, user_industry: value})}
                  >
                    <SelectTrigger className="border-stone-300 focus:border-amber-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="retail">Retail</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="consulting">Consulting</SelectItem>
                      <SelectItem value="real-estate">Real Estate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document_content" className="text-gray-800 font-medium">
                  Document Content *
                </Label>
                <Textarea
                  id="document_content"
                  placeholder="Paste your document text here..."
                  value={formData.document_content}
                  onChange={(e) => setFormData({...formData, document_content: e.target.value})}
                  className="min-h-[300px] border-stone-300 focus:border-amber-600 focus:ring-amber-600"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-800 hover:bg-amber-900 text-white py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Sparkles className="mr-2 h-5 w-5 animate-spin" />
                    Analyzing Document...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Analyze Document
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DocumentDetailPage = () => {
  const { documentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [document, setDocument] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchDocument();
    fetchChatHistory();
  }, [documentId]);

  const fetchDocument = async () => {
    try {
      const response = await axios.get(`${API}/documents/${documentId}`);
      setDocument(response.data);
    } catch (error) {
      console.error('Error fetching document:', error);
      toast({
        title: "Error",
        description: "Failed to load document",
        variant: "destructive"
      });
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const response = await axios.get(`${API}/documents/${documentId}/chat`);
      setChatMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    setChatLoading(true);
    try {
      const response = await axios.post(`${API}/documents/${documentId}/chat`, {
        document_id: documentId,
        question: question.trim()
      });
      
      setChatMessages([...chatMessages, response.data]);
      setQuestion('');
      toast({
        title: "Question answered!",
        description: "Your question has been answered successfully",
      });
    } catch (error) {
      console.error('Error asking question:', error);
      toast({
        title: "Error",
        description: "Failed to process your question",
        variant: "destructive"
      });
    } finally {
      setChatLoading(false);
    }
  };

  const getRiskBadgeColor = (severity) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getRiskIcon = (severity) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-4 w-4" />;
      case 'medium': return <Shield className="h-4 w-4" />;
      case 'low': return <CheckCircle2 className="h-4 w-4" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-8 w-8 animate-spin text-amber-800 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading document analysis...</p>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Document not found</p>
          <Button onClick={() => navigate('/')} className="mt-4 bg-amber-800 hover:bg-amber-900">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-neutral-50 relative">
      <div className="absolute inset-0 opacity-5">
        <img 
          src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg"
          alt="Professional meeting background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4 text-gray-700 hover:text-gray-900 hover:bg-stone-100"
          >
            ← Back to Home
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{document.document_name}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline" className="border-stone-300 text-stone-700">{document.document_type}</Badge>
                <span className="text-sm text-gray-500">
                  Analyzed on {new Date(document.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <Card className="bg-white shadow-lg border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-100 to-stone-100 p-4">
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-amber-800" />
                  <span>Document Summary</span>
                </CardTitle>
              </div>
              <CardContent className="p-6">
                <p className="text-gray-700 leading-relaxed">{document.summary}</p>
              </CardContent>
            </Card>

            {/* Risk Alerts */}
            {document.risk_alerts && document.risk_alerts.length > 0 && (
              <Card className="bg-white shadow-lg border-0 overflow-hidden">
                <div className="bg-gradient-to-r from-red-100 to-orange-100 p-4">
                  <CardTitle className="flex items-center space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-700" />
                    <span>Risk Alerts</span>
                  </CardTitle>
                </div>
                <CardContent className="p-6 space-y-4">
                  {document.risk_alerts.map((alert, index) => (
                    <Alert key={index} className="border-l-4 border-l-amber-600 bg-amber-50">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <Badge 
                            variant={getRiskBadgeColor(alert.severity)} 
                            className={`capitalize ${
                              alert.severity === 'high' ? 'bg-red-600 text-white' :
                              alert.severity === 'medium' ? 'bg-amber-600 text-white' :
                              'bg-stone-600 text-white'
                            }`}
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{alert.title}</h4>
                          <p className="text-gray-700 mb-2">{alert.description}</p>
                          <div className="bg-white p-3 rounded-lg border border-stone-200">
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Real-life consequence:</strong> {alert.consequence}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Action required:</strong> {alert.action_required}
                            </p>
                          </div>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Analysis */}
            <Card className="bg-white shadow-lg border-0 overflow-hidden">
              <div className="bg-gradient-to-r from-stone-100 to-gray-100 p-4">
                <CardTitle className="flex items-center space-x-2">
                  <Book className="h-5 w-5 text-stone-700" />
                  <span>Detailed Analysis</span>
                </CardTitle>
              </div>
              <CardContent className="p-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {document.analysis}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white shadow-lg border-0 sticky top-8 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-100 to-yellow-100 p-4">
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-amber-700" />
                  <span>Ask Questions</span>
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Get instant answers about this document
                </CardDescription>
              </div>
              <CardContent className="p-4 space-y-4">
                {/* Chat Messages */}
                <ScrollArea className="h-80 w-full border rounded-lg p-4 bg-stone-50">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No questions yet. Ask something about this document!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {chatMessages.map((msg, index) => (
                        <div key={msg.id || index} className="space-y-2">
                          <div className="bg-amber-100 text-amber-900 p-3 rounded-lg border border-amber-200">
                            <p className="font-medium text-sm">You asked:</p>
                            <p>{msg.question}</p>
                          </div>
                          <div className="bg-stone-100 text-stone-900 p-3 rounded-lg border border-stone-200">
                            <p className="font-medium text-sm">Answer:</p>
                            <p className="whitespace-pre-wrap">{msg.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                {/* Ask Question Form */}
                <form onSubmit={handleAskQuestion} className="space-y-3">
                  <Textarea
                    placeholder="Ask any question about this document..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="min-h-[80px] border-stone-300 focus:border-amber-600 focus:ring-amber-600"
                  />
                  <Button
                    type="submit"
                    disabled={chatLoading || !question.trim()}
                    className="w-full bg-amber-800 hover:bg-amber-900 text-white"
                  >
                    {chatLoading ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Ask Question
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/document/:documentId" element={<DocumentDetailPage />} />
        </Routes>
        <Toaster position="top-right" />
      </BrowserRouter>
    </div>
  );
}

export default App;