import { DataBundle, OrderRequest, OrderResponse } from '@/types';

const ESIM_GO_API_URL = process.env.ESIM_GO_API_URL || 'https://api.esim-go.com/v2.4';
const ESIM_GO_API_KEY = process.env.ESIM_GO_API_KEY;

if (!ESIM_GO_API_KEY) {
  throw new Error('ESIM_GO_API_KEY environment variable is required');
}

class ESIMGoService {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = ESIM_GO_API_URL;
    this.apiKey = ESIM_GO_API_KEY!;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`eSIM-Go API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async getCatalogue(params?: {
    page?: number;
    perPage?: number;
    countries?: string;
    region?: string;
    group?: string;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          searchParams.append(key, value.toString());
        }
      }
    }

    const endpoint = `/catalogue${searchParams.toString() ? `?${searchParams}` : ''}`;
    return this.makeRequest<any>(endpoint);
  }

  async getBundleDetails(bundleName: string): Promise<DataBundle> {
    return this.makeRequest<DataBundle>(`/catalogue/${bundleName}`);
  }

  async validateOrder(orderRequest: Omit<OrderRequest, 'type'>): Promise<OrderResponse> {
    return this.makeRequest<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        ...orderRequest,
        type: 'validate',
      }),
    });
  }

  async createOrder(orderRequest: Omit<OrderRequest, 'type'>): Promise<OrderResponse> {
    return this.makeRequest<OrderResponse>('/orders', {
      method: 'POST',
      body: JSON.stringify({
        ...orderRequest,
        type: 'transaction',
      }),
    });
  }

  async getQRCode(orderReference: string): Promise<ArrayBuffer> {
    const response = await fetch(`${this.baseURL}/esimsassignments/${orderReference}`, {
      headers: {
        'X-API-Key': this.apiKey,
        'Accept': 'application/zip',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get QR code: ${response.status}`);
    }

    return response.arrayBuffer();
  }

  async getBundleStatus(iccid: string, bundleName: string) {
    return this.makeRequest(`/esims/${iccid}/bundles/${bundleName}`);
  }

  async getAccountBalance() {
    try {
      return this.makeRequest('/account/balance');
    } catch (error) {
      console.error('Failed to fetch account balance:', error);
      return null;
    }
  }
}

export const esimGoService = new ESIMGoService();