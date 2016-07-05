import Boom from 'boom';

export async function registerUser(request, reply) {
  const {
    email,
    firstName,
    lastName,
  } = request.payload;

  const userWithRequestedEmail = await this.db.User.getBy({ email });
  if (userWithRequestedEmail) {
    throw Boom.notFound('User with following email already exist in app', {
      key: 'global',
    });
  }

  const user = await this.db.User.create(request.payload);

  const { id, roles } = user;

  reply({ id, firstName, lastName, email, roles });
}

export async function updateUserDetails(request, reply) {
  const user = request.auth.credentials;

  user.set(request.payload);

  await user.save();
  const { id, firstName, lastName, email, roles } = user;

  reply({ id, firstName, lastName, email, roles });
}

export async function deleteUser(request, reply) {
  const { id } = request.payload;

  const deletedUser = await this.db.User.removeById(id);

  reply({ deletedUser });
}

export async function getMyDetails(request, reply) {
  const { id, firstName, lastName, email, roles } = request.auth.credentials;

  reply({ id, firstName, lastName, email, roles });
}
