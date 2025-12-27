import { BusStop, BusRoute, CrowdLevel } from './types';

export const CHENNAI_CENTER = { lat: 13.0400, lng: 80.2000 };

export const MOCK_STOPS: BusStop[] = [
  // Major Terminals & Hubs
  { id: 's_broadway', name: 'Broadway', location: { lat: 13.0911, lng: 80.2882 }, routes: ['102', '102C', '102K', '102P', '102S', '102X', '109', '10A', '10E', '11', '11G', '26'] },
  { id: 's_central', name: 'M.G.R. Central', location: { lat: 13.0822, lng: 80.2755 }, routes: ['101', '10A', '10E', '11', '11G', '26'] },
  { id: 's_thiruvotriyur', name: 'Thiruvotriyur', location: { lat: 13.1601, lng: 80.3000 }, routes: ['101'] },
  { id: 's_thiruvotriyur_temple', name: 'Thiruvotriyur Temple', location: { lat: 13.1650, lng: 80.3050 }, routes: ['101'] },
  { id: 's_tnagar', name: 'T. Nagar', location: { lat: 13.0405, lng: 80.2337 }, routes: ['11', '11G', 'M27', '72'] },
  { id: 's_tambaram', name: 'Tambaram', location: { lat: 12.9249, lng: 80.1277 }, routes: ['104', '111', '111ET', '118'] },
  { id: 's_kilambakkam', name: 'Kilambakkam B.S.', location: { lat: 12.8500, lng: 80.0800 }, routes: ['104A', '104C', '104F', '104G', '104K', '104M', '104P', '104T', '111ET'] },
  { id: 's_kelambakkam', name: 'Kelambakkam', location: { lat: 12.7850, lng: 80.2250 }, routes: ['102', '102M', '102X', '105', '105A'] },
  { id: 's_koyambedu', name: 'M.G.R. Koyambedu', location: { lat: 13.0687, lng: 80.2045 }, routes: ['104C', '104CX', '114', '114C', 'M27', '72'] },
  { id: 's_poonamallee', name: 'Poonamallee', location: { lat: 13.0470, lng: 80.0940 }, routes: ['101', '25'] },
  { id: 's_redhills', name: 'Redhills', location: { lat: 13.1860, lng: 80.1700 }, routes: ['104', '104K', '113', '114', '114C'] },
  { id: 's_thiruvallur', name: 'Thiruvallur', location: { lat: 13.1430, lng: 79.9100 }, routes: ['153'] },
  { id: 's_thiruverkadu', name: 'Thiriverkadu', location: { lat: 13.0700, lng: 80.1200 }, routes: ['111', '111ET', '72'] },
  { id: 's_annasquare', name: 'Anna Square', location: { lat: 13.0650, lng: 80.2850 }, routes: ['25'] },

  // New stops for routes 72, 25, 26
  { id: 's_trustpuram', name: 'Trustpuram', location: { lat: 13.0520, lng: 80.2250 }, routes: ['72', '25', '26'] },
  { id: 's_virugambakkam', name: 'Virugambakkam', location: { lat: 13.0510, lng: 80.1920 }, routes: ['25', '26'] },
  { id: 's_valasaravakkam', name: 'Valasaravakkam', location: { lat: 13.0420, lng: 80.1750 }, routes: ['25', '26'] },
  { id: 's_iyyappanthangal', name: 'Iyyappanthangal', location: { lat: 13.0380, lng: 80.1380 }, routes: ['25', '26'] },
  { id: 's_gemini_ph', name: 'Gemini P.H', location: { lat: 13.0515, lng: 80.2520 }, routes: ['25', '26'] },
  { id: 's_royapetta_hosp', name: 'Royapetta Hospital', location: { lat: 13.0560, lng: 80.2620 }, routes: ['25'] },
  { id: 's_vanagaram', name: 'Vaanagaram', location: { lat: 13.0600, lng: 80.1550 }, routes: ['72'] },
  { id: 's_velappanchavadi', name: 'Velappanchavadi', location: { lat: 13.0580, lng: 80.1420 }, routes: ['72'] },
  { id: 's_nerkundram', name: 'Nerkundram', location: { lat: 13.0660, lng: 80.1850 }, routes: ['72'] },

  // Intermediate Stops - OMR Cluster
  { id: 's_srp_tools', name: 'SRP Tools', location: { lat: 12.9640, lng: 80.2460 }, routes: ['102', '102A', '102C', '102CT', '102E', '102K', '102M', '102P', '102S', '102X', '119'] },
  { id: 's_kandanchavadi', name: 'Kandanchavadi', location: { lat: 12.9600, lng: 80.2450 }, routes: ['102', '102A', '102C', '102CT', '102E', '102K', '102M', '102P', '102S', '102X', '119'] },
  { id: 's_navalur', name: 'Navalur', location: { lat: 12.8450, lng: 80.2260 }, routes: ['102', '102A', '102CT', '102E', '102M', '102X', '105', '105A'] },
  { id: 's_siruseri', name: 'Siruseri I.T. Park', location: { lat: 12.8250, lng: 80.2200 }, routes: ['102A', '102CT', '102E', '105', '105A'] },
  { id: 's_sholinganallur', name: 'Shozhanganallur P.U.', location: { lat: 12.9010, lng: 80.2270 }, routes: ['102', '102A', '102C', '102CT', '102E', '102M', '102P', '102X', '119'] },

  // Intermediate Stops - West/GST Cluster
  { id: 's_porur', name: 'Porur Jn', location: { lat: 13.0380, lng: 80.1570 }, routes: ['104', '104A', '104C', '104CX', '104F', '104G', '104K', '104M', '104P', '104T', '25', '26'] },
  { id: 's_guindy', name: 'Guindy TVK Estate', location: { lat: 13.0100, lng: 80.2200 }, routes: ['113', '119'] },
  { id: 's_vadapalani', name: 'Vadapalani', location: { lat: 13.0500, lng: 80.2120 }, routes: ['M27', '25', '26'] },
  
  // New specific stops from user list
  { id: 's_thangal', name: 'Thangal', location: { lat: 13.1500, lng: 80.2950 }, routes: ['101'] },
  { id: 's_annanagar_west', name: 'Anna Nagar', location: { lat: 13.0850, lng: 80.2100 }, routes: ['101'] },
  { id: 's_royapuram_ps', name: 'Royapuram P.S', location: { lat: 13.1130, lng: 80.2940 }, routes: ['101'] },
  { id: 's_clive_battery', name: 'Clive Battery', location: { lat: 13.1000, lng: 80.2900 }, routes: ['101', '10A'] },
  { id: 's_parrys', name: 'Parrys', location: { lat: 13.0890, lng: 80.2880 }, routes: ['101', '10A'] },
  { id: 's_dasaprakash', name: 'Dasaprakash', location: { lat: 13.0800, lng: 80.2600 }, routes: ['101'] },
  { id: 's_taylors_rd', name: 'Taylors Road', location: { lat: 13.0780, lng: 80.2450 }, routes: ['101'] },
  { id: 's_aminjikarai', name: 'Aminjikarai', location: { lat: 13.0750, lng: 80.2300 }, routes: ['101'] },
  { id: 's_arumbakkam', name: 'Arumbakkam', location: { lat: 13.0700, lng: 80.2150 }, routes: ['101'] },
  { id: 's_maduravoyal', name: 'Maduravoyal', location: { lat: 13.0650, lng: 80.1700 }, routes: ['101', '104', '104A', '104C', '104CX', '104F', '104G', '104K', '104M', '104P', '104T', '111', '111ET', '72'] },
  
  { id: 's_chepauk', name: 'Chepauk', location: { lat: 13.0640, lng: 80.2800 }, routes: ['102', '102C', '102K', '102P', '102S', '102X', '109'] },
  { id: 's_qmc', name: 'Q.M.C', location: { lat: 13.0450, lng: 80.2780 }, routes: ['102', '102C', '102K', '102P', '102S', '102X', '109'] },
  { id: 's_foreshore', name: 'Foreshore Estate', location: { lat: 13.0300, lng: 80.2750 }, routes: ['102', '102C', '102K', '102P', '102S', '102X', '109'] },
  { id: 's_adyar_ot', name: 'Adyar O.T.', location: { lat: 13.0060, lng: 80.2570 }, routes: ['102', '102C', '102K', '102P', '102S', '102X', '109'] },
  
  { id: 's_semmancheri', name: 'Semmancheri', location: { lat: 12.8700, lng: 80.2250 }, routes: ['102', '102A', '102C', '102CT', '102E', '102M', '102X', '119'] },
  { id: 's_thiruporur', name: 'Thiruporur', location: { lat: 12.7200, lng: 80.1900 }, routes: ['102M', '102X'] },
  { id: 's_guduvanchery', name: 'Guduvanchery', location: { lat: 12.8400, lng: 80.0600 }, routes: ['104CX', '118'] },
  { id: 's_perungalathur', name: 'Perungalathur', location: { lat: 12.9000, lng: 80.0900 }, routes: ['104A', '104C', '104CX', '104F', '104G', '104K', '104M', '104P', '104T', '111ET', '118'] },
  
  { id: 's_egmore', name: 'Egmore', location: { lat: 13.0800, lng: 80.2600 }, routes: ['10A', '10E'] },
  { id: 's_pondybazaar', name: 'Pondy Bazaar', location: { lat: 13.0400, lng: 80.2400 }, routes: ['10A', '11', '11G'] },
];

