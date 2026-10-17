require "rails_helper"

RSpec.describe "Collaborator journey", :inertia do
  describe "GET /collaborator/journey" do
    it "renders the journey with the example data" do
      sign_in create(:user)

      get collaborator_journey_path

      expect_inertia.to render_component("collaborator/journeys/show")
      expect(inertia.props[:journey]).to include(step: {current: 4, total: 6})
      expect(inertia.props[:journey][:sections].size).to eq(3)
    end

    it "previews the empty journey for the demo" do
      sign_in create(:user)

      get collaborator_journey_path(preview: "empty")

      expect(inertia.props[:journey][:sections]).to eq([])
    end

    it "shares who is signed in for the layout" do
      sign_in create(:user)

      get collaborator_journey_path

      expect(inertia.props[:viewer]).to include(name: "Maria Souza", company: "Distribuidora Sul")
    end

    it "sends management users back to their own area" do
      sign_in create(:user, :hr)

      get collaborator_journey_path

      expect(response).to redirect_to(management_root_path)
    end

    it "asks guests to sign in" do
      get collaborator_journey_path

      expect(response).to redirect_to(new_user_session_path)
    end
  end
end
