// sample.test.ts
import { assert, expect } from 'chai';
import app from '../index';

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

  // Add more tests as needed

  after(async () => {
    // Close the app after all tests
    await server.close();
  });
});