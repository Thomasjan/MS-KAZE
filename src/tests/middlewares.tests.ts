import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import validateData from '../utils/validData';
import express, {Request, Response} from 'express';

import exempleJson from '../data/workflow_exemple';
import jsonMapper from '../utils/jsonMapper';
import exp from 'constants';
import { assert } from 'console';

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
      XXX_IDMKZ: 'test_XXX_IDMKZ',
  }

  const json: Object = exempleJson;

  const expectedjson = 
    {
      "target_id": "company_id",
      "workflow":{
          "type": "workflow",
          "id": "root",
          "children": [
            
            {
              "type": "template_job_info",
              "id": "template_info",
              "label": "Résumé mission",
              "access": 133,
              "generate_documents": [
        
              ],
              "city": "test_PCF_VILLE",
              "state": "IDF",
              "country_code": "fr",
              "zip_code": "test_PCF_CP",
              "job_title": "test_ACT_OBJET",
              "job_reference": "test_ACT_NUMERO",
              "job_address": "test_PCF_RUE",
              "performer_estimation": 60,
              "files": [
        
              ],
              "children": [
                {
                  "type": "section",
                  "id": "template_section",
                  "direction": "col",
                  "children": [
                    {
                      "type": "widget_text",
                      "id": "template_type",
                      "label": "Code Type d'intervention",
                      "access": 133,
                      "data_type": "string",
                      "data": "test_ACT_TYPE"
                    },
                    {
                      "type": "widget_client",
                      "id": "template_client",
                      "label": "Client",
                      "access": 133,
                      "city": "test_PCF_VILLE",
                      "country_code": "fr",
                      "zip_code": 0,
                      "client_type": "regular",
                      "name": "test_PCF_RS",
                      "email": "test_PCF_EMAIL",
                      "address_title": "test_PCF_RUE",
                      "address": "test_PCF_RUE",
                  },
                  {
                    "type": "widget_text",
                    "id": "template_contact_num",
                    "label": "Numéro de téléphone",
                    "access": 133,
                    "data_type": "phone",
                  },
                  {
                    "type": "widget_text",
                    "id": "template_description",
                    "label": "Descriptif",
                    "access": 133,
                    "data_type": "string",
                    "data": "test_ACT_DESC"
                  }
                  ]
                }
              ]
            }
          ]
      }
    }

  it('should return the expected JSON', (done) => {
  const newjson = jsonMapper(json, fields);

  expect(newjson).to.deep.equal(expectedjson);
  done();
  });

});
        

