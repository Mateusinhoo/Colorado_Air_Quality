// Colorado Regions for Air Quality Monitoring
// Replaces individual zip codes with major regional coverage areas

export interface ColoradoRegion {
  id: string;
  name: string;
  displayName: string;
  lat: number;
  lon: number;
  radius: number; // miles for API coverage
  population: number;
  description: string;
  majorCities: string[];
}

export const COLORADO_REGIONS: ColoradoRegion[] = [
  {
    id: 'denver-metro',
    name: 'Denver Metro',
    displayName: 'Denver Metropolitan Area',
    lat: 39.7392,
    lon: -104.9903,
    radius: 30,
    population: 2963821,
    description: 'Denver and surrounding metropolitan area including Aurora, Lakewood, Thornton, Westminster, Arvada, and Centennial',
    majorCities: ['Denver', 'Aurora', 'Lakewood', 'Thornton', 'Westminster', 'Arvada', 'Centennial', 'Boulder']
  },
  {
    id: 'colorado-springs',
    name: 'Colorado Springs',
    displayName: 'Colorado Springs Area',
    lat: 38.8339,
    lon: -104.8214,
    radius: 25,
    population: 715522,
    description: 'Colorado Springs metropolitan area including Fountain, Security-Widefield, and surrounding communities',
    majorCities: ['Colorado Springs', 'Fountain', 'Security-Widefield', 'Manitou Springs']
  },
  {
    id: 'fort-collins-boulder',
    name: 'Fort Collins/Boulder',
    displayName: 'Northern Front Range',
    lat: 40.5853,
    lon: -105.0844,
    radius: 25,
    population: 650000,
    description: 'Northern Front Range including Fort Collins, Boulder, Longmont, and Loveland',
    majorCities: ['Fort Collins', 'Boulder', 'Longmont', 'Loveland', 'Broomfield']
  },
  {
    id: 'pueblo',
    name: 'Pueblo',
    displayName: 'Pueblo Area',
    lat: 38.2544,
    lon: -104.6091,
    radius: 20,
    population: 168162,
    description: 'Pueblo and surrounding southern Colorado communities',
    majorCities: ['Pueblo', 'Pueblo West', 'Boone']
  },
  {
    id: 'grand-junction',
    name: 'Grand Junction',
    displayName: 'Western Slope - Grand Junction',
    lat: 39.0639,
    lon: -108.5506,
    radius: 25,
    population: 155000,
    description: 'Grand Junction and Western Slope including Fruita, Palisade, and surrounding mesa communities',
    majorCities: ['Grand Junction', 'Fruita', 'Palisade', 'Clifton']
  },
  {
    id: 'durango',
    name: 'Durango',
    displayName: 'Southwest Colorado - Durango',
    lat: 37.2753,
    lon: -107.8801,
    radius: 20,
    population: 55000,
    description: 'Durango and Four Corners region including Cortez and southwestern mountain communities',
    majorCities: ['Durango', 'Cortez', 'Bayfield']
  },
  {
    id: 'vail-eagle',
    name: 'Vail/Eagle',
    displayName: 'Central Mountains - Vail Valley',
    lat: 39.6403,
    lon: -106.3742,
    radius: 20,
    population: 85000,
    description: 'Vail Valley including Eagle, Vail, Avon, and central mountain resort communities',
    majorCities: ['Vail', 'Eagle', 'Avon', 'Edwards', 'Minturn']
  },
  {
    id: 'aspen',
    name: 'Aspen',
    displayName: 'Roaring Fork Valley - Aspen',
    lat: 39.1911,
    lon: -106.8175,
    radius: 15,
    population: 25000,
    description: 'Aspen and Roaring Fork Valley including Snowmass, Basalt, and Carbondale',
    majorCities: ['Aspen', 'Snowmass Village', 'Basalt', 'Carbondale']
  },
  {
    id: 'steamboat-springs',
    name: 'Steamboat Springs',
    displayName: 'Northwest Mountains - Steamboat',
    lat: 40.4850,
    lon: -106.8317,
    radius: 15,
    population: 35000,
    description: 'Steamboat Springs and Yampa Valley including Craig and northwestern mountain communities',
    majorCities: ['Steamboat Springs', 'Craig', 'Hayden']
  },
  {
    id: 'greeley',
    name: 'Greeley',
    displayName: 'Northeast Colorado - Greeley',
    lat: 40.4233,
    lon: -104.7091,
    radius: 20,
    population: 125000,
    description: 'Greeley and northeastern plains including Evans, Windsor, and agricultural communities',
    majorCities: ['Greeley', 'Evans', 'Windsor', 'Eaton']
  },
  {
    id: 'sterling',
    name: 'Sterling',
    displayName: 'Eastern Plains - Sterling',
    lat: 40.6256,
    lon: -103.2077,
    radius: 25,
    population: 45000,
    description: 'Sterling and far eastern Colorado plains including Fort Morgan and agricultural regions',
    majorCities: ['Sterling', 'Fort Morgan', 'Brush', 'Yuma']
  },
  {
    id: 'alamosa',
    name: 'Alamosa',
    displayName: 'San Luis Valley - Alamosa',
    lat: 37.4694,
    lon: -105.8700,
    radius: 20,
    population: 55000,
    description: 'Alamosa and San Luis Valley including Monte Vista, Del Norte, and high valley communities',
    majorCities: ['Alamosa', 'Monte Vista', 'Del Norte', 'Center']
  },
  {
    id: 'salida',
    name: 'Salida',
    displayName: 'Arkansas Valley - Salida',
    lat: 38.5347,
    lon: -106.0042,
    radius: 15,
    population: 25000,
    description: 'Salida and Arkansas River Valley including Buena Vista and central mountain valleys',
    majorCities: ['Salida', 'Buena Vista', 'Poncha Springs']
  },
  {
    id: 'glenwood-springs',
    name: 'Glenwood Springs',
    displayName: 'Western Mountains - Glenwood',
    lat: 39.5505,
    lon: -107.3248,
    radius: 15,
    population: 35000,
    description: 'Glenwood Springs and western mountain valleys including Rifle and Colorado River communities',
    majorCities: ['Glenwood Springs', 'Rifle', 'New Castle', 'Silt']
  },
  {
    id: 'trinidad',
    name: 'Trinidad',
    displayName: 'Southeast Colorado - Trinidad',
    lat: 37.1692,
    lon: -104.5011,
    radius: 20,
    population: 25000,
    description: 'Trinidad and southeastern Colorado including La Junta, Lamar, and plains communities',
    majorCities: ['Trinidad', 'La Junta', 'Lamar', 'Las Animas']
  }
];

// Helper functions for regional data
export const getRegionById = (id: string): ColoradoRegion | undefined => {
  return COLORADO_REGIONS.find(region => region.id === id);
};

export const getRegionByName = (name: string): ColoradoRegion | undefined => {
  return COLORADO_REGIONS.find(region => 
    region.name.toLowerCase() === name.toLowerCase() ||
    region.displayName.toLowerCase() === name.toLowerCase()
  );
};

export const getAllRegionNames = (): string[] => {
  return COLORADO_REGIONS.map(region => region.name);
};

export const getAllRegionDisplayNames = (): string[] => {
  return COLORADO_REGIONS.map(region => region.displayName);
};

// Regional coverage statistics
export const TOTAL_COLORADO_POPULATION_COVERED = COLORADO_REGIONS.reduce(
  (total, region) => total + region.population, 0
);

export const TOTAL_REGIONS = COLORADO_REGIONS.length;

