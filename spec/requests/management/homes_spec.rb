require "rails_helper"

RSpec.describe "Management dashboard", :inertia do
  describe "GET /management" do
    before { sign_in create(:user, :hr) }

    it "renders the proof that the team is learning, with no to-do list" do
      get management_root_path

      expect_inertia.to render_component("management/homes/show")
      dashboard = inertia.props[:dashboard]
      expect(dashboard[:leveled]).to include(count: 8, total: 14)
      expect(dashboard).not_to include(:attention, :funnel, :engagement)
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

    it "shows the knowledge gained since the diagnostic, overall and per competency" do
      get management_root_path

      dashboard = inertia.props[:dashboard]
      expect(dashboard[:knowledge_gain]).to include(before: 48, now: 79)
      expect(dashboard[:competencies]).to all(include(:name, :before, :now, :goal))
      expect(dashboard[:competencies].map { |competency| competency[:now] - competency[:before] }).to all(be_positive)
    end

    it "compares the time to level with how long the hand-off took before" do
      get management_root_path

      expect(inertia.props[:dashboard][:time_to_level]).to include(days: 46, before_days: 90)
    end

    it "estimates the hand-off hours and money saved with the new hires of the period" do
      get management_root_path

      savings = inertia.props[:dashboard][:savings]
      expect(savings).to include(new_hires: 9, hours: 9 * 23, amount: 9 * 23 * 85)
    end

    it "shows that what is learned sticks and that the team keeps studying" do
      get management_root_path

      expect(inertia.props[:dashboard][:retention]).to include(review_accuracy: 86, active_weekly: "9 de 14", minutes_per_day: 5)
    end

    it "brings the on-the-job change as reported by the manager" do
      get management_root_path

      on_the_job = inertia.props[:dashboard][:on_the_job]
      expect(on_the_job[:source]).to eq("Avaliação do gestor aos 30 dias")
      expect(on_the_job[:items]).to all(include(:label, :before, :now, :unit))
      expect(on_the_job[:items].map { |item| item[:now] < item[:before] }).to all(be(true))
    end

    it "changes the gains and savings with the period" do
      get management_root_path(period: "30d")

      dashboard = inertia.props[:dashboard]
      expect(dashboard[:knowledge_gain]).to include(before: 52, now: 71)
      expect(dashboard[:savings]).to include(new_hires: 2, hours: 46, amount: 3910)
      expect(dashboard[:time_to_level][:days]).to eq(38)
    end

    it "compares each competency with the Atendimento sector goal (Médio, 75 pts)" do
      get management_root_path

      expect(inertia.props[:dashboard][:competencies].pluck(:goal)).to all(eq(75))
    end
  end

  it "is only for management" do
    sign_in create(:user)

    get management_root_path

    expect(response).to redirect_to(collaborator_journey_path)
  end
end
