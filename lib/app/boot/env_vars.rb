module App
  module Boot
    # Environment variables that have no safe default, per Rails environment.
    # Development and test fall back to local defaults (see .env.example).
    class EnvVars
      class MissingError < StandardError; end

      REQUIRED = {
        "production" => %w[POSTGRES_HOST POSTGRES_PASSWORD REDIS_URL APP_HOST]
      }.freeze

      def initialize(env = ENV, rails_env: Rails.env)
        @env = env
        @rails_env = rails_env.to_s
      end

      def missing
        REQUIRED.fetch(@rails_env, []).select { |name| @env[name].to_s.empty? }
      end

      def validate!
        return if missing.empty?

        raise MissingError, "Missing environment variables: #{missing.join(", ")}"
      end
    end
  end
end
