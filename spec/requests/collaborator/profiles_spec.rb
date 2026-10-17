require "rails_helper"

RSpec.describe "Collaborator profile", :inertia do
  describe "GET /collaborator/profile" do
    it "renders the reminder and ranking name settings" do
      sign_in create(:user)

      get collaborator_profile_path

      expect_inertia.to render_component("collaborator/profiles/show")
      expect(inertia.props[:profile]).to include(reminder_time: "09:00", ranking_name: "Maria Souza")
    end

    it "is only for collaborators" do
      sign_in create(:user, :platform_admin)

      get collaborator_profile_path

      expect(response).to redirect_to(management_root_path)
    end
  end
end
