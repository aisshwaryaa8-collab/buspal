
export enum CrowdLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface LatLng {
  lat: number;
  lng: number;
}

export interface BusStop {
  id: string;
  name: string;
  location: LatLng;
  routes: string[];
}

export interface BusRoute {
  id: string;
  number: string;
  name: string;
  stops: string[]; // List of Stop IDs
}

export interface LiveBus {
  id: string;
  routeId: string;
  routeNumber: string;
  currentLocation: LatLng;
  nextStopId: string;
  crowdLevel: CrowdLevel;
  lastUpdated: number;
}

export interface CrowdPrediction {
  percentage: number;
  category: CrowdLevel;
  confidence: number;
  reasoning: string;
}

export interface UserReport {
  id: string;
  busId: string;
  routeNumber: string;
  stopId: string;
  crowdLevel: CrowdLevel;
  timestamp: number;
  userId: string;
}
