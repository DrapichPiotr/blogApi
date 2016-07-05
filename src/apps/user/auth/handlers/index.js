import Boom from 'boom';

export async function login(request, reply) {
  const { email, password } = request.payload;

  const user = await this.db.User.getBy({ email });
  if (!user || !user.isPasswordCorrect(password)) {
    throw Boom.forbidden('Bad credentials', {
      key: 'email',
    });
  }

  const token = user.createToken(this.options.secret);

  const { id, firstName, lastName, role } = user;

  reply({ id, firstName, lastName, email, role, token });
}

export async function changePassword(request, reply) {
  const user = request.auth.credentials;
  const { oldPassword, newPassword } = request.payload;

  if (!user || !user.isPasswordCorrect(oldPassword)) {
    throw Boom.forbidden('Bad credentials', {
      key: 'password',
    });
  }

  user.set({
    password: newPassword,
    changePasswordDate: new Date(),
  });

  await user.save();

  const token = user.createToken(this.options.secret);
  const { id, firstName, lastName, email, role } = user;

  reply({ id, firstName, lastName, email, role, token });
}
