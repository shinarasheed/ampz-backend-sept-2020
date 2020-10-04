import chai from 'chai';
import chaiHttp from 'chai-http';
import Sinonchai from 'sinon-chai';
import sinon from 'sinon';
import path from 'path';
import app from '../index';
import Helper from '../utils/user.utils';
import Auth from '../db/models/users.model';
import PostController from '../controllers/post.controller';
import PostServices from '../services/post.services';

chai.should();
chai.use(Sinonchai);
chai.use(chaiHttp);

let postToken;
let postId;
let mediaUrl;

describe('Post Route Endpoint', () => {
  describe('POST api/v1/post', () => {
    before((done) => {
      Auth.findOne({ email: 'okwuosachijioke1@gmail.com' }, (err, myuser) => {
        if (myuser) {
          (async () => {
            postToken = await Helper.generateToken(
              myuser._id,
              myuser._role,
              myuser.userName
            );
          })();
          done();
        }
      });
    });
    it('should not create post if the user does not supply a token', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=post')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create post if the token is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=post')
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not create post if the file type is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=post')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'POST CAPTION')
        .field('description', 'POST DESCRIPTION')
        .attach('media', path.resolve(__dirname, '../assets/img/svgimage.svg'))
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create post if the file type is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=academy')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', ' TEST ACADEMY CAPTION')
        .field('description', 'TEST ACADEMY DESCRIPTION')
        .attach('media', path.resolve(__dirname, '../assets/img/svgimage.svg'))
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not create post if the file type is invalid', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=event')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'TEST EVENT CAPTION')
        .field('description', 'TEST EVENT DESCRIPTION')
        .field('eventType', 'Football event')
        .field('sport', 'Football')
        .field('minAge', '16')
        .field('maxAge', '20')
        .field('country', 'Nigeria')
        .field('state', 'Lagos')
        .field('venue', 'Yaba')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/svgimage.svg'))
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should create post if post fields are submitted', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=post')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'TEST POST CAPTION')
        .field('description', 'TEST POST DESCRIPTION')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/img3.jpg'))
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should create post if virtual academy post fields are submitted', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=academy')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'TEST ACADEMY CAPTION')
        .field('description', 'TEST ACADEMY DESCRIPTION')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/image2.jpg'))
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('should create post if events post fields are submitted', (done) => {
      chai
        .request(app)
        .post('/api/v1/post?category=event')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'TEST EVENT CAPTION')
        .field('description', 'TEST EVENT DESCRIPTION')
        .field('eventType', 'Football event')
        .field('sport', 'Football')
        .field('minAge', '16')
        .field('maxAge', '20')
        .field('country', 'Nigeria')
        .field('state', 'Lagos')
        .field('venue', 'Yaba')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/image1.jpg'))
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('Should fake server error', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostController.createPost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('GET api/v1/post/', () => {
    it('should get all post, events and virtual coach posts', (done) => {
      chai
        .request(app)
        .get('/api/v1/post/')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('Should fake server error', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostController.getPosts(req, res);
      res.status.should.have.callCount(0);
      done();
    });
  });
  describe('PUT api/v1/post/:postId', () => {
    before((done) => {
      chai
        .request(app)
        .post('/api/v1/post')
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'UPDATE POST')
        .field('description', 'UPDATE POST DESCRIPTION')
        .field('eventType', 'Football event')
        .field('sport', 'Football')
        .field('minAge', '16')
        .field('maxAge', '20')
        .field('country', 'Nigeria')
        .field('state', 'Lagos')
        .field('venue', 'Yaba')
        .field('tags', 'football, lagos, event')
        .attach('media', path.resolve(__dirname, '../assets/img/image1.jpg'))
        .end((err, res) => {
          postId = res.body.data._id;
          done();
        });
    });
    it('should not update post if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/${postId}`)
        .field('description', 'UPDATE POST DESCRIPTION')
        .field('eventType', 'Football event')
        .attach('media', path.resolve(__dirname, '../assets/img/image1.jpg'))
        .field(
          'mediaUrl',
          'https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782'
        )
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not update post if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/${postId}`)
        .set('token', 'invalid token')
        .field('description', 'UPDATE POST DESCRIPTION')
        .field('eventType', 'Football event')
        .attach('media', path.resolve(__dirname, '../assets/img/image1.jpg'))
        .field(
          'mediaUrl',
          'https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782'
        )
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
        });
    });
    it('should not update post if the file type is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/${postId}`)
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'POST CAPTION')
        .field('description', 'POST DESCRIPTION')
        .attach('media', path.resolve(__dirname, '../assets/img/svgimage.svg'))
        .field(
          'mediaUrl',
          'https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782'
        )
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('400 Invalid Request');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should update post if update fields are supplied', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/${postId}`)
        .set('token', postToken)
        .set('Content-Type', 'multipart/form-data')
        .set('Connection', 'keep-alive')
        .field('caption', 'TEST POST CAPTION')
        .attach('media', path.resolve(__dirname, '../assets/img/img3.jpg'))
        .field(
          'mediaUrl',
          'https://ampz-backend-sept.s3-us-west-1.amazonaws.com/1601135199782'
        )
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('data');
          done();
        });
    });
    it('Should fake server error', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostController.updatePost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('PUT api/v1/post/like/:postId', () => {  
    it('should not like or unlike post if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/like/${postId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not like or unlike post if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/like/${postId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
      });
    });
    it('should like a post if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/like/${postId}`)
        .set('token', postToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message');
          done();
        });
    });
    it('should unlike a post if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/like/${postId}`)
        .set('token', postToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message');
          done();
        });
    });
    it('Should fake server error', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostController.likePost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('PUT api/v1/post/bookmark/:postId', () => {  
    it('should not bookmark or remove post if the user does not supply a token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/bookmark/${postId}`)
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error');
          done();
        });
    });
    it('should not bookmark or remove post if the token is invalid', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/bookmark/${postId}`)
        .set('token', 'invalid token')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('401 Unauthorized');
          res.body.should.have.property('error').eql('Access token is Invalid');
          done();
      });
    });
    it('should bookmark a post if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/bookmark/${postId}`)
        .set('token', postToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message');
          done();
        });
    });
    it('should remove bookamrk from a post if a user supplies valid token', (done) => {
      chai
        .request(app)
        .put(`/api/v1/post/bookmark/${postId}`)
        .set('token', postToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.an('object');
          res.body.should.have.property('status').eql('success');
          res.body.should.have.property('message');
          done();
        });
    });
    it('Should fake server error', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostController.bookmarkPost(req, res);
      res.status.should.have.callCount(1);
      done();
    });
  });
  describe('Post Services Mock', () => {
    it('Should fake server error on likedByUser function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.likedByUser(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on unlike function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.unLike(req, res);
      res.status.should.have.callCount(0);
      done();
    });   
    it('Should fake server error on like function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.like(req, res);
      res.status.should.have.callCount(0);
      done();
    });   
    it('Should fake server error on likedByUser function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.bookmarkedByUser(req, res);
      res.status.should.have.callCount(0);
      done();
    });
    it('Should fake server error on unlike function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.bookmark(req, res);
      res.status.should.have.callCount(0);
      done();
    });   
    it('Should fake server error on like function', (done) => {
      const req = { body: {} };
      const res = {
        status() {},
        send() {},
      };
      sinon.stub(res, 'status').returnsThis();
      PostServices.removeBookmark(req, res);
      res.status.should.have.callCount(0);
      done();
    });   
  });
    

  
});
