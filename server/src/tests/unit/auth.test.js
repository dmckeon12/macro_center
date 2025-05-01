import { expect } from 'chai';
import { describe, it } from 'mocha';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import mongoose from 'mongoose';
import sinon from 'sinon';
import { generateToken, verifyToken, generateAuthTokens } from '../../utils/token.js';
import config from '../../config/config.js';

describe('Auth Utils', () => {
  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      // Create a mock user ID
      const userId = new mongoose.Types.ObjectId().toString();
      const expires = moment().add(30, 'minutes');
      
      // Generate token
      const token = generateToken(userId, expires);
      
      // Verify token structure
      expect(token).to.be.a('string');
      
      // Decode and verify the token payload
      const decoded = jwt.verify(token, config.jwt.secret);
      expect(decoded.sub).to.equal(userId);
      expect(decoded.exp).to.equal(expires.unix());
      expect(decoded.iat).to.exist;
    });
  });
  
  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      // Create and sign a valid token
      const userId = new mongoose.Types.ObjectId().toString();
      const expires = moment().add(30, 'minutes');
      const token = jwt.sign(
        {
          sub: userId,
          iat: moment().unix(),
          exp: expires.unix(),
        },
        config.jwt.secret
      );
      
      // Verify the token
      const decoded = verifyToken(token);
      
      // Assertions
      expect(decoded).to.be.an('object');
      expect(decoded.sub).to.equal(userId);
    });
    
    it('should throw an error for an invalid token', () => {
      const invalidToken = 'invalid-token';
      
      // Wrap the verifyToken call in a function for the expect().to.throw() check
      const verifyInvalidToken = () => verifyToken(invalidToken);
      
      // Assert that an error is thrown
      expect(verifyInvalidToken).to.throw();
    });
    
    it('should throw an error for an expired token', () => {
      // Create an expired token
      const userId = new mongoose.Types.ObjectId().toString();
      const expires = moment().subtract(1, 'hour'); // Token expired 1 hour ago
      const token = jwt.sign(
        {
          sub: userId,
          iat: moment().subtract(2, 'hours').unix(),
          exp: expires.unix(),
        },
        config.jwt.secret
      );
      
      // Wrap the verifyToken call in a function for the expect().to.throw() check
      const verifyExpiredToken = () => verifyToken(token);
      
      // Assert that an error is thrown
      expect(verifyExpiredToken).to.throw();
    });
  });
  
  describe('generateAuthTokens', () => {
    it('should generate access and refresh tokens', async () => {
      // Mock user
      const user = {
        id: new mongoose.Types.ObjectId().toString(),
        role: 'user',
      };
      
      // Use sinon to spy on generateToken
      const generateTokenSpy = sinon.spy(generateToken);
      
      // Replace the original function with the spy
      const originalGenerateToken = generateToken;
      global.generateToken = generateTokenSpy;
      
      // Generate tokens
      const tokens = await generateAuthTokens(user);
      
      // Restore the original function
      global.generateToken = originalGenerateToken;
      
      // Assertions
      expect(tokens).to.have.property('access');
      expect(tokens).to.have.property('refresh');
      expect(tokens.access).to.have.property('token');
      expect(tokens.access).to.have.property('expires');
      expect(tokens.refresh).to.have.property('token');
      expect(tokens.refresh).to.have.property('expires');
      
      // Verify token types
      expect(tokens.access.token).to.be.a('string');
      expect(tokens.refresh.token).to.be.a('string');
      
      // Verify expiry times
      expect(tokens.access.expires).to.be.a('date');
      expect(tokens.refresh.expires).to.be.a('date');
      
      // Verify refresh token expires later than access token
      expect(tokens.refresh.expires).to.be.greaterThan(tokens.access.expires);
    });
  });
});
