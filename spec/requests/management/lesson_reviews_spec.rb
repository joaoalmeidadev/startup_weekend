require "rails_helper"

RSpec.describe "Management lesson review", :inertia do
  before { sign_in create(:user, :hr) }

  describe "GET /management/lesson_reviews/:id" do
    it "renders the lesson under review with the lessons before it approved" do
      get management_lesson_review_path(2)

      expect_inertia.to render_component("management/lesson_reviews/show")
      expect(inertia.props[:lesson_review]).to include(position: 2, total: 8, approved: 1, final: false)
    end

    it "flags the last lesson so approving saves the module in the library" do
      get management_lesson_review_path(8)

      expect(inertia.props[:lesson_review]).to include(position: 8, approved: 7, final: true,
        done_path: management_library_path)
      expect(inertia.props[:lesson_review]).not_to have_key(:publish_path)
    end

    it "links the breadcrumb back to the journey and the module" do
      get management_lesson_review_path(2)

      expect(inertia.props[:lesson_review][:breadcrumb].pluck(:href))
        .to eq([management_journeys_path, management_journey_path("jeito-distribuidora-sul"), management_learning_module_path("rotinas-de-atendimento")])
    end

    it "keeps the position inside the module" do
      get management_lesson_review_path(42)

      expect(inertia.props[:lesson_review]).to include(position: 8)
    end
  end

  describe "GET /management/lesson_reviews" do
    it "starts at the first lesson still waiting for review" do
      get management_lesson_reviews_path

      expect(response).to redirect_to(management_lesson_review_path(2))
    end
  end
end
