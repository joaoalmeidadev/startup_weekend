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

    it "offers the goal competencies of each sector and group, then the others of the library" do
      get new_management_learning_module_path

      groups = inertia.props[:competency_groups]
      expect(groups.pluck(:label)).to eq(["Atendimento", "Comercial", "Logística", "Staff (grupo)", "Outras da Biblioteca"])
      expect(groups.first[:competencies]).to eq(%w[Comunicação Reclamações Sistema Empatia])
      expect(groups.last[:competencies]).to include("Rotinas", "Cultura")
      expect(groups.last[:competencies]).not_to include("Comunicação")
      expect(groups.flat_map { |group| group[:competencies] }).to all(match(/\A\p{L}+\z/))
      expect(inertia.props).not_to have_key(:competencies)
    end
  end
end
