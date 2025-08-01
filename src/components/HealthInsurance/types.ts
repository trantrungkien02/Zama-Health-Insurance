export interface HealthData {
  age: string;
  bloodPressure: string;
  bloodSugar: string;
}

export interface EncryptedData {
  age?: string;
  bloodPressure?: string;
  bloodSugar?: string;
}

export interface ContractResult {
  txHash: string;
  resultCiphertext: string;
  blockNumber: number;
  isEligible: boolean;
  conditions: {
    ageCheck: boolean;
    bpCheck: boolean;
    bsCheck: boolean;
  };
}

export interface FinalResult {
  eligible: boolean;
  conditions: {
    ageCheck: boolean;
    bpCheck: boolean;
    bsCheck: boolean;
  };
}

export type HealthMetricType = 'age' | 'bp' | 'bs';