// sample.test.ts
import { assert, expect } from 'chai';
import app from '../index';


describe('getAffaires()', () => {
    let server: any;
  
    before(async () => {
      // Start the app before all tests
      server = await app.listen(5000);
    });
  
  
    it('Without Params: should return 200', async () => {
      // Make request
      const result = await fetch('http://localhost:5000/api/v1/gestimum/affaires/');
      // Expect result
      assert.equal(result.status, 200);
    });

    it('With params: should return 200', async () => {
        // Make request
        const result = await fetch('http://localhost:5000/api/v1/gestimum/affaires/?PCF_CODE=DAMIE001');
        // Expect result
        assert.equal(result.status, 200);
      });
  
    
  
    // Add more tests as needed
  
    after(async () => {
      // Close the app after all tests
      await server.close();
    });
  });

  describe('getActions()', () => {
    let server: any;
  
    before(async () => {
      // Start the app before all tests
      server = await app.listen(5000);
    });
  
  

    it('With params: should return 200', async () => {
        // Make request
        const params = `?XXX_KAZE=1&display=["ACT_NUMERO","PCF_CODE","CCT_NUMERO","ACT_OBJET","ACT_TYPE","ACT_DESC","ACT_DATE","ACT_DATFIN", "ACT_DATECH", "XXX_DTKZ", "XXX_IDMKZ", "XXX_KAZE"]`;
        const result = await fetch(`http://localhost:5000/api/v1/gestimum/actions/${params}`);
        // Expect result
        assert.equal(result.status, 200);
      });
  
    
  
    // Add more tests as needed
  
    after(async () => {
      // Close the app after all tests
      await server.close();
    });
  });

  //gettTier()
  describe('getTier()', () => {
    let server: any;
  
    before(async () => {
      // Start the app before all tests
      server = await app.listen(5000);
    });
  
  
  
    it('Should return 200', async () => {
      // Make request
      const result = await fetch('http://localhost:5000/api/v1/gestimum/getTier/DAMIE001');
      // Expect result
      assert.equal(result.status, 200);
    });

  
    after(async () => {
      // Close the app after all tests
      await server.close();
    });
  });

  //getContact()
  describe('getContact()', () => {
    let server: any;
  
    before(async () => {
      // Start the app before all tests
      server = await app.listen(5000);
    });
  
  
  
    it('Should return 200', async () => {
      // Make request
      const result = await fetch('http://localhost:5000/api/v1/gestimum/getContact/0001183749');
      // Expect result
      assert.equal(result.status, 200);
    });

  
    after(async () => {
      // Close the app after all tests
      await server.close();
    });
  });

  


