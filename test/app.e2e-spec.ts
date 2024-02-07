import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import * as path from 'path';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Should endpoint /unique-houses return 3', () => {
    return request(app.getHttpServer())
      .post('/unique-houses')
      .attach('file', path.resolve(__dirname, './testFiles/dataset-1.csv'), {
        filename: 'dataset-1.csv',
        contentType: 'text/csv',
      })
      .expect(201)
      .expect('3');
  });

  it('Should endpoint /unique-houses return 1', () => {
    return request(app.getHttpServer())
      .post('/unique-houses')
      .attach('file', path.resolve(__dirname, './testFiles/dataset-2.csv'), {
        filename: 'dataset-2.csv',
        contentType: 'text/csv',
      })
      .expect(201)
      .expect('1');
  });

  it('Should throw 400 error if file is not attached', () => {
    return request(app.getHttpServer()).post('/unique-houses').expect(400);
  });

  it('Should throw 415 error if file is pdf type', () => {
    return request(app.getHttpServer())
      .post('/unique-houses')
      .attach('file', path.resolve(__dirname, './testFiles/dataset-1.csv'), {
        filename: 'dataset.csv',
        contentType: 'application/pdf',
      })
      .expect(415);
  });
});
