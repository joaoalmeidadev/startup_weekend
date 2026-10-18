require "rails_helper"

RSpec.describe "Management module publishing", :inertia do
  before { sign_in create(:user, :hr) }

  describe "GET /management/modules/:id/publish" do
    it "asks who receives the reviewed module" do
      get publish_management_learning_module_path("rotinas-de-atendimento")

      expect_inertia.to render_component("management/learning_modules/publish")
      publication = inertia.props[:publication]
      expect(publication).to include(module_name: "Rotinas de atendimento", lessons: 8, sector: "Atendimento", audience_count: 32)
      expect(publication[:default_audiences]).to eq(%w[sector newcomers])
      expect(publication[:done_path]).to eq(management_journeys_path)
      expect(publication[:journey_outline].pluck(:status)).to include("new")
    end

    it "answers 404 for an unknown module" do
      get publish_management_learning_module_path("nope")

      expect(response).to have_http_status(:not_found)
    end
  end

  it "is only for management" do
    sign_out :user
    sign_in create(:user)

    get publish_management_learning_module_path("rotinas-de-atendimento")

    expect(response).to redirect_to(collaborator_journey_path)
  end
end
