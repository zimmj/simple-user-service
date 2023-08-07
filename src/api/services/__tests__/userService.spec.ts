import * as userRepository from '../../../db/userRepository';
import * as userService from '../userService';
import { TypedError } from '../../../utils/TypedError';

jest.mock('../../../db/userRepository');

describe('auth', () => {
  it('should resolve and valid user for real token', async () => {
    const user = {
      email: 'user@example.com',
      password: 'password',
    };

    const mockUser = {
      id: '8a769cc8-dc46-4090-91c1-1496aadaef31',
      ...user,
      name: 'User',
    };
    (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);
    const token = await userService.signIn(user.email, user.password);

    const tokenUser = await userService.authenticate(token);
    expect(tokenUser).toEqual({
      id: mockUser.id,
      name: mockUser.name,
      email: mockUser.email,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });

  it('should throw error for invalid token', async () => {
    const tokenUser = await userService.authenticate('invalid');
    expect(tokenUser).toBeUndefined();
  });
});
