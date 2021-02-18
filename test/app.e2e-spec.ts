import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    //실제 어플리케이션 환경 적용.
    app.useGlobalPipes(
      new ValidationPipe({
          whitelist : true, 
          forbidNonWhitelisted : true,
          transform : true ,
      })
    );

    await app.init();
    
  });

  describe('/movies', ()=>{
    it('GET', ()=>{
      return request(app.getHttpServer())
        .get("/movies")
        .expect(200)
        .expect([]);
    });

    it('POST 201', ()=>{
      return request(app.getHttpServer())
        .post("/movies")
        .expect(201)
        .send({
          "title" : "Avengers",
          "year" : 2018 ,
          "genres"  : ["Actiion"]
        })        
    });

    it('POST 400', ()=>{
      return request(app.getHttpServer())
        .post("/movies")
        .expect(400)
        .send({
          "title" : "Myname",
          "year" : 2018 ,
          "genres"  : ["Actiion"] ,
          "other" : "thing"
        })        
    });

    it('DELETE' , ()=>{
      return request(app.getHttpServer())
        .delete("/movies")
        .expect(404)       
    });  

  });

  describe('/movies/:id', ()=>{
    it("GET 200", ()=>{
      return request(app.getHttpServer())
        .get("/movies/1")
        .expect(200);
    })

    it("GET 404", ()=>{
      return request(app.getHttpServer())
        .get("/movies/999")
        .expect(404);
    })
    it("PATCH", ()=>{
      return request(app.getHttpServer())
        .patch("/movies/1")        
        .expect(200)
        .send({
          "title" : "Avengers2",         
        });
    })  
    it("DELETE" , ()=>{
      return request(app.getHttpServer())
        .delete("/movies/1")
        .expect(200);
    })
    

  });

  
});
