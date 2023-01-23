/* istanbul ignore file */

const awilix = require('awilix');

// external agency
const {nanoid} = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// service (repository, helper, manager, etc)
const UserRepositoryPostgres = require('./repository/UserRepositoryPostgres');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');

// use case
const AddUserUseCase = require('../Applications/use_case/AddUserUseCase');
const JwtTokenManager = require('./security/JwtTokenManager');
const LoginUserUseCase = require('../Applications/use_case/LoginUserUseCase');
const AuthenticationRepositoryPostgres = require('./repository/AuthenticationRepositoryPostgres');
const LogoutUserUseCase = require('../Applications/use_case/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/RefreshAuthenticationUseCase');
const ThreadUseCases = require('../Applications/use_case/ThreadUseCases');
const VerifyUserAuthorizationUseCase = require('../Applications/use_case/VerifyUserAuthorizationUseCase');
const ThreadRepositoryPostgres = require('./repository/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/CommentRepositoryPostgres');
const CommentUseCases = require('../Applications/use_case/CommentUseCases');

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
  threadRepository: awilix.asClass(ThreadRepositoryPostgres).classic(),
  commentRepository: awilix.asClass(CommentRepositoryPostgres).classic(),
  passwordHash: awilix.asClass(BcryptPasswordHash).classic(),
  authenticationTokenManager: awilix.asClass(JwtTokenManager).classic(),
});

// registering use cases
container.register({
  AddUserUseCase: awilix.asClass(AddUserUseCase),
  LoginUserUseCase: awilix.asClass(LoginUserUseCase),
  LogoutUserUseCase: awilix.asClass(LogoutUserUseCase),
  RefreshAuthenticationUseCase: awilix.asClass(RefreshAuthenticationUseCase),
  VerifyUserAuthorizationUseCase: awilix.asClass(VerifyUserAuthorizationUseCase),
  ThreadUseCases: awilix.asClass(ThreadUseCases),
  CommentUseCases: awilix.asClass(CommentUseCases),
});

module.exports = container;
