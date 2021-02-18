import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Movie } from './entities/movie.entity';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("getAll()  :", ()=>{

    it("should return an array" , ()=>{
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });


  });


  describe("getOne()  :", ()=>{
    
    it("should return a movie" , ()=>{    
      service.create({
        title : "Test Movie",
        genres : ["test"] , 
        year : 2000,
      }); 
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
    });

    it("should throw 404 error", ()=>{
       try{
          service.getOne(999);
       }catch(e){
         expect(e).toBeInstanceOf(NotFoundException);
         expect(e.message).toEqual("Movie id 999 Not Found");
       }
    });
  });


  describe("deleteOne()  :", ()=>{
    
    it("delete a movie" , ()=>{    
      service.create({
        title : "Test Movie",
        genres : ["test"] , 
        year : 2000,
      }); 
      const beforDelete = service.getAll().length; 
      service.deleteOne(1);
      const afterDelete = service.getAll().length; 
      expect(afterDelete).toBeLessThan(beforDelete);     
    });
    
    it("should throw 404 error", ()=>{
       try{
          service.deleteOne(999);
       }catch(e){
         expect(e).toBeInstanceOf(NotFoundException);
         expect(e.message).toEqual("Movie id 999 Not Found");
       }
    });
    
    

  });

  describe("create()  :", ()=>{
    
    it("should create a movie" , ()=>{        
      const beforCreate = service.getAll().length; 
      service.create({
        title : "Test Movie",
        genres : ["test"] , 
        year : 2000,
      }); 
      const afterCreate = service.getAll().length; 
      expect(afterCreate).toBeGreaterThan(beforCreate);     
    });  
  
  });

  describe("update()  :", ()=>{
    
    

    it("should update a movie" , ()=>{      
      service.create({
        title : "Test Movie",
        genres : ["test"] , 
        year : 2000,
      }); 

      const beforeMovie = service.getOne(1);      
      const updateTitle = "Avengers" ;
      service.update(1, {
        title : updateTitle
      });
      const AfterMovie = service.getOne(1)
      //업데이트가 반영되었는지 확인 필요.
      expect(AfterMovie.title).toEqual(updateTitle);
      //업데이트하는것 이외에는 변화가 없어야함.
      expect(beforeMovie.year).toEqual(AfterMovie.year);
    });  

    it("should throw 404 error", ()=>{
      try{
        
        service.create({
          title : "Test Movie",
          genres : ["test"] , 
          year : 2000,
        }); 

        service.update(999, { 
           title: "Avengers"
         });
      }catch(e){
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual("Movie id 999 Not Found");
      }
    });
   
  });
 

});
