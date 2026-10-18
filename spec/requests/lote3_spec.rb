require "rails_helper"

RSpec.describe "Remaining mocked screens", :inertia do
  describe "GET /management/modules/new" do
    before { sign_in create(:user, :hr) }

    it "starts the AI module creation for a journey" do
      get new_management_learning_module_path(journey: "onboarding-atendimento")

      expect_inertia.to render_component("management/learning_modules/new")
      expect(inertia.props[:journey]).to include(id: "onboarding-atendimento", name: "Onboarding Atendimento")
      expect(inertia.props[:generated]).to include(lessons: 8, review_path: management_lesson_review_path(1))
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

    it "offers the ready-made Nivela products to add to a journey" do
      get new_management_learning_module_path

      products = inertia.props[:nivela_products]
      expect(products.pluck(:source).uniq).to eq(["nivela"])
      expect(products.pluck(:id)).to include("conversa-clara", "matematica-do-dia-a-dia")
    end
  end
end
