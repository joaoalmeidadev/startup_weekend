require "rails_helper"

RSpec.describe "Remaining mocked screens", :inertia do
  describe "GET /management/modules/new" do
    before { sign_in create(:user, :hr) }

    it "opens the new content form for a journey" do
      get new_management_learning_module_path(journey: "atendimento-na-pratica")

      expect_inertia.to render_component("management/learning_modules/new")
      expect(inertia.props[:journey]).to include(id: "atendimento-na-pratica", name: "Atendimento na prática")
      expect(inertia.props[:generated]).to include(lessons: 8, review_path: management_lesson_review_path(1))
    end

    it "keeps a single form, whatever the old mode param says" do
      get new_management_learning_module_path(mode: "manual")

      expect_inertia.to render_component("management/learning_modules/new")
    end

    it "works without a journey" do
      get new_management_learning_module_path

      expect(inertia.props[:journey]).to be_nil
    end

    it "offers the competencies of the library, once each and sorted" do
      get new_management_learning_module_path

      competencies = inertia.props[:competencies]
      expect(competencies).to include("Rotinas", "Comunicação")
      expect(competencies).to eq(competencies.uniq.sort)
      expect(inertia.props).not_to have_key(:nivela_products)
    end
  end
end
