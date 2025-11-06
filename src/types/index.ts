export interface DataBundle {
  name: string;
  description: string;
  groups: string[];
  countries: Array<{
    name: string;
    region: string;
    iso: string;
  }>;
  dataAmount: number; // in bytes
  duration: number; // in days
  speed: string[] | null;
  autostart: boolean;
  unlimited: boolean;
  roamingEnabled: Array<{
    name: string;
    region: string;
    iso: string;
  }>;
  price: number; // in USD (not cents!)
  billingType: 'FixedCost' | 'prepaid' | 'postpaid';
  imageUrl?: string;
}

export interface OrderRequest {
  type: 'validate' | 'transaction';
  quantity: number;
  item: string; // bundle name
  assign: boolean;
  iccid?: string;
  profileID?: string;
}

export interface OrderResponse {
  statusMessage: string;
  orderReference: string;
  esimsAssigned: number;
  total: number;
  currency: string;
}

export interface ESIMUsage {
  iccid: string;
  alertType: string;
  bundle: {
    id: string;
    reference: string;
    name: string;
    description: string;
    initialQuantity: number;
    remainingQuantity: number;
    startTime: string;
    endTime: string;
    unlimited: boolean;
  };
}

export interface SolanaPayment {
  signature: string;
  amount: number;
  token: string;
  buyer: string;
  timestamp: number;
}

export interface Purchase {
  id: string;
  bundleName: string;
  country: string;
  dataAmount: number;
  duration: number;
  priceUSD: number;
  priceSolana: number;
  status: 'pending' | 'confirmed' | 'fulfilled' | 'failed';
  solanaSignature?: string;
  orderReference?: string;
  iccid?: string;
  qrCodeUrl?: string;
  createdAt: string;
  updatedAt: string;
}