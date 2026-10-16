require "rails_helper"

RSpec.describe App::Boot::EnvVars do
  let(:complete_production_env) do
    {"POSTGRES_HOST" => "db", "POSTGRES_PASSWORD" => "secret", "REDIS_URL" => "redis://redis", "APP_HOST" => "app.test"}
  end

  describe "#missing" do
    it "lists required production variables that are absent or blank" do
      env = complete_production_env.merge("REDIS_URL" => "").except("APP_HOST")
      env_vars = described_class.new(env, rails_env: "production")

      expect(env_vars.missing).to eq(%w[REDIS_URL APP_HOST])
    end

    it "requires nothing in development, where every variable has a default" do
      expect(described_class.new({}, rails_env: "development").missing).to be_empty
    end
  end

  describe "#validate!" do
    it "passes when every required variable is set" do
      env_vars = described_class.new(complete_production_env, rails_env: "production")

      expect { env_vars.validate! }.not_to raise_error
    end

    it "raises naming the missing variables" do
      env_vars = described_class.new({}, rails_env: "production")

      expect { env_vars.validate! }
        .to raise_error(App::Boot::EnvVars::MissingError, "Missing environment variables: POSTGRES_HOST, POSTGRES_PASSWORD, REDIS_URL, APP_HOST")
    end
  end
end
