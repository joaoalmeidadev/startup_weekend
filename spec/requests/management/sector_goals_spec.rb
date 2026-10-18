require "rails_helper"

RSpec.describe "Management sector goal", :inertia do
  describe "GET /management/sector_goal" do
    before { sign_in create(:user, :hr) }

    it "offers the three market levels" do
      get management_sector_goal_path

      expect_inertia.to render_component("management/sector_goals/show")
      levels = inertia.props[:sector_goal][:levels]
      expect(levels.map { |level| level.values_at(:key, :label, :target) })
        .to eq([["easy", "Fácil", 60], ["medium", "Médio", 75], ["hard", "Difícil", 90]])
      expect(levels.pluck(:hint)).to all(be_present)
    end

    it "starts Atendimento on Médio with every goal on the level target" do
      get management_sector_goal_path

      sector_goal = inertia.props[:sector_goal]
      expect(sector_goal).to include(sector: "Atendimento", level: "medium")
      expect(sector_goal[:competencies].pluck(:goal)).to all(eq(75))
    end

    it "keeps the veterans average as a reference" do
      get management_sector_goal_path

      expect(inertia.props[:sector_goal][:competencies].first).to include(experts_average: 88)
    end

    it "counts the Atendimento people who reach each goal out of the 14 in the team" do
      get management_sector_goal_path

      reached = inertia.props[:sector_goal][:competencies].pluck(:reached)
      expect(reached.pluck(:of)).to all(eq(14))
      expect(reached.pluck(:count).min).to be >= 8
    end

    it "switches to another sector" do
      get management_sector_goal_path(sector: "Comercial")

      expect(inertia.props[:sector_goal]).to include(sector: "Comercial", level: "medium")
      expect(inertia.props[:sector_goal][:competencies]).not_to be_empty
    end

    it "shows Logística without a level or veterans yet, ready to pick one" do
      get management_sector_goal_path(sector: "Logística")

      sector_goal = inertia.props[:sector_goal]
      expect(sector_goal).to include(sector: "Logística", level: nil, experts_count: 0)
      expect(sector_goal[:competencies]).not_to be_empty
      expect(sector_goal[:competencies].pluck(:goal, :experts_average, :reached).flatten).to all(be_nil)
    end
  end

  it "is only for management" do
    sign_in create(:user)

    get management_sector_goal_path

    expect(response).to redirect_to(collaborator_journey_path)
  end
end
