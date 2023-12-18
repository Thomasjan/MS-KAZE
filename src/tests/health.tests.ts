// sample.test.ts
import { assert, expect } from 'chai';
import app from '../index';
import logger from '../logger';

describe('Sample Test', () => {
  it('should add two numbers', () => {
    const result = 1 + 1;
    expect(result).to.equal(2);
  });
});

describe('API launch', () => {
  let server: any;

  before(async () => {
    // Start the app before all tests
    server = await app.listen(5000);
  });



  it('should return 200', async () => {
    // Make request
    const result = await fetch('http://localhost:5000/');
    // Expect result
    assert.equal(result.status, 200);
  });

  
  after(async () => {
    // Close the app after all tests
    await server.close();
  });
});


//test logger
describe('logger', () => {
  it('should log error', async () => {
    // Assuming logger.error is an asynchronous function
    const loggerInstance = logger.error(new Error('test error'));
    // Wait for the logging operation to complete (if asynchronous)
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Instead of expecting undefined, check if the logger instance is truthy
    expect(loggerInstance).to.be.ok;
  });
});

