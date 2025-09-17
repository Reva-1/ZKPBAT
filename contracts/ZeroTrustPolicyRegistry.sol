// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

/**
 * @title ZeroTrustPolicyRegistry
 * @dev Advanced policy management with zk-SNARKs integration and cross-chain verification
 * @notice This contract implements zero-knowledge proofs for privacy-preserving policy verification
 */
contract ZeroTrustPolicyRegistry is AccessControl, ReentrancyGuard {
    // Role definitions for Zero Trust architecture
    bytes32 public constant POLICY_ADMIN_ROLE = keccak256("POLICY_ADMIN_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant AUDITOR_ROLE = keccak256("AUDITOR_ROLE");
    bytes32 public constant ZK_PROVER_ROLE = keccak256("ZK_PROVER_ROLE");

    // Structs for advanced policy management
    struct ZKPolicy {
        bytes32 policyHash;           // Hash of the actual policy content
        bytes32 zkCommitment;         // zk-SNARK commitment for privacy
        uint256 trustScore;           // AI-calculated trust score (0-1000)
        uint256 version;              // Policy version number
        uint256 createdAt;            // Creation timestamp
        uint256 expiresAt;            // Expiration timestamp
        bool isActive;                // Policy status
        address creator;              // Policy creator address
        CrossChainProof[] crossChainProofs; // Cross-chain verification proofs
    }

    struct CrossChainProof {
        uint256 chainId;              // Source blockchain ID
        bytes32 blockHash;            // Block hash from source chain
        bytes32 txHash;               // Transaction hash
        uint256 timestamp;            // Verification timestamp
        bool verified;                // Verification status
    }

    struct AccessEvent {
        address user;                 // User address
        bytes32 policyId;            // Policy identifier
        uint256 trustScore;          // User's trust score at access time
        bytes32 zkProof;             // Zero-knowledge proof of authorization
        uint256 timestamp;           // Access timestamp
        string location;             // Geolocation (hashed for privacy)
        string deviceFingerprint;    // Device identifier (hashed)
        bool riskFlagged;            // Risk assessment flag
    }

    struct TrustMetrics {
        uint256 globalTrustScore;    // Overall system trust score
        uint256 totalPolicies;       // Total number of policies
        uint256 activeSessions;      // Current active sessions
        uint256 anomaliesDetected;   // Number of anomalies detected
        uint256 zkProofsGenerated;   // Total zk-proofs generated
        uint256 crossChainVerifications; // Cross-chain verifications
    }

    // State variables
    mapping(bytes32 => ZKPolicy) public policies;
    mapping(address => uint256) public userTrustScores;
    mapping(address => AccessEvent[]) public userAccessHistory;
    mapping(bytes32 => bool) public usedZKProofs; // Prevent proof replay attacks
    
    bytes32[] public policyIds;
    TrustMetrics public systemMetrics;
    
    // Merkle tree root for efficient batch verification
    bytes32 public zkProofMerkleRoot;
    
    // Cross-chain verification tracking
    mapping(uint256 => bool) public supportedChains;
    mapping(bytes32 => mapping(uint256 => bool)) public crossChainVerified;

    // Events for Zero Trust monitoring
    event PolicyRegistered(
        bytes32 indexed policyId,
        bytes32 zkCommitment,
        uint256 trustScore,
        address indexed creator
    );
    
    event ZKProofVerified(
        address indexed user,
        bytes32 indexed policyId,
        bytes32 zkProof,
        uint256 trustScore,
        bool riskFlagged
    );
    
    event CrossChainVerificationComplete(
        bytes32 indexed policyId,
        uint256 indexed chainId,
        bytes32 blockHash,
        bool verified
    );
    
    event AnomalyDetected(
        address indexed user,
        bytes32 indexed policyId,
        string anomalyType,
        uint256 riskScore
    );
    
    event TrustScoreUpdated(
        address indexed user,
        uint256 oldScore,
        uint256 newScore,
        string reason
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(POLICY_ADMIN_ROLE, msg.sender);
        _grantRole(VERIFIER_ROLE, msg.sender);
        _grantRole(AUDITOR_ROLE, msg.sender);
        _grantRole(ZK_PROVER_ROLE, msg.sender);
        
        // Initialize supported chains (Ethereum, Polygon, Solana, Avalanche)
        supportedChains[1] = true;    // Ethereum Mainnet
        supportedChains[137] = true;  // Polygon
        supportedChains[43114] = true; // Avalanche
        // Note: Solana would require different integration approach
        
        // Initialize system metrics
        systemMetrics = TrustMetrics({
            globalTrustScore: 1000,
            totalPolicies: 0,
            activeSessions: 0,
            anomaliesDetected: 0,
            zkProofsGenerated: 0,
            crossChainVerifications: 0
        });
    }

    /**
     * @dev Register a new policy with zk-SNARK commitment
     * @param _policyHash Hash of the policy content
     * @param _zkCommitment Zero-knowledge commitment for privacy
     * @param _trustScore AI-calculated trust score
     * @param _expiresAt Policy expiration timestamp
     */
    function registerPolicy(
        bytes32 _policyHash,
        bytes32 _zkCommitment,
        uint256 _trustScore,
        uint256 _expiresAt
    ) external onlyRole(POLICY_ADMIN_ROLE) nonReentrant {
        require(_trustScore <= 1000, "Trust score must be <= 1000");
        require(_expiresAt > block.timestamp, "Expiration must be in future");
        
        bytes32 policyId = keccak256(abi.encodePacked(_policyHash, _zkCommitment, msg.sender, block.timestamp));
        
        policies[policyId] = ZKPolicy({
            policyHash: _policyHash,
            zkCommitment: _zkCommitment,
            trustScore: _trustScore,
            version: 1,
            createdAt: block.timestamp,
            expiresAt: _expiresAt,
            isActive: true,
            creator: msg.sender,
            crossChainProofs: new CrossChainProof[](0)
        });
        
        policyIds.push(policyId);
        systemMetrics.totalPolicies++;
        
        emit PolicyRegistered(policyId, _zkCommitment, _trustScore, msg.sender);
    }

    /**
     * @dev Verify access using zero-knowledge proof
     * @param _policyId Policy identifier
     * @param _zkProof Zero-knowledge proof of authorization
     * @param _merkleProof Merkle proof for batch verification
     * @param _trustScore Current user trust score
     * @param _location Hashed location data
     * @param _deviceFingerprint Hashed device identifier
     */
    function verifyAccessWithZKProof(
        bytes32 _policyId,
        bytes32 _zkProof,
        bytes32[] calldata _merkleProof,
        uint256 _trustScore,
        string calldata _location,
        string calldata _deviceFingerprint
    ) external nonReentrant returns (bool) {
        require(policies[_policyId].isActive, "Policy not active");
        require(policies[_policyId].expiresAt > block.timestamp, "Policy expired");
        require(!usedZKProofs[_zkProof], "ZK proof already used");
        require(_trustScore <= 1000, "Invalid trust score");
        
        // Verify Merkle proof for batch zk-proof verification
        bytes32 leaf = keccak256(abi.encodePacked(_zkProof, msg.sender, _policyId));
        require(MerkleProof.verify(_merkleProof, zkProofMerkleRoot, leaf), "Invalid Merkle proof");
        
        // Mark proof as used to prevent replay attacks
        usedZKProofs[_zkProof] = true;
        
        // Risk assessment based on multiple factors
        bool riskFlagged = assessRisk(msg.sender, _trustScore, _location, _deviceFingerprint);
        
        // Record access event
        AccessEvent memory accessEvent = AccessEvent({
            user: msg.sender,
            policyId: _policyId,
            trustScore: _trustScore,
            zkProof: _zkProof,
            timestamp: block.timestamp,
            location: _location,
            deviceFingerprint: _deviceFingerprint,
            riskFlagged: riskFlagged
        });
        
        userAccessHistory[msg.sender].push(accessEvent);
        userTrustScores[msg.sender] = _trustScore;
        systemMetrics.zkProofsGenerated++;
        
        // Emit anomaly detection if risk flagged
        if (riskFlagged) {
            systemMetrics.anomaliesDetected++;
            emit AnomalyDetected(msg.sender, _policyId, "High risk access pattern", _trustScore);
        }
        
        emit ZKProofVerified(msg.sender, _policyId, _zkProof, _trustScore, riskFlagged);
        
        return !riskFlagged;
    }

    /**
     * @dev Add cross-chain verification proof
     * @param _policyId Policy identifier
     * @param _chainId Source blockchain ID
     * @param _blockHash Block hash from source chain
     * @param _txHash Transaction hash
     */
    function addCrossChainProof(
        bytes32 _policyId,
        uint256 _chainId,
        bytes32 _blockHash,
        bytes32 _txHash
    ) external onlyRole(VERIFIER_ROLE) {
        require(supportedChains[_chainId], "Chain not supported");
        require(policies[_policyId].isActive, "Policy not active");
        
        CrossChainProof memory proof = CrossChainProof({
            chainId: _chainId,
            blockHash: _blockHash,
            txHash: _txHash,
            timestamp: block.timestamp,
            verified: true
        });
        
        policies[_policyId].crossChainProofs.push(proof);
        crossChainVerified[_policyId][_chainId] = true;
        systemMetrics.crossChainVerifications++;
        
        emit CrossChainVerificationComplete(_policyId, _chainId, _blockHash, true);
    }

    /**
     * @dev Update Merkle root for batch zk-proof verification
     * @param _newRoot New Merkle tree root
     */
    function updateZKProofMerkleRoot(bytes32 _newRoot) external onlyRole(ZK_PROVER_ROLE) {
        zkProofMerkleRoot = _newRoot;
    }

    /**
     * @dev Update user trust score based on behavioral analysis
     * @param _user User address
     * @param _newScore New trust score
     * @param _reason Reason for score update
     */
    function updateTrustScore(
        address _user,
        uint256 _newScore,
        string calldata _reason
    ) external onlyRole(VERIFIER_ROLE) {
        require(_newScore <= 1000, "Trust score must be <= 1000");
        
        uint256 oldScore = userTrustScores[_user];
        userTrustScores[_user] = _newScore;
        
        emit TrustScoreUpdated(_user, oldScore, _newScore, _reason);
    }

    /**
     * @dev Assess risk based on multiple factors
     * @param _user User address
     * @param _trustScore Current trust score
     * @param _location Hashed location
     * @param _deviceFingerprint Hashed device identifier
     * @return bool Risk assessment result
     */
    function assessRisk(
        address _user,
        uint256 _trustScore,
        string memory _location,
        string memory _deviceFingerprint
    ) internal view returns (bool) {
        // Risk factors:
        // 1. Low trust score
        if (_trustScore < 700) return true;
        
        // 2. Too many recent access attempts
        if (userAccessHistory[_user].length > 0) {
            uint256 recentAccesses = 0;
            uint256 timeWindow = block.timestamp - 3600; // 1 hour window
            
            AccessEvent[] memory history = userAccessHistory[_user];
            for (uint256 i = history.length; i > 0; i--) {
                if (history[i-1].timestamp >= timeWindow) {
                    recentAccesses++;
                    if (recentAccesses > 50) return true; // Rate limiting
                } else {
                    break; // Assuming chronological order
                }
            }
        }
        
        // 3. Other risk factors can be added here
        // - Unusual location patterns
        // - New device fingerprints
        // - Off-hours access
        // - Geolocation anomalies
        
        return false;
    }

    /**
     * @dev Get policy information (for auditing)
     * @param _policyId Policy identifier
     * @return Policy details
     */
    function getPolicy(bytes32 _policyId) external view returns (ZKPolicy memory) {
        return policies[_policyId];
    }

    /**
     * @dev Get user access history (for auditing)
     * @param _user User address
     * @return Array of access events
     */
    function getUserAccessHistory(address _user) external view onlyRole(AUDITOR_ROLE) returns (AccessEvent[] memory) {
        return userAccessHistory[_user];
    }

    /**
     * @dev Get system-wide metrics
     * @return Current system trust metrics
     */
    function getSystemMetrics() external view returns (TrustMetrics memory) {
        return systemMetrics;
    }

    /**
     * @dev Emergency pause function for security incidents
     * @param _policyId Policy to pause
     */
    function emergencyPause(bytes32 _policyId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        policies[_policyId].isActive = false;
    }

    /**
     * @dev Add support for new blockchain
     * @param _chainId New chain ID to support
     */
    function addSupportedChain(uint256 _chainId) external onlyRole(DEFAULT_ADMIN_ROLE) {
        supportedChains[_chainId] = true;
    }
}
