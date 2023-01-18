const AuthorizationTokenManager = require('../../Applications/security/AuthorizationTokenManager');
const InvariantError = require('../../Commons/exceptions/InvariantError');

class JwtAuthorizationTokenManager extends AuthorizationTokenManager {
  constructor(jwt) {
    super();
    this._jwt = jwt;
  }

  async verifyAccessToken(token) {
    try {
      const artifacts = this._jwt.decode(token);
      this._jwt.verify(artifacts, process.env.ACCESS_TOKEN_KEY);
    } catch (error) {
      throw new InvariantError('access token tidak valid');
    }
  }

  async decodePayload(token) {
    const artifacts = this._jwt.decode(token);
    return artifacts.decoded.payload;
  }
}

module.exports = JwtAuthorizationTokenManager;

