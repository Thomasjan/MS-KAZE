// sample.test.ts
import { assert } from 'chai';
import app from '../index';
import axios from 'axios';
import { login } from '../scripts/api.functions';



//test login
describe('login()', () => {
    let server: any;
  
    before(async () => {
      // Start the app before all tests
      server = await app.listen(5000);
    });
  
    it('Should return 200', async () => {
      const result = await axios.post('http://localhost:3000/api/v1/kaze/login')
      // Expect result
      assert.equal(result.status, 200);
    });
  
    after(async () => {
      // Close the app after all tests
      await server.close();
    });
});


//getFinishedJobs
  describe('getFinishedJobs()', () => {
    let server: any;
  
    before(async () => {
      // Start the app before all tests
      server = await app.listen(5000);
    });
  
    
   
  
    it('Should return 200', async () => {
      await login();
      // Make request
        const body: Object = {
            filter: {
                status: "in_progress", //TODO: change to "finished"
            }
        }
        const result = await axios.get(`http://localhost:3000/api/v1/kaze/getJobs/`, {
            headers: {
                "Content-Type": "application/json"
            },
            data: body
        });
      // Expect result
      assert.equal(result.status, 200);
    });

  
    after(async () => {
      // Close the app after all tests
      await server.close();
    });
  });

  

  


