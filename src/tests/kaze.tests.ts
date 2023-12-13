// sample.test.ts
import { assert, expect } from 'chai';
import app from '../index';
import axios from 'axios';



  //getFinishedJobs
//   describe('getFinishedJobs()', () => {
//     let server: any;
  
//     before(async () => {
//       // Start the app before all tests
//       server = await app.listen(5000);
//     });
  
  
  
//     it('Should return 200', async () => {
//       // Make request
//         const body: Object = {
//             filter: {
//                 status: "in_progress", //TODO: change to "finished"
//             }
//         }
//       const result = await axios.get(`http://localhost:3000/api/v1/kaze/getJobs/`, {
//         headers: {
//             "Content-Type": "application/json"
//         },
//         data: body
//     });
//       // Expect result
//       assert.equal(result.status, 200);
//     });

  
//     after(async () => {
//       // Close the app after all tests
//       await server.close();
//     });
//   });

  

  


