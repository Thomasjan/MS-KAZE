// sample.test.ts
import { expect } from 'chai';
import app from '../index';

describe('Sample Test', () => {
  it('should add two numbers', () => {
    const result = 1 + 1;
    expect(result).to.equal(2);
  });
});

describe('API lauch', () => {
  it('should return 200', async () => {
    //start the app
    await app.listen(5000);
    //make request
    const result = await fetch('http://localhost:5000/');
    //expect result
    expect(result.status).to.equal(200);
    ;
  });
});
