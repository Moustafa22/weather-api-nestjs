import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateLocationDto } from '../src/location/dto/create-location.dto';

describe('LocationController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;

  const userInfo = {
    firstName: 'moustafa',
    lastName: 'allahham',
    email: 'iteng.moustafa@gmai2l.com',
    username: 'moustafa221',
    password: 'eQ@qqqqq',
  };

  const createLocationDto: CreateLocationDto = { city: 'TestLocation' };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();

    // Register and get the token
    const response = await request(app.getHttpServer()).post('/auth/register').send(userInfo).expect(201);
    accessToken = response.body.data.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/location (POST) - success', async () => {
    const response = await request(app.getHttpServer())
      .post('/location')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createLocationDto)
      .expect(201);

    expect(response.body.data.city).toBe(createLocationDto.city);
  });

  it('/locations (GET) - success', async () => {
    const response = await request(app.getHttpServer()).get('/location').set('Authorization', `Bearer ${accessToken}`).expect(200);

    expect(response.body.data).toEqual(expect.any(Array));
    expect(response.body.data[0].city).toBe(createLocationDto.city);
  });

  it('/location (POST) - without token', async () => {
    await request(app.getHttpServer())
      .post('/location')
      .send(createLocationDto)
      .expect(401) // Unauthorized
      .expect((res) => {
        expect(res.body.message).toBe('Unauthorized');
      });
  });

  it('/location (POST) - without body', async () => {
    await request(app.getHttpServer())
      .post('/location')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(400) // Bad Request due to missing required fields
      .expect((res) => {
        expect(res.body.message).toEqual(
          expect.arrayContaining([
            'city should not be empty',
            'city must have atmost 50 characters.',
            'city must have atleast 2 characters.',
            'city must contain only letters (a-zA-Z)',
          ]),
        );
      });
  });

  it('/location (POST) - with invalid body', async () => {
    await request(app.getHttpServer())
      .post('/location')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ city: 123 })
      .expect(400)
      .expect((res) => {
        expect(res.body.message).toEqual(
          expect.arrayContaining([
            'city must have atmost 50 characters.',
            'city must have atleast 2 characters.',
            'city must contain only letters (a-zA-Z)',
          ]),
        );
      });
  });
});
