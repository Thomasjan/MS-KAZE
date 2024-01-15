import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import validateData from '../utils/validData';
import express, {Request, Response} from 'express';

import exempleJson from '../data/worflowID';
import jsonMapper from '../utils/jsonMapper';

chai.use(chaiHttp);
const { expect } = chai;

describe('validateData Middleware', () => {
  // Mock Express app for testing middleware
  const testApp = require('express')();
  testApp.use(express.json()); // Add middleware to parse JSON requests
  testApp.post('/testRoute', validateData(['username', 'email']), (req: Request, res: Response) => {
    res.status(200).json({ success: true });
  });

  it('should return 400 for missing fields', (done) => {
    chai.request(testApp)
      .post('/testRoute')
      .send({ username: 'thomas' }) // Missing email field
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.have.property('error').that.includes('Missing required fields');
        done();
      });
  });

  it('should pass validation for valid data', (done) => {
    chai.request(testApp)
      .post('/testRoute')
      .send({ username: 'testUser', email: 'test@example.com' }) // Valid data with required fields
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success').that.equals(true);
        done();
      });
  });
});


//jsonMapper Middleware
describe('jsonMapper Middleware', () => {

  const fields: Object = {
      ACT_NUMERO: 'test_ACT_NUMERO',
      PCF_CODE: 'test_PCF_CODE',
      CCT_NUMERO: 'test_CCT_NUMERO',
      ACT_OBJET: 'test_ACT_OBJET',
      ACT_TYPE: 'test_ACT_TYPE',
      ACT_DESC: 'test_ACT_DESC',
      ACT_DATE: 'test_ACT_DATE',
      ACT_DATFIN: 'test_ACT_DATFIN',
      ACT_DATECH: 'test_ACT_DATECH',
      PCF_RS: 'test_PCF_RS',
      PCF_EMAIL: 'test_PCF_EMAIL',
      PCF_VILLE: 'test_PCF_VILLE',
      PCF_CP: 'test_PCF_CP',
      PCF_RUE: 'test_PCF_RUE',
      CCT_NOM: 'test_CCT_NOM',
      CCT_PRENOM: 'test_CCT_PRENOM',
      CCT_EMAIL: 'test_CCT_EMAIL',
      CCT_TELM: 'test_CCT_TELM',
  }

  const json: Object = exempleJson;

  const expectedjson = {
    "workflow_id": "1ae90d89-d1ac-4ce3-a297-995d64ebab10",
    "target_id": "my-company-id",
    "data": {
        "f8816f82-3393-49f4-af78-fbc5d8616cd4": {
            "f8816f82-3393-49f4-af78-fbc5d8616cd4": {
                "job_title": "test_ACT_OBJET",
                "job_reference": "test_ACT_NUMERO",
                "job_address": "test_PCF_RUE",
                "job_due_date": "test_ACT_DATECH"
            },
            "code_client":{
                "data": "test_PCF_CODE"
            },
            "raison_sociale":{
                "data": "test_PCF_RS"
            },
            "nom_contact":{
                "data": "test_CCT_NOM"
            },
            "prenom_contact":{
                "data": "test_CCT_PRENOM"
            },
            "email_contact":{
                "data": "test_CCT_EMAIL"
            },
            "tel_contact":{
                "data": "test_CCT_TELM"
            },
            "type_mission":{
                "data": "test_ACT_TYPE"
            }
        },
        "9cf4cd30-7eed-4c3d-8269-dc32e0928b20":{
            "job_description": {
                "data": "test_ACT_DESC"
            }
        },
        "d25d01b9-dd3b-4030-97ac-bc0f86ac9d7f": {
            "d25d01b9-dd3b-4030-97ac-bc0f86ac9d7f": {
                "city": "test_PCF_VILLE",
                "country_code": "fr",
                "zip_code": "test_PCF_CP",
                "beneficiary_phone": "test_CCT_TELM",
                "address": "test_PCF_RUE",
                "details": "détails adress batiment 1 ..."
            }
        }
    }
}
    

  it('should return the expected JSON', (done) => {
  const newjson = jsonMapper(json, fields);

  expect(newjson).to.deep.equal(expectedjson);
  done();
  });

});
        

