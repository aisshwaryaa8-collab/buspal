import { MOCK_STOPS, MOCK_ROUTES } from '../constants';
import { LiveBus, CrowdLevel, UserReport } from '../types';

let liveBuses: LiveBus[] = [
  {
    id: 'b_mtc_72',
    routeId: 'r_72',
    routeNumber: '72',
    currentLocation: { lat: 13.0405, lng: 80.2337 },
    nextStopId: 's_trustpuram',
    crowdLevel: CrowdLevel.MEDIUM,
    lastUpdated: Date.now()
  },
  {
    id: 'b_mtc_25',
    routeId: 'r_25',
    routeNumber: '25',
    currentLocation: { lat: 13.0650, lng: 80.2850 },
    nextStopId: 's_royapetta_hosp',
    crowdLevel: CrowdLevel.LOW,
    lastUpdated: Date.now()
  },
  {
    id: 'b_mtc_26',
    routeId: 'r_26',
    routeNumber: '26',
    currentLocation: { lat: 13.0911, lng: 80.2882 },
    nextStopId: 's_central',
    crowdLevel: CrowdLevel.HIGH,
    lastUpdated: Date.now()
  },
  {
    id: 'b_mtc_101',
    routeId: 'r_101',
    routeNumber: '101',
    currentLocation: { lat: 13.1601, lng: 80.3000 },
    nextStopId: 's_thangal',
    crowdLevel: CrowdLevel.MEDIUM,
    lastUpdated: Date.now()
  },
  {
    id: 'b_mtc_102',
    routeId: 'r_102',
    routeNumber: '102',
    currentLocation: { lat: 13.0911, lng: 80.2882 },
    nextStopId: 's_chepauk',
    crowdLevel: CrowdLevel.LOW,
    lastUpdated: Date.now()
  },
  {
    id: 'b_mtc_102x',
    routeId: 'r_102x',
    routeNumber: '102X',
    currentLocation: { lat: 12.9640, lng: 80.2460 },
    nextStopId: 's_sholinganallur',
    crowdLevel: CrowdLevel.HIGH,
    lastUpdated: Date.now()
  },
  {
    id: 'b_mtc_104',
    routeId: 'r_104',
    routeNumber: '104',
    currentLocation: { lat: 13.1860, lng: 80.1700 },
    nextStopId: 's_maduravoyal',
    crowdLevel: CrowdLevel.MEDIUM,
    lastUpdated: Date.now()
  },
  {
    id: 'b_mtc_111',
    routeId: 'r_111',
    routeNumber: '111',
    currentLocation: { lat: 13.0700, lng: 80.1200 },
    nextStopId: 's_maduravoyal',
    crowdLevel: CrowdLevel.LOW,
    lastUpdated: Date.now()
  },
  {
    id: 'b_mtc_119',
    routeId: 'r_119',
    routeNumber: '119',
    currentLocation: { lat: 13.0100, lng: 80.2200 },
    nextStopId: 's_srp_tools',
    crowdLevel: CrowdLevel.MEDIUM,
    lastUpdated: Date.now()
  }
];

export const getBusStops = async () => MOCK_STOPS;
export const getBusRoutes = async () => MOCK_ROUTES;

export const getLiveBusLocations = async (): Promise<LiveBus[]> => {
  liveBuses = liveBuses.map(bus => ({
    ...bus,
    currentLocation: {
      lat: bus.currentLocation.lat + (Math.random() - 0.5) * 0.003,
      lng: bus.currentLocation.lng + (Math.random() - 0.5) * 0.003
    },
    lastUpdated: Date.now()
  }));
  return liveBuses;
};

export const reportCrowd = async (report: Omit<UserReport, 'id' | 'timestamp'>) => {
  console.log("MTC Chennai Report Ingested:", report);
  return { success: true };
};

export const getNearestStops = (lat: number, lng: number) => {
  return MOCK_STOPS.sort((a, b) => {
    const distA = Math.hypot(a.location.lat - lat, a.location.lng - lng);
    const distB = Math.hypot(b.location.lat - lat, b.location.lng - lng);
    return distA - distB;
  }).slice(0, 5);
};
