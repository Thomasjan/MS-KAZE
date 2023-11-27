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

