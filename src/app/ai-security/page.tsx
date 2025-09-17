'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  Shield, 
  AlertTriangle, 
  TrendingUp,
  Users,
  Activity,
  Eye,
  Target,
  Zap,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'

interface ThreatLevel {
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  confidence: number;
  indicators: string[];
  recommendations: string[];
}

interface SecurityForecast {
  predictedThreats: PredictedThreat[];
  riskTrend: 'INCREASING' | 'STABLE' | 'DECREASING';
  confidenceScore: number;
  timeframe: string;
}

interface PredictedThreat {
  type: string;
  probability: number;
  estimatedImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  preventionStrategies: string[];
}

interface ExecutiveDashboard {
  securityOverview: {
    totalSecurityEvents: number;
    criticalThreats: number;
    resolvedIncidents: number;
    averageResponseTime: number;
    securityPostureScore: number;
  };
  complianceStatus: any;
  riskMetrics: any;
  businessImpact: any;
  trends: any;
  recommendations: any[];
}

export default function AISecurityDashboard() {
  const [forecast, setForecast] = useState<SecurityForecast | null>(null);
  const [executiveDashboard, setExecutiveDashboard] = useState<ExecutiveDashboard | null>(null);
  const [aiStatus, setAiStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Form states for testing AI
  const [testRequest, setTestRequest] = useState({
    userId: '',
    resourceId: '',
    action: '',
    location: '',
    userAgent: navigator.userAgent
  });
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [forecastRes, dashboardRes, statusRes] = await Promise.all([
        fetch('/api/ai-security/security-forecast', { headers }),
        fetch('/api/ai-security/executive-dashboard', { headers }),
        fetch('/api/ai-security/ai-status', { headers })
      ]);

      if (forecastRes.ok) {
        const forecastData = await forecastRes.json();
        setForecast(forecastData.forecast);
      }

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        setExecutiveDashboard(dashboardData.dashboard);
      }

      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setAiStatus(statusData.status);
      }
    } catch (error) {
      console.error('Failed to load AI dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeAccessRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/ai-security/analyze-access', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testRequest)
      });

      if (response.ok) {
        const result = await response.json();
        setAnalysisResult(result.analysis);
      } else {
        alert('Failed to analyze access request');
      }
    } catch (error) {
      console.error('AI analysis failed:', error);
      alert('AI analysis failed');
    }
  };

  const getThreatLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'text-red-800 bg-red-100';
      case 'HIGH': return 'text-orange-800 bg-orange-100';
      case 'MEDIUM': return 'text-yellow-800 bg-yellow-100';
      case 'LOW': return 'text-green-800 bg-green-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  const getRiskTrendIcon = (trend: string) => {
    switch (trend) {
      case 'INCREASING': return <TrendingUp className="h-4 w-4 text-red-600" />;
      case 'DECREASING': return <TrendingUp className="h-4 w-4 text-green-600 transform rotate-180" />;
      default: return <Activity className="h-4 w-4 text-blue-600" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Brain className="h-12 w-12 text-indigo-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading AI Security Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                AI Security Intelligence
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {aiStatus && (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                  AI Systems Online
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Security Overview', icon: Shield },
              { id: 'forecast', name: 'Threat Forecast', icon: Eye },
              { id: 'analytics', name: 'Executive Analytics', icon: BarChart3 },
              { id: 'testing', name: 'AI Testing', icon: Target }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Security Overview Tab */}
        {activeTab === 'overview' && executiveDashboard && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Security Events
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {executiveDashboard.securityOverview.totalSecurityEvents}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Critical Threats
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {executiveDashboard.securityOverview.criticalThreats}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Resolved
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {executiveDashboard.securityOverview.resolvedIncidents}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Avg Response
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {executiveDashboard.securityOverview.averageResponseTime}m
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Shield className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Security Score
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {executiveDashboard.securityOverview.securityPostureScore}/100
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            {executiveDashboard.recommendations && executiveDashboard.recommendations.length > 0 && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    AI-Powered Security Recommendations
                  </h3>
                  <div className="space-y-4">
                    {executiveDashboard.recommendations.slice(0, 3).map((rec, index) => (
                      <div key={index} className="border-l-4 border-indigo-400 bg-indigo-50 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <Zap className="h-5 w-5 text-indigo-400" />
                          </div>
                          <div className="ml-3">
                            <h4 className="text-sm font-medium text-indigo-800">
                              {rec.title}
                            </h4>
                            <p className="text-sm text-indigo-700 mt-1">
                              {rec.description}
                            </p>
                            <div className="mt-2 flex items-center text-sm text-indigo-600">
                              <span className="font-medium">Expected Impact:</span>
                              <span className="ml-1">{rec.expectedImpact}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Threat Forecast Tab */}
        {activeTab === 'forecast' && forecast && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    AI Security Forecast ({forecast.timeframe})
                  </h3>
                  <div className="flex items-center space-x-2">
                    {getRiskTrendIcon(forecast.riskTrend)}
                    <span className={`text-sm font-medium ${
                      forecast.riskTrend === 'INCREASING' ? 'text-red-600' :
                      forecast.riskTrend === 'DECREASING' ? 'text-green-600' :
                      'text-blue-600'
                    }`}>
                      Risk {forecast.riskTrend.toLowerCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({Math.round(forecast.confidenceScore * 100)}% confidence)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {forecast.predictedThreats.map((threat, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900">{threat.type}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getThreatLevelColor(threat.estimatedImpact)}`}>
                          {threat.estimatedImpact}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Probability</span>
                          <span>{Math.round(threat.probability * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${threat.probability * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Prevention Strategies:</h5>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {threat.preventionStrategies.slice(0, 2).map((strategy, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="block w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                              {strategy}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Executive Analytics Tab */}
        {activeTab === 'analytics' && executiveDashboard && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Compliance Status */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Compliance Status
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(executiveDashboard.complianceStatus.regulationStatus).map(([reg, status]: [string, any]) => (
                      <div key={reg} className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">{reg}</span>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-600 mr-2">{status.score}%</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            status.status === 'COMPLIANT' ? 'bg-green-100 text-green-800' :
                            status.status === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {status.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Business Impact */}
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                    Business Impact
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Security ROI</span>
                        <span className="text-lg font-bold text-green-600">
                          {executiveDashboard.businessImpact.securityROI.roiPercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        ${(executiveDashboard.businessImpact.securityROI.costSavings / 1000000).toFixed(1)}M cost savings
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">Cost Avoidance</span>
                        <span className="text-lg font-bold text-blue-600">
                          ${(executiveDashboard.businessImpact.costAvoidance.totalCostAvoidance / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Potential losses avoided
                      </p>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">System Uptime</span>
                        <span className="text-lg font-bold text-indigo-600">
                          {executiveDashboard.businessImpact.productivityImpact.systemUptime}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        User satisfaction: {executiveDashboard.businessImpact.productivityImpact.userSatisfactionScore}/5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Testing Tab */}
        {activeTab === 'testing' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Test AI Security Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={testRequest.userId}
                      onChange={(e) => setTestRequest({...testRequest, userId: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="user123"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resource ID
                    </label>
                    <input
                      type="text"
                      value={testRequest.resourceId}
                      onChange={(e) => setTestRequest({...testRequest, resourceId: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="resource456"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action
                    </label>
                    <select
                      value={testRequest.action}
                      onChange={(e) => setTestRequest({...testRequest, action: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select action</option>
                      <option value="READ">READ</option>
                      <option value="write">WRITE</option>
                      <option value="delete">DELETE</option>
                      <option value="execute">EXECUTE</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={testRequest.location}
                      onChange={(e) => setTestRequest({...testRequest, location: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="New York, US"
                    />
                  </div>
                </div>

                <button
                  onClick={analyzeAccessRequest}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze with AI
                </button>

                {analysisResult && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">AI Analysis Result</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Risk Score</span>
                          <span className={`text-lg font-bold ${
                            analysisResult.riskScore >= 75 ? 'text-red-600' :
                            analysisResult.riskScore >= 50 ? 'text-orange-600' :
                            analysisResult.riskScore >= 25 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {analysisResult.riskScore}/100
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Threat Level</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getThreatLevelColor(analysisResult.threatLevel.level)}`}>
                            {analysisResult.threatLevel.level}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Decision</span>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            analysisResult.decision === 'PERMIT' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {analysisResult.decision === 'PERMIT' ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            {analysisResult.decision}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Confidence</span>
                          <span className="text-sm text-gray-900">
                            {Math.round(analysisResult.confidence * 100)}%
                          </span>
                        </div>
                      </div>

                      <div>
                        {analysisResult.threatLevel.indicators.length > 0 && (
                          <div className="mb-3">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">Threat Indicators:</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {analysisResult.threatLevel.indicators.map((indicator: string, idx: number) => (
                                <li key={idx} className="flex items-start">
                                  <AlertTriangle className="h-3 w-3 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                                  {indicator}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {analysisResult.threatLevel.recommendations.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-gray-700 mb-2">AI Recommendations:</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              {analysisResult.threatLevel.recommendations.map((rec: string, idx: number) => (
                                <li key={idx} className="flex items-start">
                                  <Shield className="h-3 w-3 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
                                  {rec}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
