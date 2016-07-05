import * as handlers from './handlers';
import Joi from 'joi';

export default [
  {
    method: 'POST',
    path: '/auth/login',
    handler: {
      async: handlers.login,
    },
    config: {
      validate: {
        payload: {
          email: Joi.string().email().required().lowercase().label('Email'),
          password: Joi.string().min(7).max(20).required().label('Password'),
        },
      },
    },
  },
  {
    method: 'POST',
    path: '/auth/changePassword',
    handler: {
      async: handlers.changePassword,
    },
    config: {
      validate: {
        payload: {
          oldPassword: Joi.string().min(7).max(20).required().label('OldPassword'),
          newPassword: Joi.string().min(7).max(20).required().label('NewPassword'),
        },
      },
      auth: 'user-token',
    },
  },
];
