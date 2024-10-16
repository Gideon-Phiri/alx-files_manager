import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

chai.use(chaiHttp);
const { expect } = chai;

let token;
let fileId;

describe('Files', () => {
  before((done) => {
    // Login the user and get the token
    const credentials = Buffer.from('testuser@example.com:testpass').toString('base64');
    chai.request(server)
      .get('/connect')
      .set('Authorization', `Basic ${credentials}`)
      .end((err, res) => {
        token = res.body.token;
        done();
      });
  });

  it('should upload a new file', (done) => {
    chai.request(server)
      .post('/files')
      .set('X-Token', token)
      .send({
        name: 'testfile.txt',
        type: 'file',
        data: Buffer.from('Hello World!').toString('base64')
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        fileId = res.body.id;
        done();
      });
  });

  it('should retrieve the file information by ID', (done) => {
    chai.request(server)
      .get(`/files/${fileId}`)
      .set('X-Token', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('name');
        done();
      });
  });

  it('should list files with pagination', (done) => {
    chai.request(server)
      .get('/files')
      .set('X-Token', token)
      .query({ page: 0 })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should publish a file', (done) => {
    chai.request(server)
      .put(`/files/${fileId}/publish`)
      .set('X-Token', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('isPublic').eql(true);
        done();
      });
  });

  it('should unpublish a file', (done) => {
    chai.request(server)
      .put(`/files/${fileId}/unpublish`)
      .set('X-Token', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('isPublic').eql(false);
        done();
      });
  });

  it('should retrieve the file data', (done) => {
    chai.request(server)
      .get(`/files/${fileId}/data`)
      .set('X-Token', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.text).to.equal('Hello World!');
        done();
      });
  });
});
