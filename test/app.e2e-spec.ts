/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/modules/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('POST /auth/login → 200 & retorna { access_token }', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'john@example.com',
        password: 'changeme',
      })
      .expect(200);

    // Aqui assumimos que o AuthService retorna algo como { access_token: '...' }
    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');
  });
});
