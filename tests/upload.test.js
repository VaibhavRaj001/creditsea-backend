const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
let app;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  app = require('../src/server');
  // wait for connection (server's promise handles that)
  await new Promise(resolve => setTimeout(resolve, 500));
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

test('upload invalid file returns 400', async () => {
  const res = await request(app)
    .post('/api/upload')
    .attach('file', Buffer.from('not xml'), { filename: 'test.txt' });
  expect(res.statusCode).toBe(400);
});

test('upload valid xml returns 201 and id', async () => {
  const sampleXml = `<?xml version="1.0"?>
  <ExperianSoftPull>
    <Subject>
      <Name>John Doe</Name>
      <Mobile>+911234567890</Mobile>
      <PAN>ABCDE1234F</PAN>
    </Subject>
    <CreditScore>750</CreditScore>
    <Summary>
      <TotalAccounts>2</TotalAccounts>
      <ActiveAccounts>1</ActiveAccounts>
      <ClosedAccounts>1</ClosedAccounts>
      <CurrentBalance>5000</CurrentBalance>
      <SecuredAmount>2000</SecuredAmount>
      <UnsecuredAmount>3000</UnsecuredAmount>
      <Last7DaysEnquiries>0</Last7DaysEnquiries>
    </Summary>
    <Accounts>
      <Account>
        <Type>Credit Card</Type>
        <Bank>Bank A</Bank>
        <AccountNumber>1234</AccountNumber>
        <AmountOverdue>0</AmountOverdue>
        <CurrentBalance>2000</CurrentBalance>
        <Secured>false</Secured>
      </Account>
    </Accounts>
  </ExperianSoftPull>`;
  const res = await request(app)
    .post('/api/upload')
    .attach('file', Buffer.from(sampleXml), { filename: 'sample.xml' });
  expect(res.statusCode).toBe(201);
  expect(res.body.id).toBeDefined();
});
