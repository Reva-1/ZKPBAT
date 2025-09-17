'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  Activity, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Database,
  Link as LinkIcon,
  Zap,
  BarChart3,
  FileSearch,
  Lock
} from 'lucide-react'

interface BlockchainStats {
  transactions: {
    total: number;
    access_decisions: number;
    policy_changes: number;
    compliance_events: number;
  };
  performance: {
    avg_confirmation_time: string;
    cross_chain_verification_success: string;
    last_sync: string;
  };
  networks: {
    hyperledger_fabric: {
      status: string;
      avg_confirmation: string;
      total_blocks: number;
    };
    ethereum: {
      status: string;
      avg_confirmation: string;
      gas_price: string;
    };
    cactus_connector: {
      status: string;
      cross_chain_txns: number;
      verification_time: string;
    };
  };
  compliance: {
    sox_proofs: number;
    gdpr_proofs: number;
    hipaa_proofs: number;
    custom_proofs: number;
  };
}

interface AccessDecision {
  userId: string;
  resourceId: string;
  action: string;
  decision: 'PERMIT' | 'DENY';
  riskScore: number;
  contextFactors: Record<string, any>;
}

interface PolicyChange {
  policyId: string;
  version: string;
  changeType: 'CREATE' | 'UPDATE' | 'DELETE';
  authorId: string;
  previousHash?: string;
  newHash: string;
}

interface ComplianceEvent {
  eventType: string;
  regulation: 'SOX' | 'GDPR' | 'HIPAA' | 'ISO27001';
  entityId: string;
  complianceStatus: boolean;
  evidenceHash: string;
}

