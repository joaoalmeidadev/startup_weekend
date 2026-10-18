require "rails_helper"

RSpec.describe Users::HomePathResolver do
  include Rails.application.routes.url_helpers

  it "sends collaborators to their journey" do
    user = build(:user)

    expect(described_class.new(user).path).to eq(collaborator_journey_path)
  end

  it "sends managers to their team dashboard" do
    expect(described_class.new(build(:user, :manager)).path).to eq(management_team_path)
  end

  %i[hr platform_admin].each do |role|
    it "sends #{role} users to the management area" do
      user = build(:user, role)

      expect(described_class.new(user).path).to eq(management_root_path)
    end
  end
end
