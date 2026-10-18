require "rails_helper"

RSpec.describe "Collaborator gamified area", :inertia do
  before { sign_in create(:user) }

  it "opens the home with Maria's points, next step and journeys" do
    get collaborator_home_path

    expect_inertia.to render_component("collaborator/homes/show")
    expect(inertia.props[:learner]).to include(name: "Maria Souza", streak_days: 3)
    expect(inertia.props[:learner][:points]).to include(total: 38, balance: 13)
    expect(inertia.props[:learner][:next_step]).to include(points: 23)
  end

  it "lists the journeys one at a time" do
    get collaborator_journeys_path

    expect_inertia.to render_component("collaborator/journeys/index")
    expect(inertia.props[:learner][:journeys].pluck(:status)).to eq(%w[done active queued])
  end

  it "shows the rewards in points only, with her balance and what she redeemed" do
    get collaborator_rewards_path

    expect_inertia.to render_component("collaborator/rewards/show")
    expect(inertia.props[:balance]).to eq(13)
    expect(inertia.props[:rewards].first).to include(:name, :icon, :points)
    expect(inertia.props[:rewards].first).not_to include(:cost)
    expect(inertia.props[:redeemed].pluck(:name)).to eq(["Caneca Nivela"])
  end

  it "lists the journeys she shared and what she earned with them" do
    get collaborator_contributions_path

    expect_inertia.to render_component("collaborator/contributions/index")
    expect(inertia.props[:contributions].pluck(:status)).to contain_exactly("approved", "pending")
    expect(inertia.props[:earned]).to eq(8)
  end

  it "opens the form to propose a journey, with what her hour is worth in points" do
    get new_collaborator_contribution_path

    expect_inertia.to render_component("collaborator/contributions/new")
    expect(inertia.props[:sectors]).to include("Atendimento")
    expect(inertia.props[:points_per_hour]).to eq(3.8)
  end
end
