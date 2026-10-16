require "rails_helper"

RSpec.describe App::Result do
  describe ".success" do
    it "wraps a value" do
      result = described_class.success(42)

      expect(result).to be_success
      expect(result).not_to be_failure
      expect(result.value).to eq(42)
      expect(result.error).to be_nil
    end
  end

  describe ".failure" do
    it "carries an error code and optional details" do
      result = described_class.failure(:invalid_order, "empty cart")

      expect(result).to be_failure
      expect(result.error).to eq(:invalid_order)
      expect(result.details).to eq("empty cart")
      expect(result.value).to be_nil
    end
  end
end
