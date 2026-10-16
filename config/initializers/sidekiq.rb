require Rails.root.join("lib/app/boot/redis_config")

sidekiq_redis = App::Boot::RedisConfig.new.options_for("REDIS_DB_FOR_SIDEKIQ", 0)

Sidekiq.configure_server do |config|
  config.redis = sidekiq_redis
  config.logger = Rails.logger
end

Sidekiq.configure_client do |config|
  config.redis = sidekiq_redis
end
