import passport from 'passport';
import httpStatus from 'http-status';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import config from '../config/config.js';
import User from '../models/user.model.js';

// JWT options for passport
const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// Verify JWT token and load user
const jwtVerify = async (payload, done) => {
  try {
    // Find user by ID from JWT payload
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
};

// Initialize passport with JWT strategy
const initializePassport = () => {
  passport.use(new JwtStrategy(jwtOptions, jwtVerify));
};

// Authentication middleware
const authenticate = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ 
        message: 'Please authenticate' 
      });
    }
    req.user = user;
    next();
  })(req, res, next);
};

// Role-based authorization middleware
const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(httpStatus.UNAUTHORIZED).json({ 
      message: 'Please authenticate first' 
    });
  }
  
  if (!roles.includes(req.user.role)) {
    return res.status(httpStatus.FORBIDDEN).json({ 
      message: 'You do not have permission to perform this action' 
    });
  }
  
  next();
};

export {
  initializePassport,
  authenticate,
  authorize,
};
