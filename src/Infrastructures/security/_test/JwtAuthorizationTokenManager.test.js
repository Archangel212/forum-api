
const Jwt = require('@hapi/jwt');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const JwtAuthorizationTokenManager = require('../JwtAuthorizationTokenManager');

describe('JwtAuthorizationTokenManager', () => {
  describe('verifyAccessToken function', () => {
    it('should throw InvariantError whenever the accessToken is invalid', async () => {
      // Arrange
      const jwtAuthorizationTokenManager = new JwtAuthorizationTokenManager(Jwt.token);
      const accessToken = jest.fn().mockReturnValue('abcdefghijklmn');

      // Action & Assert
      await expect(jwtAuthorizationTokenManager.verifyAccessToken(accessToken))
          .rejects
          .toThrow(InvariantError);
    });

    it('should not throw InvariantError when access token is valid', async () => {
      // Arrange
      const jwtAuthorizationTokenManager = new JwtAuthorizationTokenManager(Jwt.token);
      const accessToken = Jwt.token.generate({username: 'dicoding'}, process.env.ACCESS_TOKEN_KEY);

      // Action & Assert
      await expect(jwtAuthorizationTokenManager.verifyAccessToken(accessToken))
          .resolves
          .not.toThrow(InvariantError);
    });
  });

  describe('decodePayload function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtAuthorizationTokenManager = new JwtAuthorizationTokenManager(Jwt.token);
      const accessToken = Jwt.token.generate({username: 'dicoding'}, process.env.ACCESS_TOKEN_KEY);

      // Action
      const {username: expectedUsername} = await jwtAuthorizationTokenManager.decodePayload(accessToken);

      // Action & Assert
      expect(expectedUsername).toEqual('dicoding');
    });
  });
});
