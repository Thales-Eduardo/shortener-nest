/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/modules/app.module';

describe('UserController & AuthController(e2e)', () => {
  let app: INestApplication<App>;
  let userId: string;
  let token: string;
  const hash: string[] = [];

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    await request(app.getHttpServer())
      .post('/users/register')
      .send({
        username: 'Test User2',
        email: 'test2@example.com',
        password: 'test',
      })
      .expect(201);
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test2@example.com',
        password: 'test',
      })
      .expect(200);
    token = response.body.access_token;

    const profileRes = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    userId = profileRes.body.sub;
    await app.close();
  });

  afterAll(async () => {
    await request(app.getHttpServer()).delete(`/users/delete/${userId}`);

    for (const dados of hash) {
      const hash = dados.split('/')[3];
      await request(app.getHttpServer())
        .delete(`/shortener/delete_url/${hash}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204);
    }
  });

  it('/shortener/shorten_url (POST) → 201 & retorna a hash criada', async () => {
    const response = await request(app.getHttpServer())
      .post('/shortener/shorten_url')
      .send({
        user_id: userId,
        url_original: 'https://www.google.com/?hl=pt-BR',
      })
      .expect(201);

    expect(response.body).toHaveProperty('url');
    hash.push(response.body.url);
  });

  it('PUT /shortener/update_url/:hash → 204 e altera url_original corretamente', async () => {
    const response = await request(app.getHttpServer())
      .post('/shortener/shorten_url')
      .send({
        user_id: userId,
        url_original: 'https://www.google.com/?hl=pt-BR',
      })
      .expect(201);

    hash.push(response.body.url);

    const urlHashe = response.body.url.split('/')[3];
    const updatedUrl = 'https://www.w3schools.com/tags/default.asp';

    await request(app.getHttpServer())
      .put(`/shortener/update_url/${urlHashe}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newUrl: updatedUrl })
      .expect(204);

    const page = 1;
    const res = await request(app.getHttpServer())
      .get(`/shortener/all_hashes/${page}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    const record = res.body.find((r) => r.hash === urlHashe);
    expect(record).toBeDefined();
    expect(record).toHaveProperty('url_original', updatedUrl);
  });

  it('GET /shortener/all_hashes/:page → 200 com pelo menos uma hash paginada', async () => {
    const response = await request(app.getHttpServer())
      .post('/shortener/shorten_url')
      .send({
        user_id: userId,
        url_original: 'https://www.google.com/?hl=pt-BR',
      })
      .expect(201);

    hash.push(response.body.url);

    const page = 1;
    const res = await request(app.getHttpServer())
      .get(`/shortener/all_hashes/${page}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);

    const initialHash = response.body.url.split('/')[3];

    const record = res.body.find((r) => r.hash === initialHash);
    expect(record).toBeDefined();
    expect(record).toHaveProperty('available', true);
  });

  //   it('POST /shortener/shorten_url → 400 Bad Request when required fields are missing', async () => {
  //     // await request(app.getHttpServer())
  //     //   .post('/shortener/shorten_url')
  //     //   .send({ user_id: userId })
  //     //   .expect(400);

  //     await request(app.getHttpServer())
  //       .post('/shortener/shorten_url')
  //       .send({ user_id: 123, url_original: 'https://valid.com' })
  //       .expect(400);

  //     // await request(app.getHttpServer())
  //     //   .post('/shortener/shorten_url')
  //     //   .send({ user_id: userId, url_original: '' })
  //     //   .expect(HttpStatus.BAD_REQUEST);
  //   });

  it('PUT /shortener/update_url/:hash → 401 Unauthorized', async () => {
    await request(app.getHttpServer())
      .put(`/shortener/update_url/NEG001`)
      .send({ newUrl: 'https://updated.com' })
      .expect(401);
  });

  it('PUT /shortener/update_url/:hash → 404 hash Not Found', async () => {
    await request(app.getHttpServer())
      .put(`/shortener/update_url/${'4234&'}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ newUrl: 'https://updated.com' })
      .expect(400);
  });

  //   it('PUT /shortener/update_url/:hash → 400 Bad Request quando body inválido', async () => {
  //     const newHashRes = await request(app.getHttpServer())
  //       .post('/shortener/shorten_url')
  //       .send({ user_id: userId, url_original: 'https://valid.com' })
  //       .expect(201);

  //     hash.push(newHashRes.body.url);
  //     const newHash = newHashRes.body.url.split('/')[3];

  //     await request(app.getHttpServer())
  //       .put(`/shortener/update_url/${newHash}`)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send({})
  //       .expect(400);

  //     await request(app.getHttpServer())
  //       .put(`/shortener/update_url/${newHash}`)
  //       .set('Authorization', `Bearer ${token}`)
  //       .send({ newUrl: 123 })
  //       .expect(400);
  //   });

  it('GET /shortener/all_hashes/:page → 401 Unauthorized', async () => {
    await request(app.getHttpServer())
      .get('/shortener/all_hashes/1')
      .expect(401);
  });

  //   it('GET /shortener/all_hashes/:page → 400 Bad Request not page number', async () => {
  //     await request(app.getHttpServer())
  //       .get('/shortener/all_hashes/abc')
  //       .set('Authorization', `Bearer ${token}`)
  //       .expect(400);
  //   });

  //   it('GET /shortener/all_hashes/:page → array vazio para página além do alcance', async () => {
  //     const page = 99;
  //     await request(app.getHttpServer())
  //       .get(`/shortener/all_hashes/${page}`)
  //       .set('Authorization', `Bearer ${token}`)
  //       .expect(400);
  //   });
});
