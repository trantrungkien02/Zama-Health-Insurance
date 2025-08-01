'use client';

import React, { useState } from 'react';
import { PrivacyShield } from '../ui/PrivacyShield';
import { HealthDataArrow } from '../ui/HealthDataArrow';
import { mockFHEVMJS, mockHealthContract } from './mockServices';
import Image from 'next/image';
import { 
  HealthData, 
  EncryptedData, 
  ContractResult, 
  FinalResult, 
  HealthMetricType 
} from './types';

const HealthInsuranceApp: React.FC = () => {
  const [healthData, setHealthData] = useState<HealthData>({
    age: '',
    bloodPressure: '',
    bloodSugar: ''
  });
  
  const [encryptedData, setEncryptedData] = useState<EncryptedData>({});
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [contractResult, setContractResult] = useState<ContractResult | null>(null);
  const [finalResult, setFinalResult] = useState<FinalResult | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>('');

  const connectWallet = async (): Promise<void> => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnected(true);
    setIsProcessing(false);
  };

  const updateHealthData = (field: keyof HealthData, value: string): void => {
    setHealthData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getHealthStatus = (value: number, type: HealthMetricType): string => {
    switch(type) {
      case 'age':
        return value > 60 ? 'Senior' : 'Adult';
      case 'bp':
        return value > 140 ? 'High BP' : value > 120 ? 'Pre-hypertension' : 'Normal';
      case 'bs':
        return value > 180 ? 'High Blood Sugar' : value > 140 ? 'Pre-diabetes' : 'Normal';
      default:
        return 'Normal';
    }
  };

  const checkEligibility = async (): Promise<void> => {
    const { age, bloodPressure, bloodSugar } = healthData;
    
    if (!age || !bloodPressure || !bloodSugar) {
      alert('Please enter complete health information!');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(1);
    setContractResult(null);
    setFinalResult(null);
    setProcessingStage('Encrypting health data...');

    try {
      // Step 1: Encrypt health data
      await new Promise(resolve => setTimeout(resolve, 1500));
      const encAge = mockFHEVMJS.encryptAge(parseInt(age));
      const encBP = mockFHEVMJS.encryptBloodPressure(parseInt(bloodPressure));
      const encBS = mockFHEVMJS.encryptBloodSugar(parseInt(bloodSugar));
      
      setEncryptedData({
        age: encAge,
        bloodPressure: encBP,
        bloodSugar: encBS
      });
      setCurrentStep(2);
      setProcessingStage('Data encrypted securely');

      // Step 2: Send to smart contract
      await new Promise(resolve => setTimeout(resolve, 800));
      setCurrentStep(3);
      setProcessingStage('Sending to smart contract...');
      
      const result = await mockHealthContract.checkEligibility(
        encAge, encBP, encBS, 
        parseInt(age), parseInt(bloodPressure), parseInt(bloodSugar)
      );
      
      setContractResult(result);
      setCurrentStep(4);
      setProcessingStage('Decrypting result...');

      // Step 3: Decrypt result
      await new Promise(resolve => setTimeout(resolve, 1200));
      const decryptedResult = mockFHEVMJS.decrypt(result.resultCiphertext, result.isEligible);
      setFinalResult({
        eligible: decryptedResult,
        conditions: result.conditions
      });
      setCurrentStep(5);
      setProcessingStage('Complete!');

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = (): void => {
    setHealthData({ age: '', bloodPressure: '', bloodSugar: '' });
    setEncryptedData({});
    setContractResult(null);
    setFinalResult(null);
    setCurrentStep(0);
    setProcessingStage('');
  };

  // Inline styles object
  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
      color: 'white',
      fontFamily: 'Inter, sans-serif'
    },
    header: {
      background: 'rgba(0, 0, 0, 0.2)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(37, 99, 235, 0.2)'
    },
    logoContainer: {
      width: '48px',
      height: '48px',
      background: 'linear-gradient(135deg, #5adbb5, #2563eb)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    connectButton: (connected: boolean, processing: boolean) => ({
      padding: '8px 24px',
      borderRadius: '8px',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      backgroundColor: connected ? '#059669' : '#5adbb5',
      color: connected ? 'white' : 'black',
      opacity: processing ? 0.5 : 1,
      cursor: processing ? 'not-allowed' : 'pointer',
      border: 'none'
    }),
    stepIndicator: (step: number, currentStep: number) => ({
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: currentStep > step ? '#059669' : currentStep === step ? '#5adbb5' : '#6b7280',
      color: currentStep > step ? 'white' : currentStep === step ? 'black' : '#d1d5db',
      animation: currentStep === step ? 'processingPulse 2s ease-in-out infinite' : 'none'
    }),
    stepConnector: (step: number, currentStep: number) => ({
      width: '64px',
      height: '2px',
      margin: '0 8px',
      backgroundColor: currentStep > step ? '#059669' : '#6b7280'
    }),
    card: {
      width: '500px',
      background: 'rgba(0, 0, 0, 0.3)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #374151'
    },
    healthMetric: {
      background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.1), rgba(59, 130, 246, 0.1))',
      borderLeft: '4px solid #2563eb',
      padding: '16px',
      borderRadius: '8px'
    },
    healthInput: {
      width: '85%',
      padding: '12px 16px',
      background: 'rgba(37, 99, 235, 0.1)',
      border: '1px solid rgba(37, 99, 235, 0.3)',
      borderRadius: '8px',
      color: 'white',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      outline: 'none'
    },
    healthInputFocus: {
      borderColor: '#5adbb5',
      boxShadow: '0 0 0 3px rgba(90, 219, 181, 0.1)'
    },
    primaryButton: (disabled: boolean) => ({
      width: '100%',
      background: disabled ? '#6b7280' : 'linear-gradient(135deg, #5adbb5, #059669)',
      color: disabled ? '#d1d5db' : 'black',
      padding: '12px',
      borderRadius: '8px',
      fontWeight: '600',
      border: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled ? 'none' : '0 0 25px rgba(37, 99, 235, 0.3)',
      transition: 'all 0.3s ease'
    }),
    secondaryButton: {
      width: '100%',
      background: '#6b7280',
      color: 'white',
      padding: '8px',
      borderRadius: '8px',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.3s ease'
    },
    privacyShield: {
      background: 'linear-gradient(135deg, rgba(90, 219, 181, 0.1), rgba(37, 99, 235, 0.1))',
      border: '2px solid rgba(90, 219, 181, 0.3)',
      borderRadius: '8px',
      padding: '16px'
    },
    encryptedData: {
      fontFamily: 'Courier New, monospace',
      background: 'linear-gradient(45deg, #5adbb5, #2563eb)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
      wordBreak: 'break-all' as const
    },
    contractLogic: {
      background: 'rgba(0, 0, 0, 0.6)',
      border: '1px solid rgba(90, 219, 181, 0.3)',
      fontFamily: 'Courier New, monospace',
      borderRadius: '8px',
      padding: '16px'
    },
    eligibilityResult: (eligible: boolean) => ({
      padding: '24px',
      borderRadius: '8px',
      textAlign: 'center' as const,
      background: eligible 
        ? 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(16, 185, 129, 0.2))'
        : 'linear-gradient(135deg, rgba(220, 38, 38, 0.2), rgba(239, 68, 68, 0.2))',
      border: eligible 
        ? '2px solid rgba(5, 150, 105, 0.5)'
        : '2px solid rgba(220, 38, 38, 0.5)',
      animation: eligible ? 'resultGlow 2s ease-in-out infinite alternate' : 'none'
    }),
    spinner: {
      width: '20px',
      height: '20px',
      border: '2px solid rgba(0, 0, 0, 0.3)',
      borderTop: '2px solid black',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  return (
    <>
      {/* Inline CSS Styles */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        @keyframes processingPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }

        @keyframes dataFlow {
          0%, 100% { opacity: 0.5; transform: translateX(0); }
          50% { opacity: 1; transform: translateX(10px); }
        }

        @keyframes resultGlow {
          0% { box-shadow: 0 0 20px rgba(5, 150, 105, 0.3); }
          100% { box-shadow: 0 0 30px rgba(5, 150, 105, 0.6); }
        }

        @keyframes shieldPulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.1); opacity: 1; }
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .shield-icon {
          animation: shieldPulse 3s ease-in-out infinite;
        }

        .data-flow {
          animation: dataFlow 3s ease-in-out infinite;
        }

        .health-input:focus {
          border-color: #5adbb5 !important;
          box-shadow: 0 0 0 3px rgba(90, 219, 181, 0.1) !important;
        }

        .secondary-button:hover {
          background-color: #4b5563 !important;
        }

        .primary-button:hover:not(:disabled) {
          opacity: 0.8;
        }
      `}</style>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div>
                  <Image
      src="https://img.bgstatic.com/multiLang/web/e6f80e07e76abeefd291dc5274c8f355.jpg" 
      alt="Mô tả ảnh"
      width={60}               
      height={60}              
    />
                </div>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>ZAMA HEALTH INSURANCE</h1>
                  <p style={{ fontSize: '14px', color: '#d1d5db', margin: 0 }}>Secure Health Insurance System with FHEVM</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                  <PrivacyShield />
                  <span style={{ color: '#5adbb5' }}>100% Secure</span>
                </div>
                <button
                  onClick={connectWallet}
                  disabled={isConnected || isProcessing}
                  style={styles.connectButton(isConnected, isProcessing)}
                >
                  {isConnected ? '✅ Connected' : '🔗 Connect Wallet'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
            {['Input', 'Encrypt', 'Process', 'Verify', 'Result'].map((step, index) => (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div style={styles.stepIndicator(index, currentStep)}>
                  {currentStep > index ? '✓' : index + 1}
                </div>
                {index < 4 && <div style={styles.stepConnector(index, currentStep)}></div>}
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#d1d5db', fontSize: '14px', marginBottom: '32px' }}>
            {processingStage || "Enter health information to check insurance eligibility"}
          </p>

          {/* Three Column Layout */}
          <div style={{ display: 'flex' }}>
            {/* Column 1: Health Data Input */}
            <div style={{ ...styles.card, gridColumn: 'span 1' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                <span style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundColor: '#2563eb', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginRight: '12px', 
                  fontSize: '14px' 
                }}>📋</span>
                Health Information
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={styles.healthMetric}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#2563eb' }}>Age</label>
                  <input
                    type="number"
                    value={healthData.age}
                    onChange={(e) => updateHealthData('age', e.target.value)}
                    style={styles.healthInput}
                    className="health-input"
                    placeholder="Enter your age..."
                    disabled={isProcessing}
                    min="18"
                    max="100"
                  />
                  {healthData.age && (
                    <p style={{ fontSize: '12px', marginTop: '4px', color: '#9ca3af' }}>
                      Status: <span style={{ color: '#5adbb5' }}>{getHealthStatus(parseInt(healthData.age), 'age')}</span>
                    </p>
                  )}
                </div>

                <div style={styles.healthMetric}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#2563eb' }}>Systolic Blood Pressure (mmHg)</label>
                  <input
                    type="number"
                    value={healthData.bloodPressure}
                    onChange={(e) => updateHealthData('bloodPressure', e.target.value)}
                    style={styles.healthInput}
                    className="health-input"
                    placeholder="e.g. 120"
                    disabled={isProcessing}
                    min="80"
                    max="200"
                  />
                  {healthData.bloodPressure && (
                    <p style={{ fontSize: '12px', marginTop: '4px', color: '#9ca3af' }}>
                      Status: <span style={{ color: parseInt(healthData.bloodPressure) > 140 ? '#f87171' : '#34d399' }}>
                        {getHealthStatus(parseInt(healthData.bloodPressure), 'bp')}
                      </span>
                    </p>
                  )}
                </div>

                <div style={styles.healthMetric}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px', color: '#2563eb' }}>Blood Sugar (mg/dL)</label>
                  <input
                    type="number"
                    value={healthData.bloodSugar}
                    onChange={(e) => updateHealthData('bloodSugar', e.target.value)}
                    style={styles.healthInput}
                    className="health-input"
                    placeholder="e.g. 100"
                    disabled={isProcessing}
                    min="70"
                    max="300"
                  />
                  {healthData.bloodSugar && (
                    <p style={{ fontSize: '12px', marginTop: '4px', color: '#9ca3af' }}>
                      Status: <span style={{ color: parseInt(healthData.bloodSugar) > 180 ? '#f87171' : '#34d399' }}>
                        {getHealthStatus(parseInt(healthData.bloodSugar), 'bs')}
                      </span>
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <button
                    onClick={checkEligibility}
                    disabled={!isConnected || isProcessing || !healthData.age || !healthData.bloodPressure || !healthData.bloodSugar}
                    style={styles.primaryButton(!isConnected || isProcessing || !healthData.age || !healthData.bloodPressure || !healthData.bloodSugar)}
                    className="primary-button"
                  >
                    {isProcessing ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <div style={styles.spinner}></div>
                        <span>Checking...</span>
                      </div>
                    ) : (
                      '🔒 Check Insurance Eligibility'
                    )}
                  </button>

                  <button
                    onClick={resetForm}
                    style={styles.secondaryButton}
                    className="secondary-button"
                  >
                    🔄 Reset Form
                  </button>
                </div>
              </div>

              {/* Encrypted Data Display */}
              {Object.keys(encryptedData).length > 0 && (
                <div style={{ ...styles.privacyShield, marginTop: '24px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
                    <PrivacyShield style={{ marginRight: '8px' }} />
                    Encrypted Data
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: '#9ca3af' }}>Age:</span>
                      <p style={styles.encryptedData}>{encryptedData.age}</p>
                    </div>
                    <div>
                      <span style={{ color: '#9ca3af' }}>Blood Pressure:</span>
                      <p style={styles.encryptedData}>{encryptedData.bloodPressure}</p>
                    </div>
                    <div>
                      <span style={{ color: '#9ca3af' }}>Blood Sugar:</span>
                      <p style={styles.encryptedData}>{encryptedData.bloodSugar}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Arrow */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', margin: '0 10px' }}>
              <HealthDataArrow />
            </div>

            {/* Column 2: Smart Contract Processing */}
            <div style={{ ...styles.card, gridColumn: 'span 2' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                <span style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundColor: '#5adbb5', 
                  color: 'black',
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginRight: '12px', 
                  fontSize: '14px' 
                }}>⚡</span>
                FHEVM Smart Contract
              </h2>

              <div style={{ ...styles.contractLogic, marginBottom: '16px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: '#5adbb5' }}>📄 Insurance Logic Contract</h3>
                <div style={{ fontSize: '12px', color: '#d1d5db', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>Address: <span style={styles.encryptedData}>{mockHealthContract.address}</span></div>
                  <div style={{ marginTop: '12px', background: '#111827', borderRadius: '4px', padding: '12px' }}>
                    <div style={{ color: '#5adbb5', marginBottom: '8px' }}>`{'//'}` TFHE Health Insurance Contract</div>
                    <div style={{ color: '#d1d5db' }}>
                      <div>function checkEligibility(</div>
                      <div style={{ marginLeft: '16px' }}>bytes encryptedAge,</div>
                      <div style={{ marginLeft: '16px' }}>bytes encryptedBP,</div>
                      <div style={{ marginLeft: '16px' }}>bytes encryptedBS</div>
                      <div>) returns (bytes) {'{'}</div>
                      <div style={{ marginLeft: '16px', color: '#60a5fa' }}>`{'//'}` FHE Logic Processing</div>
                      <div style={{ marginLeft: '16px' }}>euint32 age = TFHE.asEuint32(encryptedAge);</div>
                      <div style={{ marginLeft: '16px' }}>euint32 bp = TFHE.asEuint32(encryptedBP);</div>
                      <div style={{ marginLeft: '16px' }}>euint32 bs = TFHE.asEuint32(encryptedBS);</div>
                      <div style={{ marginLeft: '16px', color: '#059669' }}>`{'//'}` Eligibility Check</div>
                      <div style={{ marginLeft: '16px' }}>ebool ageCheck = TFHE.gt(age, 60);</div>
                      <div style={{ marginLeft: '16px' }}>ebool bpCheck = TFHE.gt(bp, 140);</div>
                      <div style={{ marginLeft: '16px' }}>ebool bsCheck = TFHE.gt(bs, 180);</div>
                      <div style={{ marginLeft: '16px', color: '#5adbb5' }}>`{'//'}` OR Logic</div>
                      <div style={{ marginLeft: '16px' }}>ebool eligible = TFHE.or(</div>
                      <div style={{ marginLeft: '32px' }}>TFHE.or(ageCheck, bpCheck), bsCheck);</div>
                      <div style={{ marginLeft: '16px' }}>return TFHE.encrypt(eligible);</div>
                      <div>{'}'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {currentStep >= 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'rgba(37, 99, 235, 0.3)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(37, 99, 235, 0.3)' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#60a5fa', marginBottom: '8px' }}>🔄 Processing FHE</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Age check `{'>'}` 60:</span>
                        <span style={{ color: currentStep >= 4 ? (finalResult?.conditions?.ageCheck ? '#34d399' : '#f87171') : '#9ca3af' }}>
                          {currentStep >= 4 ? (finalResult?.conditions?.ageCheck ? '✓' : '✗') : '⏳'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Blood pressure check `{'>'}` 140:</span>
                        <span style={{ color: currentStep >= 4 ? (finalResult?.conditions?.bpCheck ? '#34d399' : '#f87171') : '#9ca3af' }}>
                          {currentStep >= 4 ? (finalResult?.conditions?.bpCheck ? '✓' : '✗') : '⏳'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Blood sugar check `{'>'}` 180:</span>
                        <span style={{ color: currentStep >= 4 ? (finalResult?.conditions?.bsCheck ? '#34d399' : '#f87171') : '#9ca3af' }}>
                          {currentStep >= 4 ? (finalResult?.conditions?.bsCheck ? '✓' : '✗') : '⏳'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {contractResult && (
                    <div style={{ background: 'rgba(5, 150, 105, 0.3)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(5, 150, 105, 0.3)' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#34d399', marginBottom: '8px' }}>✅ Transaction Success</h4>
                      <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>
                          <span style={{ color: '#9ca3af' }}>TX Hash:</span>
                          <p style={styles.encryptedData}>{contractResult.txHash}</p>
                        </div>
                        <div>
                          <span style={{ color: '#9ca3af' }}>Block:</span>
                          <span style={{ color: '#5adbb5', marginLeft: '8px' }}>{contractResult.blockNumber}</span>
                        </div>
                        <div style={{ marginTop: '8px' }}>
                          <span style={{ color: '#9ca3af' }}>Encrypted Result:</span>
                          <p style={styles.encryptedData}>{contractResult.resultCiphertext}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}>
                  <div style={{ ...styles.spinner, borderColor: 'rgba(90, 219, 181, 0.3)', borderTopColor: '#5adbb5', marginRight: '12px' }}></div>
                  <span style={{ fontSize: '14px' }}>Processing on FHEVM...</span>
                </div>
              )}
            </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '60px', marginRight: '18px'}}>
              <HealthDataArrow />
            </div>

            {/* Column 3: Results */}
            <div style={styles.card}>
              <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '24px', display: 'flex', alignItems: 'center' }}>
                <span style={{ 
                  width: '32px', 
                  height: '32px', 
                  backgroundColor: '#8b5cf6', 
                  borderRadius: '8px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginRight: '12px', 
                  fontSize: '14px' 
                }}>📊</span>
                Results
              </h2>

              {finalResult !== null ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={styles.eligibilityResult(finalResult.eligible)}>
                    <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                      {finalResult.eligible ? '✅' : '❌'}
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                      {finalResult.eligible ? 'Eligible!' : 'Not Eligible'}
                    </h3>
                    <p style={{ fontSize: '14px', color: '#d1d5db' }}>
                      {finalResult.eligible 
                        ? 'You are eligible for health insurance coverage'
                        : 'You do not meet the current eligibility criteria'
                      }
                    </p>
                  </div>

                  <div style={{ background: 'rgba(107, 114, 128, 0.5)', borderRadius: '8px', padding: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>📋 Detailed Evaluation</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#9ca3af' }}>Age ({healthData.age}):</span>
                        <span style={{ color: finalResult.conditions.ageCheck ? '#34d399' : '#9ca3af' }}>
                          {finalResult.conditions.ageCheck ? 'Meets criteria' : 'Does not meet'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#9ca3af' }}>Blood Pressure ({healthData.bloodPressure}):</span>
                        <span style={{ color: finalResult.conditions.bpCheck ? '#34d399' : '#9ca3af' }}>
                          {finalResult.conditions.bpCheck ? 'Meets criteria' : 'Does not meet'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#9ca3af' }}>Blood Sugar ({healthData.bloodSugar}):</span>
                        <span style={{ color: finalResult.conditions.bsCheck ? '#34d399' : '#9ca3af' }}>
                          {finalResult.conditions.bsCheck ? 'Meets criteria' : 'Does not meet'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div style={styles.privacyShield}>
                    <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
                      <PrivacyShield style={{ marginRight: '8px' }} />
                      
                      Absolute Privacy
                    </h4>
                    <p style={{ fontSize: '12px', color: '#d1d5db' }}>
                      ✅ Your health data is processed entirely in encrypted state<br/>
                      ✅ No one (including the smart contract) can view your actual information<br/>
                      ✅ Only you can decrypt and view the final results
                    </p>
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca3af' }}>
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    backgroundColor: '#374151', 
                    borderRadius: '50%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    margin: '0 auto 16px',
                    fontSize: '32px'
                  }}>
                    🏥
                  </div>
                  <p style={{ marginBottom: '8px' }}>Results will appear here</p>
                  <p style={{ fontSize: '12px' }}>Enter health information to start checking</p>
                </div>
              )}
            </div>
          </div>

          
        </div >
        {/* Technical Information */}
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
            <div style={{ ...styles.card, marginTop: '48px', width: '96%' }}>
            <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', color: '#5adbb5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              
              FHEVM Technology in Healthcare
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', fontSize: '14px' }}>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#2563eb' }}>🔐 Medical Data Security</h4>
                <p style={{ color: '#d1d5db' }}>
                  FHEVM enables processing of sensitive health information without decryption, 
                  ensuring compliance with medical privacy regulations like HIPAA.
                </p>
              </div>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#059669' }}>⚡ Complex Logic</h4>
                <p style={{ color: '#d1d5db' }}>
                  Smart contracts can perform comparisons and OR/AND logic 
                  on encrypted data to make accurate insurance decisions.
                </p>
              </div>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: '#5adbb5' }}>🌐 Transparent & Trustworthy</h4>
                <p style={{ color: '#d1d5db' }}>
                  All processing logic is public on the blockchain, 
                  while personal data remains completely confidential.
                </p>
              </div>
            </div>
          </div>
          </div>
      </div>
    </>
  );
};

export default HealthInsuranceApp;