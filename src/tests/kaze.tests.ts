// sample.test.ts
import { assert } from 'chai';
import app from '../index';
import axios from 'axios';
import { login } from '../scripts/api.functions';
import request from 'supertest';


//test login
describe('login()', () => {
    
    it('Should return 200', async () => {
      const result = await request(app).post(`/api/v1/kaze/login`)
      // Expect result
      assert.equal(result.status, 200);
    });
  
});


//getFinishedJobs
  describe('getFinishedJobs()', () => {
    
    it('Should return 200', async () => {
      await login();
      // Make request
        const body: Object = {
            filter: {
                status: "completed",
            }
        }
        const result = await request(app)
        .get(`/api/v1/kaze/getJobs/`)
        .set('Content-Type', 'application/json') // Add any headers you need
        .send({body});
      // Expect result
      assert.equal(result.status, 200);
    });

  });

  

  


