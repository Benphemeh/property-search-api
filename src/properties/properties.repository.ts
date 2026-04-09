import { Injectable } from '@nestjs/common';
import { pool } from '../config/database.config';
import { Property, ParsedCriteria } from '../types';

@Injectable()
export class PropertiesRepository {
  /**
   * Returns all properties with optional simple filters
   */
  async findAll(filters?: { site_type?: string; region?: string }): Promise<Property[]> {
    const conditions: string[] = [];
    const values: (string | number)[] = [];
    let idx = 1;

    if (filters?.site_type) {
      conditions.push(`site_type = $${idx++}`);
      values.push(filters.site_type);
    }
    if (filters?.region) {
      conditions.push(`region ILIKE $${idx++}`);
      values.push(`%${filters.region}%`);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query<Property>(
      `SELECT * FROM properties ${where} ORDER BY created_at DESC`,
      values,
    );
    return result.rows;
  }

  /**
   * Returns a single property by ID
   */
  async findById(id: string): Promise<Property | null> {
    const result = await pool.query<Property>(
      'SELECT * FROM properties WHERE id = $1',
      [id],
    );
    return result.rows[0] ?? null;
  }

  /**
   * Searches properties using parsed NLP criteria with dynamic WHERE clauses.
   * Returns all properties if no criteria are provided.
   */
  async search(criteria: ParsedCriteria): Promise<Property[]> {
    const conditions: string[] = [];
    const values: (string | number)[] = [];
    let idx = 1;

    if (criteria.site_type) {
      conditions.push(`site_type = $${idx++}`);
      values.push(criteria.site_type);
    }
    if (criteria.region) {
      conditions.push(`region ILIKE $${idx++}`);
      values.push(`%${criteria.region}%`);
    }
    if (criteria.min_acres != null) {
      conditions.push(`acres >= $${idx++}`);
      values.push(criteria.min_acres);
    }
    if (criteria.max_acres != null) {
      conditions.push(`acres <= $${idx++}`);
      values.push(criteria.max_acres);
    }
    if (criteria.min_price != null) {
      conditions.push(`price >= $${idx++}`);
      values.push(criteria.min_price);
    }
    if (criteria.max_price != null) {
      conditions.push(`price <= $${idx++}`);
      values.push(criteria.max_price);
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
    const result = await pool.query<Property>(
      `SELECT * FROM properties ${where} ORDER BY price ASC`,
      values,
    );
    return result.rows;
  }
}