export default function BlockchainDashboard() {
  const [stats, setStats] = useState<BlockchainStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [auditTrail, setAuditTrail] = useState<any[]>([]);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  
  // Form states
  const [accessForm, setAccessForm] = useState<AccessDecision>({
    userId: '',
    resourceId: '',
    action: '',
    decision: 'PERMIT',
    riskScore: 0,
    contextFactors: {}
  });
  
  const [policyForm, setPolicyForm] = useState<PolicyChange>({
    policyId: '',
    version: '',
    changeType: 'CREATE',
    authorId: '',
    newHash: ''
  });
  
  const [complianceForm, setComplianceForm] = useState<ComplianceEvent>({
    eventType: '',
    regulation: 'SOX',
    entityId: '',
    complianceStatus: true,
    evidenceHash: ''
  });

  const [verifyTxId, setVerifyTxId] = useState('');

  useEffect(() => {
    fetchBlockchainStats();
  }, []);

  const fetchBlockchainStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/blockchain/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.blockchain_stats);
      }
    } catch (error) {
      console.error('Failed to fetch blockchain stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordAccessDecision = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/blockchain/record/access', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...accessForm,
          timestamp: Date.now(),
          contextFactors: {
            ipAddress: '192.168.1.100',
            userAgent: navigator.userAgent,
            location: 'US-East'
          }
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Access decision recorded successfully!\nFabric TX: ${result.fabricTxId}\nEthereum TX: ${result.ethTxId}`);
        setAccessForm({ userId: '', resourceId: '', action: '', decision: 'PERMIT', riskScore: 0, contextFactors: {} });
        fetchBlockchainStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Failed to record access decision:', error);
      alert('Failed to record access decision');
    }
  };

  const recordPolicyChange = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/blockchain/record/policy', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...policyForm,
          timestamp: Date.now()
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Policy change recorded successfully!\nTransaction ID: ${result.transactionId}`);
        setPolicyForm({ policyId: '', version: '', changeType: 'CREATE', authorId: '', newHash: '' });
        fetchBlockchainStats();
      }
    } catch (error) {
      console.error('Failed to record policy change:', error);
      alert('Failed to record policy change');
    }
  };

  const recordComplianceEvent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/blockchain/record/compliance', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...complianceForm,
          timestamp: Date.now()
        })
      });
      
      if (response.ok) {
        const result = await response.json();
        alert(`Compliance event recorded successfully!\nTransaction ID: ${result.transactionId}`);
        setComplianceForm({ eventType: '', regulation: 'SOX', entityId: '', complianceStatus: true, evidenceHash: '' });
        fetchBlockchainStats();
      }
    } catch (error) {
      console.error('Failed to record compliance event:', error);
      alert('Failed to record compliance event');
    }
  };

  const generateAuditTrail = async () => {
    try {
      const token = localStorage.getItem('token');
      const endTime = Date.now();
      const startTime = endTime - (7 * 24 * 60 * 60 * 1000); // Last 7 days
      
      const response = await fetch(`/api/blockchain/audit-trail?startTime=${startTime}&endTime=${endTime}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuditTrail(data.entries);
      }
    } catch (error) {
      console.error('Failed to generate audit trail:', error);
      alert('Failed to generate audit trail');
    }
  };

  const verifyTransaction = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/blockchain/verify/${verifyTxId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setVerificationResult(result);
      }
    } catch (error) {
      console.error('Failed to verify transaction:', error);
      alert('Failed to verify transaction');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
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
              <LinkIcon className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">
                Blockchain Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Cross-Chain Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'record', name: 'Record Transactions', icon: Database },
              { id: 'audit', name: 'Audit Trail', icon: FileSearch },
              { id: 'verify', name: 'Verify', icon: CheckCircle }
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
        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Transactions
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.transactions.total.toLocaleString()}
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
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Avg Confirmation
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.performance.avg_confirmation_time}
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
                      <CheckCircle className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Verification Success
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {stats.performance.cross_chain_verification_success}
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
                      <Lock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Compliance Proofs
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {Object.values(stats.compliance).reduce((a, b) => a + b, 0)}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Status */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Network Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Hyperledger Fabric</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {stats.networks.hyperledger_fabric.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Avg Confirmation: {stats.networks.hyperledger_fabric.avg_confirmation}</p>
                      <p>Total Blocks: {stats.networks.hyperledger_fabric.total_blocks.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Ethereum</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {stats.networks.ethereum.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Avg Confirmation: {stats.networks.ethereum.avg_confirmation}</p>
                      <p>Gas Price: {stats.networks.ethereum.gas_price}</p>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Cactus Connector</h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {stats.networks.cactus_connector.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Cross-Chain TXNs: {stats.networks.cactus_connector.cross_chain_txns.toLocaleString()}</p>
                      <p>Verification Time: {stats.networks.cactus_connector.verification_time}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Record Transactions Tab */}
        {activeTab === 'record' && (
          <div className="space-y-8">
            {/* Access Decision Form */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Record Access Decision
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID
                    </label>
                    <input
                      type="text"
                      value={accessForm.userId}
                      onChange={(e) => setAccessForm({...accessForm, userId: e.target.value})}
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
                      value={accessForm.resourceId}
                      onChange={(e) => setAccessForm({...accessForm, resourceId: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="resource456"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action
                    </label>
                    <input
                      type="text"
                      value={accessForm.action}
                      onChange={(e) => setAccessForm({...accessForm, action: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="READ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Decision
                    </label>
                    <select
                      value={accessForm.decision}
                      onChange={(e) => setAccessForm({...accessForm, decision: e.target.value as 'PERMIT' | 'DENY'})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="PERMIT">PERMIT</option>
                      <option value="DENY">DENY</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Risk Score (0-100)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={accessForm.riskScore}
                      onChange={(e) => setAccessForm({...accessForm, riskScore: parseInt(e.target.value) || 0})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={recordAccessDecision}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Record Access Decision
                  </button>
                </div>
              </div>
            </div>

            {/* Policy Change Form */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Record Policy Change
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Policy ID
                    </label>
                    <input
                      type="text"
                      value={policyForm.policyId}
                      onChange={(e) => setPolicyForm({...policyForm, policyId: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="POL001"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Version
                    </label>
                    <input
                      type="text"
                      value={policyForm.version}
                      onChange={(e) => setPolicyForm({...policyForm, version: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="1.0.0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Change Type
                    </label>
                    <select
                      value={policyForm.changeType}
                      onChange={(e) => setPolicyForm({...policyForm, changeType: e.target.value as 'CREATE' | 'UPDATE' | 'DELETE'})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="CREATE">CREATE</option>
                      <option value="UPDATE">UPDATE</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Author ID
                    </label>
                    <input
                      type="text"
                      value={policyForm.authorId}
                      onChange={(e) => setPolicyForm({...policyForm, authorId: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="admin123"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      New Hash
                    </label>
                    <input
                      type="text"
                      value={policyForm.newHash}
                      onChange={(e) => setPolicyForm({...policyForm, newHash: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0x1234567890abcdef..."
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={recordPolicyChange}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Record Policy Change
                  </button>
                </div>
              </div>
            </div>

            {/* Compliance Event Form */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Record Compliance Event
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Type
                    </label>
                    <input
                      type="text"
                      value={complianceForm.eventType}
                      onChange={(e) => setComplianceForm({...complianceForm, eventType: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="financial_access_audit"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Regulation
                    </label>
                    <select
                      value={complianceForm.regulation}
                      onChange={(e) => setComplianceForm({...complianceForm, regulation: e.target.value as 'SOX' | 'GDPR' | 'HIPAA' | 'ISO27001'})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="SOX">SOX</option>
                      <option value="GDPR">GDPR</option>
                      <option value="HIPAA">HIPAA</option>
                      <option value="ISO27001">ISO 27001</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entity ID
                    </label>
                    <input
                      type="text"
                      value={complianceForm.entityId}
                      onChange={(e) => setComplianceForm({...complianceForm, entityId: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="entity789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Compliance Status
                    </label>
                    <select
                      value={complianceForm.complianceStatus.toString()}
                      onChange={(e) => setComplianceForm({...complianceForm, complianceStatus: e.target.value === 'true'})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="true">Compliant</option>
                      <option value="false">Non-Compliant</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Evidence Hash
                    </label>
                    <input
                      type="text"
                      value={complianceForm.evidenceHash}
                      onChange={(e) => setComplianceForm({...complianceForm, evidenceHash: e.target.value})}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0xabcdef1234567890..."
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={recordComplianceEvent}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Record Compliance Event
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audit Trail Tab */}
        {activeTab === 'audit' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Blockchain Audit Trail
                </h3>
                <button
                  onClick={generateAuditTrail}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <FileSearch className="h-4 w-4 mr-2" />
                  Generate Audit Trail (Last 7 Days)
                </button>
              </div>
              
              {auditTrail.length > 0 && (
                <div className="mt-4">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Transaction ID
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Hash
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Verified
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {auditTrail.map((entry, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                              {entry.txId}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                entry.type === 'ACCESS' ? 'bg-blue-100 text-blue-800' :
                                entry.type === 'POLICY' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {entry.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(entry.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                              {entry.hash.substring(0, 16)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {entry.verified ? (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verify Tab */}
        {activeTab === 'verify' && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                Verify Transaction Integrity
              </h3>
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    value={verifyTxId}
                    onChange={(e) => setVerifyTxId(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Enter transaction ID"
                  />
                  <button
                    onClick={verifyTransaction}
                    className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {verificationResult && (
                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Verification Result</h4>
                  <dl className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Transaction ID</dt>
                      <dd className="mt-1 text-sm text-gray-900 font-mono">{verificationResult.transaction_id}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Verified</dt>
                      <dd className="mt-1">
                        {verificationResult.verified ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Failed
                          </span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Integrity Check</dt>
                      <dd className="mt-1 text-sm text-gray-900">{verificationResult.integrity_check}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Cross-Chain Confirmed</dt>
                      <dd className="mt-1 text-sm text-gray-900">
                        {verificationResult.cross_chain_confirmed ? 'Yes' : 'No'}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Block Confirmations</dt>
                      <dd className="mt-1 text-sm text-gray-900">{verificationResult.block_confirmations}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium text-gray-500">Verification Time</dt>
                      <dd className="mt-1 text-sm text-gray-900">{new Date(verificationResult.verification_time).toLocaleString()}</dd>
                    </div>
                  </dl>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
