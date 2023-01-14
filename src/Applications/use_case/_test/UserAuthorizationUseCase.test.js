const UserRepository = require('../../../Domains/users/UserRepository');
const AuthorizationTokenManager = require('../../security/AuthorizationTokenManager');
const UserAuthorizationUseCase = require('../UserAuthorizationUseCase');

describe('UserAuthorizationUseCase', ()=>{
  it('should throw an error if the payload does not contain accessToken', ()=>{
    const useCasePayload = {};

    const userAuthorizationUseCase = new UserAuthorizationUseCase({}, {});

    expect(userAuthorizationUseCase.execute(useCasePayload)).rejects.toThrowError('USER_AUTHORIZATION.NOT_CONTAIN_ACCESS_TOKEN');
  });

  it('should throw an error if the payload type is not valid', ()=>{
    const useCasePayload = {accessToken: 123};
    const userAuthorizationUseCase = new UserAuthorizationUseCase({}, {});

    expect(userAuthorizationUseCase.execute(useCasePayload)).rejects.toThrowError('USER_AUTHORIZATION.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should orchestrating User Authorization correctly', async ()=>{
    const useCasePayload = {accessToken: 'simpleaccesstoken'};
    const user = {
      username: 'dicoding',
    };

    const mockedAuthorizationTokenManager = new AuthorizationTokenManager();
    const mockedUserRepository = new UserRepository();

    mockedAuthorizationTokenManager.verifyAccessToken = jest.fn().mockResolvedValue();
    mockedAuthorizationTokenManager.decodePayload = jest.fn().mockResolvedValue({username: user.username});
    mockedUserRepository.verifyAvailableUsername = jest.fn().mockResolvedValue(user.username);

    const userAuthorizationUseCase = new UserAuthorizationUseCase({
      userRepository: mockedUserRepository,
      authorizationTokenManager: mockedAuthorizationTokenManager,
    });

    const username = await userAuthorizationUseCase.execute(useCasePayload);

    expect(username).toStrictEqual(user.username);
    expect(mockedAuthorizationTokenManager.verifyAccessToken).toBeCalledWith(useCasePayload.accessToken);
    expect(mockedAuthorizationTokenManager.decodePayload).toBeCalledWith(useCasePayload.accessToken);
    expect(mockedUserRepository.verifyAvailableUsername).toBeCalledWith(user.username);
  });
});
