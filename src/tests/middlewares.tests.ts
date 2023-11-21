import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index';
import validateData from '../utils/validData';
import express, {Request, Response} from 'express';

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
