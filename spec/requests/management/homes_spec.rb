require "rails_helper"

RSpec.describe "Management dashboard", :inertia do
  describe "GET /management" do
    before { sign_in create(:user, :hr) }

    it "renders the team metrics with what needs attention" do
      get management_root_path

      expect_inertia.to render_component("management/homes/show")
      dashboard = inertia.props[:dashboard]
      expect(dashboard[:leveled]).to include(count: 8, total: 14)
      expect(dashboard[:attention].pluck(:href)).to include(management_lesson_reviews_path)
    end

    it "no longer points to a company setup" do
      get management_root_path

      expect(inertia.props[:dashboard]).not_to have_key(:setup)
    end

    it "defaults to the last 6 months" do
      get management_root_path

      expect(inertia.props[:dashboard]).to include(period: "6m")
      expect(inertia.props[:dashboard][:periods].pluck(:key)).to eq(%w[30d 90d 6m])
    end

    it "filters every metric by the chosen period" do
      get management_root_path(period: "30d")

      dashboard = inertia.props[:dashboard]
      expect(dashboard).to include(period: "30d")
      expect(dashboard[:leveled][:change_label]).to eq("em 30 dias")
      expect(dashboard[:leveled_over_time].pluck(:label)).to eq(["sem 1", "sem 2", "sem 3", "sem 4"])
    end

    it "falls back to 6 months for an unknown period" do
      get management_root_path(period: "1y")

      expect(inertia.props[:dashboard]).to include(period: "6m")
    end

    it "brings the four metric groups" do
      get management_root_path

      dashboard = inertia.props[:dashboard]
      expect(dashboard[:leveled_over_time].size).to eq(6)
      expect(dashboard[:competencies].first).to include(:team_average, :goal)
      expect(dashboard[:engagement].size).to eq(4)
      expect(dashboard[:funnel].pluck(:count)).to eq([14, 12, 10, 9, 8])
      expect(dashboard[:days_to_level]).to be_a(Integer)
    end
  end

  it "is only for management" do
    sign_in create(:user)

    get management_root_path

    expect(response).to redirect_to(collaborator_journey_path)
  end
end
