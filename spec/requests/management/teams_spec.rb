require "rails_helper"

RSpec.describe "Manager dashboard", :inertia do
  before { sign_in create(:user, :manager) }

  describe "GET /management/team" do
    it "renders the team metrics for the manager's sector" do
      get management_team_path

      expect_inertia.to render_component("management/teams/show")
      dashboard = inertia.props[:dashboard]
      expect(dashboard).to include(sector: "Atendimento")
      expect(dashboard[:leveled]).to include(count: 8, total: 14)
    end

    it "defaults to the last 6 months" do
      get management_team_path

      expect(inertia.props[:dashboard]).to include(period: "6m")
      expect(inertia.props[:dashboard][:periods].pluck(:key)).to eq(%w[30d 90d 6m])
    end

    it "filters every metric by the chosen period" do
      get management_team_path(period: "30d")

      dashboard = inertia.props[:dashboard]
      expect(dashboard).to include(period: "30d")
      expect(dashboard[:leveled][:change_label]).to eq("em 30 dias")
      expect(dashboard[:leveled_over_time].pluck(:label)).to eq(["sem 1", "sem 2", "sem 3", "sem 4"])
    end

    it "falls back to 6 months for an unknown period" do
      get management_team_path(period: "1y")

      expect(inertia.props[:dashboard]).to include(period: "6m")
    end

    it "brings the four metric groups" do
      get management_team_path

      dashboard = inertia.props[:dashboard]
      expect(dashboard[:leveled_over_time].size).to eq(6)
      expect(dashboard[:leveled_over_time].first.keys).to eq(%w[label percent])
      expect(dashboard[:competencies].first).to include(:team_average, :goal)
      expect(dashboard[:engagement].size).to eq(4)
      expect(dashboard[:funnel].pluck(:count)).to eq([14, 12, 10, 9, 8])
      expect(dashboard[:days_to_level]).to be_a(Integer)
    end
  end

  describe "GET /management/people?team=1" do
    it "shows only the manager's team" do
      get management_people_path(team: 1)

      expect(inertia.props[:team]).to be(true)
      expect(inertia.props[:people].pluck(:sector).uniq).to eq(["Atendimento"])
    end
  end
end
