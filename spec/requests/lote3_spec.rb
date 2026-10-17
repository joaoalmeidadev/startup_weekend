require "rails_helper"

RSpec.describe "Remaining mocked screens", :inertia do
  describe "GET /management/modules/new" do
    before { sign_in create(:user, :hr) }

    it "starts the AI module creation for a journey" do
      get new_management_learning_module_path(journey: "onboarding-atendimento")

      expect_inertia.to render_component("management/learning_modules/new")
      expect(inertia.props[:journey]).to include(id: "onboarding-atendimento", name: "Onboarding Atendimento")
      expect(inertia.props[:generated]).to include(lessons: 8, review_path: management_learning_module_path("rotinas-de-atendimento"))
    end

    it "opens the manual editor when asked" do
      get new_management_learning_module_path(mode: "manual", journey: "onboarding-atendimento")

      expect_inertia.to render_component("management/learning_modules/manual")
      expect(inertia.props[:journey]).to include(id: "onboarding-atendimento")
    end

    it "works without a journey" do
      get new_management_learning_module_path

      expect(inertia.props[:journey]).to be_nil
    end
  end

  describe "GET /management/settings" do
    it "renders alert, ranking and badge settings" do
      sign_in create(:user, :hr)

      get management_settings_path

      expect_inertia.to render_component("management/settings/show")
      expect(inertia.props[:settings]).to include(alert_days: 30, ranking_enabled: true)
      expect(inertia.props[:settings][:badges]).not_to be_empty
    end
  end

  describe "GET /collaborator/peer_review" do
    it "asks a few statements about each pending colleague" do
      sign_in create(:user)

      get collaborator_peer_review_path

      expect_inertia.to render_component("collaborator/peer_reviews/show")
      review = inertia.props[:peer_review]
      expect(review[:colleagues].size).to eq(2)
      expect(review[:statements].size).to eq(3)
      expect(review[:scale]).to eq(%w[Nunca Raramente Às\ vezes Quase\ sempre Sempre])
    end
  end

  it "shows the pending peer review on the journey" do
    sign_in create(:user)

    get collaborator_journey_path

    expect(inertia.props[:journey][:extra_task]).to include(href: collaborator_peer_review_path)
  end
end
