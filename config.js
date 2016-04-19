module.exports = function() {
  switch(process.env.NODE_ENV) {
    case 'development':
      return {dev settings};
    case 'production':
      return {prod settings};
    case 'debug':
      return {debug settings};
    default:
      return {error or other settings};
  }
}
/*
var config = {};

config.twitter = {};
config.twitter.consumer_key = {};
config.twitter.consumer_secret = {};
config.twitter.access_token_key = {};
config.twitter.access_token_secret = {};

config.email = {};
config.email.host = {};
config.email.port = {};
config.email.user = {};
config.email.pass = {};
config.email.ssl_enable = {};

config.session = {};
config.session.session_name = {};
config.session.secret_hash = {};
config.session.session_time = {};

config.application = {};
config.application.environment = {};
*/
// module.exports = config;
