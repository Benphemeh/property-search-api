export interface ParsedCriteria {
  site_type?: 'brownfield' | 'greenfield' | 'commercial' | 'residential' | 'mixed_use' | null;
  min_acres?: number | null;
  max_acres?: number | null;
  region?: string | null;
  max_price?: number | null;
  min_price?: number | null;
  raw_query: string;
}

export interface Property {
  id: string;
  title: string;
  site_type: string;
  acres: number;
  price: number;
  region: string;
  city: string;
  planning_status: string;
  description: string;
  created_at: Date;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  parsed_criteria: ParsedCriteria;
  results: Property[];
  total: number;
  processing_time_ms: number;
}
