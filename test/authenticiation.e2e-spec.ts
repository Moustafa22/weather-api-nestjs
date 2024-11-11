import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  const userInfo = {
    firstName: 'moustafa',
    lastName: 'allahham',
    email: 'iteng.moustafa@gmai2l.com',
    username: 'moustafa221',
    password: 'eQ@qqqqq',
  };

  const userInfoInvalid = {
    firstName: '2',
    lastName: '1',
    username: 'moustafa221',
    password: 'eQ@qqqqq',
  };

  const loginInfo = {
    username: 'moustafa221',
    password: 'eQ@qqqqq',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('Should Register', async () => {
    const response = await request(app.getHttpServer()).post('/auth/register').send(userInfo).expect(201);

    expect(response.body.data.access_token).toBeDefined();
    expect(response.body.data.access_token).not.toBeNull();
    expect(response.body.data.access_token).not.toEqual('');
    expect(response.body.data.user.username).toBe(userInfo.username);

    // check email/username taken
    request(app.getHttpServer()).post('/auth/register').send(userInfo).expect(401);
  });

  it('Logs in', async () => {
    const loginRepsonse = await request(app.getHttpServer()).post('/auth/login').send(loginInfo).expect(200);
    expect(loginRepsonse.body.data.access_token).toBeDefined();
    expect(loginRepsonse.body.data.access_token).not.toBeNull();
    expect(loginRepsonse.body.data.access_token).not.toEqual('');
    expect(loginRepsonse.body.data.user.username).toBe(loginInfo.username);
  });
});
