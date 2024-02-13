// sample.test.ts
import chai, { assert } from 'chai';
import app from '../index';
import request from 'supertest';
const expect = chai.expect;

  describe('getActions()', () => {
    
    it('With params: should return 200', async () => {
        // Make request
        const params = `?XXX_KAZE=1&display=["ACT_NUMERO","PCF_CODE","CCT_NUMERO","ACT_OBJET","ACT_TYPE","ACT_DESC","ACT_DATE","ACT_DATFIN", "ACT_DATECH", "XXX_KZDT", "XXX_KZIDM", "XXX_KAZE"]`;
        const result: any = await request(app).get(`/api/v1/gestimum/actions/${params}`)
        // Expect result
        assert.equal(result.status, 200);
        expect(result.body.actions).to.be.an('array');
      });
  
  });

  //gettTier()
  // describe('getTiers()', () => {

  //   it('Should return 200', async () => {
  //     // Make request
  //     const result = await request(app).get(`/api/v1/gestimum/getTiers/DAMIE001`)
  //     // Expect result
  //     expect(result.body.client).to.be.an('object');
  //     assert.equal(result.status, 200);
  //   });

  // });

  // //getContact()
  // describe('getContact()', () => {
  
  //   it('Should return 200', async () => {
  //     // Make request
  //     const result = await request(app).get(`/api/v1/gestimum/getContact/0001183749`)
  //     // Expect result*
  //     expect(result.body.utilisateur).to.be.an('object');
  //     assert.equal(result.status, 200);
  //   });

  // });



  
  


