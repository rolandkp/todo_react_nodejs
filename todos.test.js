const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../index');

chai.use(chaiHttp);
const expect = chai.expect;

describe('Todos API', () => {
  it('should return all todos', (done) => {
    chai
      .request(app)
      .get('/todos')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a new todo', (done) => {
    chai
      .request(app)
      .post('/todos')
      .send({ title: 'New Todo', description: 'Sample description' })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('id');
        expect(res.body.title).to.equal('New Todo');
        expect(res.body.description).to.equal('Sample description');
        expect(res.body.completed).to.be.false;
        done();
      });
  });
});
