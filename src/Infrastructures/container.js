/* istanbul ignore file */

const awilix = require('awilix');

// external agency
const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepository = require('../Domains/users/UserRepository');
const PasswordHash = require('../Applications/security/PasswordHash');
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');
const JwtTokenManager = require('./security/JwtTokenManager');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const ThreadUseCases = require('../Applications/use_case/ThreadUseCases');
const UserAuthorizationUseCase = require('../Applications/use_case/UserAuthorizationUseCase');
const JwtAuthorizationTokenManager = require('./security/JwtAuthorizationTokenManager');

// creating container
const container = awilix.createContainer();

container.register({
  pool: awilix.asValue(pool),
  bcrypt: awilix.asValue(bcrypt),
  jwt: awilix.asValue(Jwt.token),
  idGenerator: awilix.asFunction(()=>nanoid),
});

container.register({
  userRepository: awilix.asClass(UserRepositoryPostgres).classic(),
  authenticationRepository: awilix.asClass(AuthenticationRepositoryPostgres).classic(),
  passwordHash: awilix.asClass(BcryptPasswordHash).classic(),
  authenticationTokenManager: awilix.asClass(JwtTokenManager).classic(),
  authorizationTokenManager: awilix.asClass(JwtAuthorizationTokenManager).classic(),
});

// registering use cases
container.register({
  AddUserUseCase: awilix.asClass(AddUserUseCase),
  LoginUserUseCase: awilix.asClass(LoginUserUseCase),
  LogoutUserUseCase: awilix.asClass(LogoutUserUseCase),
  RefreshAuthenticationUseCase: awilix.asClass(RefreshAuthenticationUseCase),
  UserAuthorizationUseCase: awilix.asClass(UserAuthorizationUseCase),
  ThreadUseCases: awilix.asClass(ThreadUseCases),
});

module.exports = container;
