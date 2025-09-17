import { ethers } from 'ethers'
import axios from 'axios'

/**
 * Cross-Chain Verification Service
 * Handles verification of policy events across multiple blockchain networks
 */

export interface ChainConfig {
  chainId: number
  name: string
  rpcUrl: string
  contractAddress: string
  explorerUrl: string
  blockTime: number // Average block time in seconds
}

export interface CrossChainEvent {
  chainId: number
  blockNumber: number
  blockHash: string
  transactionHash: string
  timestamp: number
  eventData: any
  verified: boolean
}

export interface VerificationResult {
  isValid: boolean
  confidence: number // 0-100%
  verifiedChains: number[]
  conflictingChains: number[]
  consensusReached: boolean
}

export class CrossChainVerifier {
  private chains: Map<number, ChainConfig>
  private providers: Map<number, ethers.providers.JsonRpcProvider>
  private contracts: Map<number, ethers.Contract>
  private contractABI: any[]

  constructor(contractABI: any[]) {
    this.chains = new Map()
    this.providers = new Map()
    this.contracts = new Map()
    this.contractABI = contractABI
    
    this.initializeChains()
  }

  /**
   * Initialize supported blockchain networks
   */
  private initializeChains(): void {
    const supportedChains: ChainConfig[] = [
      {
        chainId: 1,
        name: 'Ethereum Mainnet',
        rpcUrl: process.env.ETHEREUM_RPC_URL || 'https://mainnet.infura.io/v3/YOUR_KEY',
        contractAddress: process.env.ETHEREUM_CONTRACT_ADDRESS || '',
        explorerUrl: 'https://etherscan.io',
        blockTime: 12
      },
      {
        chainId: 137,
        name: 'Polygon',
        rpcUrl: process.env.POLYGON_RPC_URL || 'https://polygon-mainnet.infura.io/v3/YOUR_KEY',
        contractAddress: process.env.POLYGON_CONTRACT_ADDRESS || '',
        explorerUrl: 'https://polygonscan.com',
        blockTime: 2
      },
      {
        chainId: 43114,
        name: 'Avalanche',
        rpcUrl: process.env.AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc',
        contractAddress: process.env.AVALANCHE_CONTRACT_ADDRESS || '',
        explorerUrl: 'https://snowtrace.io',
        blockTime: 3
      },
      {
        chainId: 250,
        name: 'Fantom',
        rpcUrl: process.env.FANTOM_RPC_URL || 'https://rpc.ftm.tools',
        contractAddress: process.env.FANTOM_CONTRACT_ADDRESS || '',
        explorerUrl: 'https://ftmscan.com',
        blockTime: 1
      },
      {
        chainId: 56,
        name: 'BSC',
        rpcUrl: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
        contractAddress: process.env.BSC_CONTRACT_ADDRESS || '',
        explorerUrl: 'https://bscscan.com',
        blockTime: 3
      }
    ]

    for (const chain of supportedChains) {
      this.chains.set(chain.chainId, chain)
      
      // Initialize provider
      const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl)
      this.providers.set(chain.chainId, provider)
      
      // Initialize contract if address is provided
      if (chain.contractAddress) {
        const contract = new ethers.Contract(
          chain.contractAddress,
          this.contractABI,
          provider
        )
        this.contracts.set(chain.chainId, contract)
      }
    }
  }

  /**
   * Verify a policy event across multiple chains
   * @param policyHash Hash of the policy to verify
   * @param expectedEvent Expected event data
   * @returns Promise<VerificationResult>
   */
  async verifyPolicyEvent(
    policyHash: string,
    expectedEvent: any
  ): Promise<VerificationResult> {
    const verificationPromises = Array.from(this.chains.keys()).map(chainId =>
      this.verifyOnChain(chainId, policyHash, expectedEvent)
    )

    const results = await Promise.allSettled(verificationPromises)
    
    const verifiedChains: number[] = []
    const conflictingChains: number[] = []
    let totalConfidence = 0
    let validResults = 0

    results.forEach((result, index) => {
      const chainId = Array.from(this.chains.keys())[index]
      
      if (result.status === 'fulfilled' && result.value.verified) {
        verifiedChains.push(chainId)
        totalConfidence += result.value.confidence || 100
        validResults++
      } else {
        conflictingChains.push(chainId)
      }
    })

    const averageConfidence = validResults > 0 ? totalConfidence / validResults : 0
    const consensusReached = verifiedChains.length >= Math.ceil(this.chains.size / 2)

    return {
      isValid: consensusReached,
      confidence: averageConfidence,
      verifiedChains,
      conflictingChains,
      consensusReached
    }
  }

  /**
   * Verify event on a specific blockchain
   * @param chainId Target blockchain ID
   * @param policyHash Policy hash to verify
   * @param expectedEvent Expected event data
   * @returns Promise<CrossChainEvent>
   */
  private async verifyOnChain(
    chainId: number,
    policyHash: string,
    expectedEvent: any
  ): Promise<CrossChainEvent> {
    const provider = this.providers.get(chainId)
    const contract = this.contracts.get(chainId)
    
    if (!provider || !contract) {
      throw new Error(`Chain ${chainId} not supported or not configured`)
    }

    try {
      // Query events from the contract
      const filter = contract.filters.PolicyRegistered(policyHash)
      const events = await contract.queryFilter(filter, -1000) // Last 1000 blocks
      
      if (events.length === 0) {
        return {
          chainId,
          blockNumber: 0,
          blockHash: '',
          transactionHash: '',
          timestamp: 0,
          eventData: null,
          verified: false
        }
      }

      // Get the most recent event
      const latestEvent = events[events.length - 1]
      const block = await provider.getBlock(latestEvent.blockNumber)
      
      // Verify event data matches expected
      const verified = this.compareEventData(latestEvent.args, expectedEvent)
      
      return {
        chainId,
        blockNumber: latestEvent.blockNumber,
        blockHash: latestEvent.blockHash,
        transactionHash: latestEvent.transactionHash,
        timestamp: block.timestamp,
        eventData: latestEvent.args,
        verified
      }
    } catch (error) {
      console.error(`Error verifying on chain ${chainId}:`, error)
      return {
        chainId,
        blockNumber: 0,
        blockHash: '',
        transactionHash: '',
        timestamp: 0,
        eventData: null,
        verified: false
      }
    }
  }

  /**
   * Submit policy event to multiple chains
   * @param policyData Policy data to submit
   * @param privateKey Private key for signing transactions
   * @returns Promise<CrossChainEvent[]>
   */
  async submitToMultipleChains(
    policyData: any,
    privateKey: string
  ): Promise<CrossChainEvent[]> {
    const submissionPromises = Array.from(this.chains.keys()).map(chainId =>
      this.submitToChain(chainId, policyData, privateKey)
    )

    const results = await Promise.allSettled(submissionPromises)
    
    return results
      .filter(result => result.status === 'fulfilled')
      .map(result => (result as PromiseFulfilledResult<CrossChainEvent>).value)
  }

  /**
   * Submit policy event to a specific chain
   * @param chainId Target blockchain ID
   * @param policyData Policy data to submit
   * @param privateKey Private key for signing
   * @returns Promise<CrossChainEvent>
   */
  private async submitToChain(
    chainId: number,
    policyData: any,
    privateKey: string
  ): Promise<CrossChainEvent> {
    const provider = this.providers.get(chainId)
    const contract = this.contracts.get(chainId)
    
    if (!provider || !contract) {
      throw new Error(`Chain ${chainId} not supported`)
    }

    const wallet = new ethers.Wallet(privateKey, provider)
    const contractWithSigner = contract.connect(wallet)

    try {
      const tx = await contractWithSigner.registerPolicy(
        policyData.policyHash,
        policyData.zkCommitment,
        policyData.trustScore,
        policyData.expiresAt,
        {
          gasLimit: 500000, // Adjust based on chain
          gasPrice: await this.getOptimalGasPrice(chainId)
        }
      )

      const receipt = await tx.wait()
      const block = await provider.getBlock(receipt.blockNumber)

      return {
        chainId,
        blockNumber: receipt.blockNumber,
        blockHash: receipt.blockHash,
        transactionHash: receipt.transactionHash,
        timestamp: block.timestamp,
        eventData: policyData,
        verified: true
      }
    } catch (error) {
      console.error(`Error submitting to chain ${chainId}:`, error)
      throw error
    }
  }

  /**
   * Get optimal gas price for a specific chain
   * @param chainId Target blockchain ID
   * @returns Promise<ethers.BigNumber>
   */
  private async getOptimalGasPrice(chainId: number): Promise<ethers.BigNumber> {
    const provider = this.providers.get(chainId)
    if (!provider) throw new Error(`Provider not found for chain ${chainId}`)

    try {
      // Get current gas price
      const gasPrice = await provider.getGasPrice()
      
      // Apply chain-specific optimizations
      switch (chainId) {
        case 1: // Ethereum - use higher gas for faster confirmation
          return gasPrice.mul(110).div(100) // 10% above current
        case 137: // Polygon - usually low gas, can use standard
          return gasPrice.mul(105).div(100) // 5% above current
        case 43114: // Avalanche - dynamic gas
          return gasPrice.mul(105).div(100)
        default:
          return gasPrice
      }
    } catch (error) {
      console.error(`Error getting gas price for chain ${chainId}:`, error)
      return ethers.utils.parseUnits('20', 'gwei') // Fallback
    }
  }

  /**
   * Monitor cross-chain consensus in real-time
   * @param policyHash Policy hash to monitor
   * @param callback Callback function for updates
   */
  async monitorCrossChainConsensus(
    policyHash: string,
    callback: (consensus: VerificationResult) => void
  ): void {
    const interval = setInterval(async () => {
      try {
        const result = await this.verifyPolicyEvent(policyHash, {})
        callback(result)
        
        // Stop monitoring if consensus is reached
        if (result.consensusReached && result.confidence > 95) {
          clearInterval(interval)
        }
      } catch (error) {
        console.error('Error monitoring consensus:', error)
      }
    }, 30000) // Check every 30 seconds
  }

  /**
   * Get network status for all supported chains
   * @returns Promise<Map<number, any>>
   */
  async getNetworkStatus(): Promise<Map<number, any>> {
    const statusMap = new Map()
    
    const statusPromises = Array.from(this.chains.entries()).map(async ([chainId, config]) => {
      const provider = this.providers.get(chainId)
      if (!provider) return [chainId, { status: 'disconnected' }]

      try {
        const [blockNumber, gasPrice, network] = await Promise.all([
          provider.getBlockNumber(),
          provider.getGasPrice(),
          provider.getNetwork()
        ])

        return [chainId, {
          status: 'connected',
          blockNumber,
          gasPrice: ethers.utils.formatUnits(gasPrice, 'gwei'),
          network: network.name,
          chainName: config.name
        }]
      } catch (error) {
        return [chainId, { 
          status: 'error', 
          error: error.message,
          chainName: config.name 
        }]
      }
    })

    const results = await Promise.all(statusPromises)
    results.forEach(([chainId, status]) => {
      statusMap.set(chainId, status)
    })

    return statusMap
  }

  /**
   * Compare event data for verification
   * @param actualData Actual event data from blockchain
   * @param expectedData Expected event data
   * @returns boolean
   */
  private compareEventData(actualData: any, expectedData: any): boolean {
    // Simplified comparison - in production, implement comprehensive validation
    if (!actualData || !expectedData) return false
    
    // Compare key fields
    const keyFields = ['policyHash', 'zkCommitment', 'trustScore']
    
    for (const field of keyFields) {
      if (actualData[field] !== expectedData[field]) {
        return false
      }
    }
    
    return true
  }

  /**
   * Calculate cross-chain confidence score
   * @param verificationResults Results from multiple chains
   * @returns number Confidence score (0-100)
   */
  calculateConfidenceScore(verificationResults: CrossChainEvent[]): number {
    const totalChains = this.chains.size
    const verifiedChains = verificationResults.filter(r => r.verified).length
    
    if (verifiedChains === 0) return 0
    
    // Base confidence from chain consensus
    const consensusConfidence = (verifiedChains / totalChains) * 100
    
    // Bonus for high-security chains (Ethereum gets higher weight)
    let weightedConfidence = 0
    let totalWeight = 0
    
    verificationResults.forEach(result => {
      if (result.verified) {
        const weight = this.getChainWeight(result.chainId)
        weightedConfidence += weight * 100
        totalWeight += weight
      }
    })
    
    const finalConfidence = totalWeight > 0 ? weightedConfidence / totalWeight : 0
    
    return Math.min(finalConfidence, 100)
  }

  /**
   * Get weight for chain importance in consensus
   * @param chainId Blockchain ID
   * @returns number Weight factor
   */
  private getChainWeight(chainId: number): number {
    switch (chainId) {
      case 1: return 1.0  // Ethereum - highest security
      case 137: return 0.8 // Polygon - good security
      case 43114: return 0.7 // Avalanche - good security
      case 56: return 0.6  // BSC - moderate security
      case 250: return 0.5 // Fantom - moderate security
      default: return 0.5
    }
  }
}
