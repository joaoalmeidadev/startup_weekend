require Rails.root.join("lib/app/boot/redis_config")

REDIS = Redis.new(**App::Boot::RedisConfig.new.options_for("REDIS_DB", 1))
