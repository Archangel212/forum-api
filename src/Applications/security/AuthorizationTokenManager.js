
class AuthorizationTokenManager {
  async verifyAccessToken(token) {
    throw new Error('AUTHORIZATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }

  async decodePayload() {
    throw new Error('AUTHORIZATION_TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthorizationTokenManager;

