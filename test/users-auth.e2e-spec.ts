/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/modules/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let userId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete(`/users/delete/${userId}`);
  });

  it('POST /auth/login & users/register', async () => {
    await request(app.getHttpServer())
      .post('/users/register')
      .send({
        username: 'Test User',
        email: 'test@example.com',
        password: 'test',
      })
      .expect(200);

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'test',
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
    expect(typeof response.body.access_token).toBe('string');
  });

  it('POST /auth/login → 401 se credenciais inválidas', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'test@example.com', password: 'senhaErrada' })
      .expect(401);
  });

  it('GET /auth/profile → 401 se não enviar token', () => {
    return request(app.getHttpServer()).get('/auth/profile').expect(401);
  });

  it('GET /auth/profile → 200 & retorna o usuário correto quando enviar token válido', async () => {
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'test',
      })
      .expect(200);

    const token: string = loginRes.body.access_token;
    expect(token).toBeDefined();

    const profileRes = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(profileRes.body).toHaveProperty('email', 'test@example.com');
    expect(profileRes.body).toHaveProperty('username', 'Test User');
    expect(typeof profileRes.body.sub).toBe('string');
    userId = profileRes.body.sub;
  });
});
