require "rails_helper"

RSpec.describe "Management home", :inertia do
  describe "GET /management" do
    it "greets HR with the numbers and what needs attention" do
      sign_in create(:user, :hr)

      get management_root_path

      expect_inertia.to render_component("management/homes/show")
      expect(inertia.props[:home][:numbers].pluck(:label)).to eq(["Nivelados", "Aprendendo", "Precisam de atenção"])
      expect(inertia.props[:home][:attention].pluck(:href)).to include(management_learning_module_path("rotinas-de-atendimento"))
    end

    it "is only for management" do
      sign_in create(:user)

      get management_root_path

      expect(response).to redirect_to(collaborator_journey_path)
    end
  end
end
