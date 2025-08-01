import { ContractResult } from './types';

export const mockFHEVMJS = {
  encryptAge: (age: number): string => {
    const encrypted = Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    return `0xAGE${encrypted.substring(0, 60)}`;
  },
  
  encryptBloodPressure: (bp: number): string => {
    const encrypted = Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    return `0xBP${encrypted.substring(0, 61)}`;
  },
  
  encryptBloodSugar: (bs: number): string => {
    const encrypted = Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    return `0xBS${encrypted.substring(0, 61)}`;
  },
  
  decrypt: (ciphertext: string, result: boolean): boolean => {
    return result;
  }
};

export const mockHealthContract = {
  address: "0x742d35Cc6634C0532925a3b8D4C9db7C4E2d7a8B",
  
  checkEligibility: async (
    encryptedAge: string, 
    encryptedBP: string, 
    encryptedBS: string, 
    age: number, 
    bp: number, 
    bs: number
  ): Promise<ContractResult> => {
    // Simulate contract processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const txHash = `0x${Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    // Logic: age > 60 OR bp > 140 OR bs > 180 = eligible
    const isEligible = age > 60 || bp > 140 || bs > 180;
    
    const resultCiphertext = `0xRESULT${Array.from({length: 58}, () => 
      Math.floor(Math.random() * 16).toString(16)).join('')}`;
    
    return {
      txHash,
      resultCiphertext,
      blockNumber: Math.floor(Math.random() * 1000000) + 18000000,
      isEligible,
      conditions: {
        ageCheck: age > 60,
        bpCheck: bp > 140,
        bsCheck: bs > 180
      }
    };
  }
};