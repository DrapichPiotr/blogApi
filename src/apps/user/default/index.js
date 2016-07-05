import * as handlers from './handlers';
import Joi from 'joi';

export default [
  {
    method: 'POST',
    path: '/',
    handler: {
      async: handlers.registerUser,
    },
    config: {
      validate: {
        payload: {
          firstName: Joi.string().required().label('First name'),
          lastName: Joi.string().required().label('Last name'),
          email: Joi.string().email().required().label('Email'),
          password: Joi.string().required().min(7).max(20).label('Password'),
        },
      },
    },
  },
  {
    method: 'PUT',
    path: '/',
    handler: {
      async: handlers.updateUserDetails,
    },
    config: {
      validate: {
        payload: {
          firstName: Joi.string().label('First name'),
          lastName: Joi.string().label('Last name'),
        },
      },
      auth: 'user-token',
    },
  },
  {
    method: 'DELETE',
    path: '/',
    handler: {
      async: handlers.deleteUser,
    },
    config: {
      validate: {
        payload: {
          id: Joi.string().required().label('ID'),
        },
      },
      auth: 'admin-token',
    },
  },
  {
    method: 'GET',
    path: '/me',
    handler: {
      async: handlers.getMyDetails,
    },
    config: {
      auth: 'user-token',
    },
  },
];
