
class UserAuthorizationUseCase {
  constructor({userRepository, authorizationTokenManager}) {
    this._userRepository = userRepository;
    this._authorizationTokenManager = authorizationTokenManager;
  }

  async execute(useCasePayload) {
    this._verifyPayload(useCasePayload);
    const {accessToken} = useCasePayload;

    await this._authorizationTokenManager.verifyAccessToken(accessToken);
    const {username} = await this._authorizationTokenManager.decodePayload(accessToken);

    console.log(`UserAuthorizationUseCase username: ${username}`);
    await this._userRepository.verifyAvailableUsername(username);

    return username;
  }

  _verifyPayload(useCasePayload) {
    const {accessToken} = useCasePayload;
    if (!accessToken) {
      throw new Error('USER_AUTHORIZATION.NOT_CONTAIN_ACCESS_TOKEN');
    }

    if (typeof accessToken !== 'string') {
      throw new Error('USER_AUTHORIZATION.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = UserAuthorizationUseCase;
