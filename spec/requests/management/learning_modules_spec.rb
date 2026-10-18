require "rails_helper"

RSpec.describe "Management learning module", :inertia do
  before { sign_in create(:user, :hr) }

  describe "GET /management/modules/:id" do
    it "renders the lessons of a module under review, the first one approved" do
      get management_learning_module_path("rotinas-de-atendimento")

      expect_inertia.to render_component("management/learning_modules/show")
      lessons = inertia.props[:learning_module][:lessons]
      expect(lessons.size).to eq(8)
      expect(lessons.pluck(:status).tally).to eq("approved" => 1, "pending" => 7)
      expect(inertia.props[:learning_module]).to include(competency: "Rotinas", review_from: 2,
        source: "ai", material: "Manual de SAC.pdf")
    end

    it "tells the in-person training it replaces and who would give it" do
      get management_learning_module_path("rotinas-de-atendimento")
      expect(inertia.props[:learning_module][:training]).to include(hours: 6, teacher_hourly: 25.0, default_teacher: false)

      get management_learning_module_path("conversa-clara")
      expect(inertia.props[:learning_module][:training]).to include(hours: 3, teacher_hourly: 20.0, default_teacher: true)
    end

    it "shows every lesson approved for a published module" do
      get management_learning_module_path("conversa-clara")

      expect(inertia.props[:learning_module][:lessons].pluck(:status).uniq).to eq(["approved"])
      expect(inertia.props[:learning_module][:review_from]).to be_nil
    end

    it "lists the journeys that use the module" do
      get management_learning_module_path("nossa-historia-e-valores")

      expect(inertia.props[:learning_module][:used_in].pluck(:name)).to eq(["Jeito Distribuidora Sul"])
    end

    it "answers 404 for an unknown module" do
      get management_learning_module_path("nope")

      expect(response).to have_http_status(:not_found)
    end
  end
end
