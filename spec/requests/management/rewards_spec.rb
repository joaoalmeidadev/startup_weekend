require "rails_helper"

RSpec.describe "Management rewards", :inertia do
  describe "GET /management/rewards" do
    before { sign_in create(:user, :hr) }

    it "brings the points rule, the rewards and the ideas to register" do
      get management_rewards_path

      expect_inertia.to render_component("management/rewards/show")
      expect(inertia.props[:points_rule]).to include(teacher_salary: 4400, learner_salary: 2200, reward_share: 0.4)
      expect(inertia.props).not_to include(:rule)
      expect(inertia.props[:rewards].first).to include(name: "Caneca Nivela", icon: "coffee", category: "Brinde", cost: 25, points: 25)
      expect(inertia.props[:ideas]).not_to be_empty
    end

    it "takes what was already redeemed out of the stock" do
      get management_rewards_path

      rewards = inertia.props[:rewards].index_by { |reward| reward[:name] }
      expect(rewards["Caneca Nivela"]).to include(stock: 16, redeemed: 4)
      expect(rewards["Ingresso de cinema"]).to include(stock: 10, redeemed: 0)
      expect(rewards["Vale-lanche"]).to include(stock: nil, redeemed: 4)
    end

    it "lists the recent redemptions, newest first, with the person" do
      get management_rewards_path

      redemptions = inertia.props[:redemptions]
      expect(redemptions.first).to include(date: "02/10")
      expect(redemptions.first[:person]).to include(:id, :name, :avatar_url)
      expect(redemptions.pluck(:date).first(2)).to all(eq("02/10"))
      expect(redemptions.pluck(:reward).first(2)).to contain_exactly("Vale-lanche", "Caneca Nivela")
    end

    it "compares the month spent on rewards with the training saved by whoever redeemed" do
      get management_rewards_path

      month = inertia.props[:month]
      expect(month).to include(spent: 55, saved: 660)
      expect(month[:spent]).to be < month[:saved]
    end
  end

  it "is only for management" do
    sign_in create(:user)

    get management_rewards_path

    expect(response).to redirect_to(collaborator_home_path)
  end
end
