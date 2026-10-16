require "rails_helper"

RSpec.describe App::Boot::RedisConfig do
  describe "#options_for" do
    it "uses REDIS_URL and the db index from the given variable" do
      config = described_class.new({"REDIS_URL" => "redis://redis:6379", "REDIS_DB" => "3"})

      expect(config.options_for("REDIS_DB", 1)).to eq(url: "redis://redis:6379", db: 3)
    end

    it "accepts db values written with a leading slash" do
      config = described_class.new({"REDIS_DB" => "/4"})

      expect(config.options_for("REDIS_DB", 1)).to include(db: 4)
    end

    it "keeps a REDIS_URL that already includes a database path" do
      config = described_class.new({"REDIS_URL" => "redis://managed:6379/0"})

      expect(config.options_for("REDIS_DB", 1)).to eq(url: "redis://managed:6379/0", db: 1)
    end

    it "falls back to local Redis and the default db" do
      expect(described_class.new({}).options_for("REDIS_DB", 2)).to eq(url: "redis://localhost:6379", db: 2)
    end

    it "rejects a db value that is not a number" do
      config = described_class.new({"REDIS_DB" => "cache"})

      expect { config.options_for("REDIS_DB", 1) }.to raise_error(ArgumentError, /REDIS_DB/)
    end
  end
end
