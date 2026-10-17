require "rails_helper"

RSpec.describe "Collaborator progress", :inertia do
  describe "GET /collaborator/progress" do
    it "renders badges, ranking and the ranking privacy choice" do
      sign_in create(:user)

      get collaborator_progress_path

      expect_inertia.to render_component("collaborator/progresses/show")
      expect(inertia.props[:progress][:badges].size).to eq(4)
      expect(inertia.props[:progress][:ranking].last).to include(position: 4, current: true)
      expect(inertia.props[:progress][:ranking_visibility]).to eq("name")
    end

    it "is only for collaborators" do
      sign_in create(:user, :manager)

      get collaborator_progress_path

      expect(response).to redirect_to(management_root_path)
    end
  end
end
