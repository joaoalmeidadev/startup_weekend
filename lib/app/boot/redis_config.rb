module App
  module Boot
    # Redis connection options for one logical database. The db index is passed
    # separately from the URL so a REDIS_URL that already has a path still works.
    class RedisConfig
      DEFAULT_URL = "redis://localhost:6379"

      def initialize(env = ENV)
        @env = env
      end

      def options_for(db_env_var, default_db)
        {url: @env.fetch("REDIS_URL", DEFAULT_URL), db: db_index(db_env_var, default_db)}
      end

      private

      def db_index(db_env_var, default_db)
        raw_value = @env.fetch(db_env_var, default_db).to_s.delete_prefix("/")
        Integer(raw_value, 10)
      rescue ArgumentError
        raise ArgumentError, "#{db_env_var} must be a Redis db number, got #{raw_value.inspect}"
      end
    end
  end
end
