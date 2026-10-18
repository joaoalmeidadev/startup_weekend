require "rails_helper"

RSpec.describe "Management rewards", :inertia do
  describe "GET /management/rewards" do
    before { sign_in create(:user, :hr) }

    it "brings the points rule, the rewards and the ideas to register" do
      get management_rewards_path

      expect_inertia.to render_component("management/rewards/show")
      expect(inertia.props[:points_rule]).to include(manager_hourly: 60, person_hourly: 25, reward_share: 0.4)
      expect(inertia.props).not_to include(:rule)
      expect(inertia.props[:rewards].first).to include(name: "Caneca Nivela", icon: "coffee", category: "Brinde", cost: 25, points: 25)
      expect(inertia.props[:ideas]).not_to be_empty
    end

    it "lists the recent redemptions, newest first, with the person" do
      get management_rewards_path

      redemptions = inertia.props[:redemptions]
      expect(redemptions.first).to include(reward: "Vale-lanche", date: "02/10", points: 30)
      expect(redemptions.first[:person]).to include(:id, :name, :avatar_url)
      expect(redemptions.pluck(:date).first(4)).to all(eq("02/10"))
    end

    it "compares the month spent on rewards with the training saved by whoever redeemed" do
      get management_rewards_path

      month = inertia.props[:month]
      expect(month).to include(spent: 120, saved: 2890)
      expect(month[:spent]).to be < month[:saved]
    end
  end

  it "is only for management" do
    sign_in create(:user)

    get management_rewards_path

    expect(response).to redirect_to(collaborator_journey_path)
  end
end
