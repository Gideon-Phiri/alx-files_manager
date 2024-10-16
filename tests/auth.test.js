import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server';

chai.use(chaiHttp);
const { expect } = chai;

let token;
let userId;

describe('Authentication', () => {
  it('should create a new user', (done) => {
    chai.request(server)
      .post('/users')
      .send({ email: 'testuser@example.com', password: 'testpass' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('email');
        userId = res.body.id;
        done();
      });
  });

  it('should log in the user and return a token', (done) => {
    const credentials = Buffer.from('testuser@example.com:testpass').toString('base64');
    chai.request(server)
      .get('/connect')
      .set('Authorization', `Basic ${credentials}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        token = res.body.token;
        done();
      });
  });

  it('should get the user information using the token', (done) => {
    chai.request(server)
      .get('/users/me')
      .set('X-Token', token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('email');
        done();
      });
  });

  it('should log out the user and invalidate the token', (done) => {
    chai.request(server)
      .get('/disconnect')
      .set('X-Token', token)
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });
});
