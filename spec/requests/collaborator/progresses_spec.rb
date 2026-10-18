require "rails_helper"

RSpec.describe "Collaborator progress", :inertia do
  describe "GET /collaborator/progress" do
    it "renders badges and the evolution along Base, Empresa and Setor" do
      sign_in create(:user)

      get collaborator_progress_path

      expect_inertia.to render_component("collaborator/progresses/show")
      progress = inertia.props[:progress]
      expect(progress[:badges].size).to eq(4)
      expect(progress[:evolution]).to include(completed: 3, total: 6)
      expect(progress[:evolution][:stretches].pluck(:name)).to eq(%w[Base Empresa Setor])
      expect(progress.keys).to contain_exactly("badges", "evolution")
    end

    it "is only for collaborators" do
      sign_in create(:user, :manager)

      get collaborator_progress_path

      expect(response).to redirect_to(management_team_path)
    end
  end
end
