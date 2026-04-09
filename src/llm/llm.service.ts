import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { ParsedCriteria } from '../types';

@Injectable()
export class LlmService {
  private readonly logger = new Logger(LlmService.name);
  private client: OpenAI | null = null;

  constructor() {
    if (process.env.GROQ_API_KEY) {
      this.client = new OpenAI({ 
        apiKey: process.env.GROQ_API_KEY,
        baseURL: 'https://api.groq.com/openai/v1'
      });
    } else {
      this.logger.warn('GROQ_API_KEY not set — using regex fallback parser');
    }
  }

  private readonly SYSTEM_PROMPT = `You are a UK property search assistant. Extract structured search criteria from natural language property queries.
Respond ONLY with a valid JSON object. No markdown, no code blocks, no explanation whatsoever.
Extract these fields (use null for any field not mentioned):
- site_type: must be exactly one of: brownfield, greenfield, commercial, residential, mixed_use
- min_acres: number (minimum acreage required)
- max_acres: number (maximum acreage)
- region: UK region name, one of: Midlands, North West, North East, South East, South West, London, Yorkshire, Scotland, Wales
- max_price: integer in GBP (e.g. £2m = 2000000)
- min_price: integer in GBP

Example:
Input: "brownfield sites over 5 acres in the Midlands under £2m"
Output: {"site_type":"brownfield","min_acres":5,"max_acres":null,"region":"Midlands","max_price":2000000,"min_price":null}`;

  /**
   * Parses a natural language property query into structured search criteria.
   * Falls back to regex-based mock parser if OpenAI is unavailable.
   */
  async parseQuery(query: string): Promise<ParsedCriteria> {
    if (!this.client) {
      return this.mockParser(query);
    }

    try {
      const response = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: this.SYSTEM_PROMPT },
          { role: 'user', content: query },
        ],
        temperature: 0,
        max_tokens: 200,
      });

      const text = response.choices[0]?.message?.content?.trim() ?? '';
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleaned);

      return {
        site_type: parsed.site_type ?? undefined,
        min_acres: parsed.min_acres ?? undefined,
        max_acres: parsed.max_acres ?? undefined,
        region: parsed.region ?? undefined,
        max_price: parsed.max_price ?? undefined,
        min_price: parsed.min_price ?? undefined,
        raw_query: query,
      };
    } catch (error) {
      this.logger.error(`OpenAI parsing failed: ${(error as Error).message} — falling back to regex parser`);
      return this.mockParser(query);
    }
  }

  /**
   * Regex-based fallback parser — works without any API key.
   * Handles common natural language patterns for UK property queries.
   */
  private mockParser(query: string): ParsedCriteria {
    const lower = query.toLowerCase();

    // Extract site_type
    const siteTypes: Array<ParsedCriteria['site_type']> = [
      'brownfield', 'greenfield', 'commercial', 'residential', 'mixed_use',
    ];
    let site_type: ParsedCriteria['site_type'];
    for (const type of siteTypes) {
      if (type && lower.includes(type.replace('_', ' '))) {
        site_type = type;
        break;
      }
    }

    // Extract region
    const regions = [
      'midlands', 'north west', 'north east', 'south east',
      'south west', 'london', 'yorkshire', 'scotland', 'wales',
    ];
    let region: string | undefined;
    for (const r of regions) {
      if (lower.includes(r)) {
        region = r.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        break;
      }
    }

    // Extract max price — handles £2m, £500k, £2,000,000
    let max_price: number | undefined;
    const priceMatch = lower.match(/under\s+£?([\d,.]+)\s*(m|million|k|thousand)?/i);
    if (priceMatch) {
      const num = parseFloat(priceMatch[1].replace(/,/g, ''));
      const unit = priceMatch[2]?.toLowerCase();
      if (unit === 'm' || unit === 'million') max_price = num * 1_000_000;
      else if (unit === 'k' || unit === 'thousand') max_price = num * 1_000;
      else max_price = num;
    }

    // Extract min acres
    let min_acres: number | undefined;
    const acresMatch = lower.match(/over\s+([\d.]+)\s+acres?/i);
    if (acresMatch) min_acres = parseFloat(acresMatch[1]);

    // Extract max acres
    let max_acres: number | undefined;
    const maxAcresMatch = lower.match(/under\s+([\d.]+)\s+acres?/i);
    if (maxAcresMatch) max_acres = parseFloat(maxAcresMatch[1]);

    return { site_type, min_acres, max_acres, region, max_price, raw_query: query };
  }
}
