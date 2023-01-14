
const AuthorizationTokenManager = require('../AuthorizationTokenManager');

describe('AuthorizationTokenManager interface', () => {
  it('should throw error for invoking unimplemented method', async () => {
    // Arrange
    const tokenManager = new AuthorizationTokenManager();

    // Action & Assert
    await expect(tokenManager.verifyAccessToken('')).rejects.toThrowError('AUTHORIZATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(tokenManager.decodePayload('')).rejects.toThrowError('AUTHORIZATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});

