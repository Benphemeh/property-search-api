import * as dotenv from 'dotenv';
dotenv.config();
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { LlmService } from '../src/llm/llm.service';
import { HttpExceptionFilter } from '../src/filters/http-exception.filter';

const mockLlmService = {
  parseQuery: jest.fn().mockResolvedValue({
    site_type: 'brownfield',
    min_acres: 5,
    region: 'Midlands',
    max_price: 2000000,
    raw_query: 'brownfield sites over 5 acres in the Midlands under £2m',
  }),
};

describe('Property Search API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(LlmService)
      .useValue(mockLlmService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/search — valid query returns 200 with results', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/search')
      .send({ query: 'brownfield sites over 5 acres in the Midlands under £2m' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.parsed_criteria).toBeDefined();
    expect(res.body.parsed_criteria.site_type).toBe('brownfield');
  });

  it('POST /api/search — empty query returns 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/search')
      .send({ query: '' })
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it('POST /api/search — missing query field returns 400', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/search')
      .send({})
      .expect(400);

    expect(res.body.success).toBe(false);
  });

  it('GET /api/properties — returns all 15 properties', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/properties')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.total).toBe(15);
  });
});
