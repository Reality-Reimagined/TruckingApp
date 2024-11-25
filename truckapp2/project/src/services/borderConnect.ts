import { z } from 'zod';

// API Response schemas
const ApiResponseSchema = z.object({
  data: z.literal('API_RESPONSE'),
  status: z.union([z.literal('OK'), z.literal('IMPORTED'), z.literal('DATA_ERROR')]),
  message: z.string(),
  dateTime: z.string(),
  tripCount: z.number().optional(),
  shipmentCount: z.number().optional(),
  tripNumber: z.string().optional(),
  errors: z.array(
    z.object({
      identifier: z.string(),
      note: z.string()
    })
  ).optional()
});

export type ApiResponse = z.infer<typeof ApiResponseSchema>;

// Trip data schema
export interface TripData {
  tripNumber: string;
  usPortOfArrival: string;
  estimatedArrivalDateTime: string;
  truck: {
    number: string;
    type: string;
    vinNumber: string;
    licensePlate: {
      number: string;
      stateProvince: string;
    };
  };
  trailers: Array<{
    number: string;
    type: string;
    licensePlate: {
      number: string;
      stateProvince: string;
    };
  }>;
  drivers: Array<{
    driverNumber: string;
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    citizenshipCountry: string;
    fastCardNumber: string;
  }>;
  shipments: Array<{
    type: string;
    shipmentControlNumber: string;
    provinceOfLoading: string;
    shipper: {
      name: string;
      address: {
        addressLine: string;
        city: string;
        stateProvince: string;
        postalCode: string;
      };
    };
    consignee: {
      name: string;
      address: {
        addressLine: string;
        city: string;
        stateProvince: string;
        postalCode: string;
      };
    };
    commodities: Array<{
      loadedOn: {
        type: string;
        number: string;
      };
      description: string;
      quantity: number;
      packagingUnit: string;
      weight: number;
      weightUnit: string;
    }>;
  }>;
}

const API_KEY = import.meta.env.VITE_BORDERCONNECT_API_KEY;
const BASE_URL = 'https://borderconnect.com/api';

export class BorderConnectService {
  private static headers = {
    'Content-Type': 'application/json',
    'Api-Key': API_KEY,
  };

  static async sendTrip(tripData: TripData): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/send/jones`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          data: 'ACE_TRIP',
          sendId: Date.now().toString(),
          companyKey: API_KEY,
          operation: 'CREATE',
          ...tripData,
          autoSend: false
        }),
      });

      const data = await response.json();
      return ApiResponseSchema.parse(data);
    } catch (error) {
      console.error('Error sending trip:', error);
      throw error;
    }
  }

  static async receiveMessages(): Promise<ApiResponse[]> {
    try {
      const response = await fetch(`${BASE_URL}/receive/jones`, {
        method: 'GET',
        headers: this.headers,
      });

      const data = await response.json();
      return z.array(ApiResponseSchema).parse(data);
    } catch (error) {
      console.error('Error receiving messages:', error);
      throw error;
    }
  }
}