export const MOCK_ROUTES: BusRoute[] = [
  { 
    id: 'r_72', number: '72', name: 'T. Nagar ↔ Thiruverkadu', 
    stops: ['s_tnagar', 's_trustpuram', 's_koyambedu', 's_nerkundram', 's_maduravoyal', 's_vanagaram', 's_velappanchavadi', 's_thiruverkadu'] 
  },
  { 
    id: 'r_25', number: '25', name: 'Anna Square ↔ Poonamallee', 
    stops: ['s_annasquare', 's_royapetta_hosp', 's_gemini_ph', 's_trustpuram', 's_vadapalani', 's_virugambakkam', 's_valasaravakkam', 's_porur', 's_iyyappanthangal', 's_poonamallee'] 
  },
  { 
    id: 'r_26', number: '26', name: 'Broadway ↔ Iyyappanthangal', 
    stops: ['s_broadway', 's_central', 's_gemini_ph', 's_trustpuram', 's_vadapalani', 's_virugambakkam', 's_valasaravakkam', 's_porur', 's_iyyappanthangal'] 
  },
  { 
    id: 'r_101', number: '101', name: 'Thiruvotriyur ↔ Poonamallee', 
    stops: ['s_thiruvotriyur', 's_thangal', 's_annanagar_west', 's_royapuram_ps', 's_clive_battery', 's_parrys', 's_central', 's_dasaprakash', 's_taylors_rd', 's_aminjikarai', 's_arumbakkam', 's_maduravoyal', 's_poonamallee'] 
  },
  { 
    id: 'r_102', number: '102', name: 'Broadway ↔ Kelambakkam', 
    stops: ['s_broadway', 's_chepauk', 's_qmc', 's_foreshore', 's_adyar_ot', 's_srp_tools', 's_kandanchavadi', 's_sholinganallur', 's_kumaran_nagar', 's_semmancheri', 's_navalur', 's_kelambakkam'] 
  },
  { 
    id: 'r_102x', number: '102X', name: 'Broadway ↔ Thiruporur (Express)', 
    stops: ['s_broadway', 's_chepauk', 's_qmc', 's_foreshore', 's_adyar_ot', 's_srp_tools', 's_kandanchavadi', 's_sholinganallur', 's_semmancheri', 's_navalur', 's_kelambakkam', 's_thiruporur'] 
  },
  { 
    id: 'r_104', number: '104', name: 'Redhills ↔ Tambaram', 
    stops: ['s_redhills', 's_ambattur_ot', 's_ambattur_ie', 's_maduravoyal', 's_porur', 's_tambaram'] 
  },
  { 
    id: 'r_104a', number: '104A', name: 'Avadi ↔ Kilambakkam', 
    stops: ['s_avadi', 's_ambattur_ot', 's_maduravoyal', 's_porur', 's_perungalathur', 's_kilambakkam'] 
  },
  { 
    id: 'r_111', number: '111', name: 'Thiruverkadu ↔ Tambaram', 
    stops: ['s_thiruverkadu', 's_maduravoyal', 's_koyambedu', 's_tambaram'] 
  },
  { 
    id: 'r_119', number: '119', name: 'Guindy ↔ Semmancheri', 
    stops: ['s_guindy', 's_velachery', 's_srp_tools', 's_kandanchavadi', 's_sholinganallur', 's_semmancheri'] 
  },
  { 
    id: 'r_11', number: '11', name: 'Broadway ↔ T. Nagar', 
    stops: ['s_broadway', 's_central', 's_pondybazaar', 's_tnagar'] 
  },
  { 
    id: 'r_m27', number: 'M27', name: 'T. Nagar ↔ Koyambedu', 
    stops: ['s_tnagar', 's_vadapalani', 's_koyambedu'] 
  }
];

export const MAP_COLORS = {
  [CrowdLevel.LOW]: '#10B981',
  [CrowdLevel.MEDIUM]: '#F59E0B',
  [CrowdLevel.HIGH]: '#EF4444'
};
