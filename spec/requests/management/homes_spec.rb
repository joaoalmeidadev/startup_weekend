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
      expect(savings).to include(new_hires: 9, hours: 9 * 23)
    end

    it "uses the informed salaries of the team to measure what the hand-off saved" do
      get management_root_path

      savings = inertia.props[:dashboard][:savings]
      # who teaches R$ 20/h + the average informed salary of who learns (R$ 2.365 ÷ 220 = R$ 10,75/h)
      expect(savings).to include(amount: (207 * 30.75).round, salaries: {informed: 6, total: 10})
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
      expect(dashboard[:savings]).to include(new_hires: 2, hours: 46, amount: (46 * 30.75).round)
      expect(dashboard[:time_to_level][:days]).to eq(38)
    end

    it "adds up what Nivela gave back in 6 months: savings minus rewards and the platform" do
      get management_root_path

      dashboard = inertia.props[:dashboard]
      net = dashboard[:return]
      expect(net).to include(training_saved: dashboard[:savings][:amount], rework_count: 39, rework_avoided: 39 * 80,
        platform_cost: 14 * 15 * 6)
      expect(net[:assumptions]).to include(rework_cost: 80, price_per_person: 15, people: 14, months: 6)
      # every listed redemption: 4 Canecas Nivela (R$ 25) and 4 Vale-lanches (R$ 30)
      expect(net[:rewards_paid]).to eq(4 * 25 + 4 * 30)
      expect_formula_to_hold(net)
    end

    it "counts only October rewards and one month of Nivela in the last 30 days" do
      get management_root_path(period: "30d")
      short = inertia.props[:dashboard][:return]
      get management_root_path(period: "6m")
      long = inertia.props[:dashboard][:return]

      expect(short).to include(rework_count: 9, rework_avoided: 9 * 80, rewards_paid: 25 + 30, platform_cost: 14 * 15)
      expect(short[:assumptions]).to include(months: 1)
      expect(short[:rewards_paid]).not_to eq(long[:rewards_paid])
      expect_formula_to_hold(short)
    end

    it "compares each competency with the Atendimento sector goal (Médio, 75 pts)" do
      get management_root_path

      expect(inertia.props[:dashboard][:competencies].pluck(:goal)).to all(eq(75))
    end

    it "shows who studies the most, per work sector and per person, adding up to the same hours" do
      get management_root_path

      share = inertia.props[:dashboard][:study_share]
      expect(share[:by_sector].pluck(:label)).to eq(%w[Atendimento Comercial Logística])
      expect(share[:by_person].size).to eq(5)
      expect(share[:by_person].last[:label]).to eq("Outros")
      total = share[:by_sector].sum { |slice| slice[:hours] }
      expect(share[:by_person].sum { |slice| slice[:hours] }).to eq(total)
    end

    it "keeps who studies the most as a snapshot of today, whatever the period" do
      get management_root_path(period: "30d")
      short = inertia.props[:dashboard][:study_share]
      get management_root_path(period: "6m")

      expect(inertia.props[:dashboard][:study_share]).to eq(short)
    end
  end

  def expect_formula_to_hold(net)
    gained = net[:training_saved] + net[:rework_avoided]
    spent = net[:rewards_paid] + net[:platform_cost]
    expect(net[:balance]).to eq(gained - spent)
    expect(net[:return_per_real]).to eq(gained.fdiv(spent).round(1))
  end

  it "is only for management" do
    sign_in create(:user)

    get management_root_path

    expect(response).to redirect_to(collaborator_home_path)
  end
end
