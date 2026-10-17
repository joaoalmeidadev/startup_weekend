require "rails_helper"

RSpec.describe "Collaborator module", :inertia do
  before { sign_in create(:user) }

  it "lists the lessons of the current module with the next one highlighted" do
    get collaborator_learning_module_path("rotinas-da-distribuidora")

    expect_inertia.to render_component("collaborator/learning_modules/show")
    learning_module = inertia.props[:learning_module]
    expect(learning_module[:lessons].pluck(:status)).to eq(%w[done done done current locked])
    expect(learning_module[:continue_path]).to eq(collaborator_lesson_path("rotinas-da-distribuidora"))
  end

  it "shows a finished module with every lesson done and nothing to continue" do
    get collaborator_learning_module_path("conversa-clara")

    expect(inertia.props[:learning_module][:lessons].pluck(:status).uniq).to eq(["done"])
    expect(inertia.props[:learning_module][:continue_path]).to be_nil
  end

  it "answers 404 for a module the collaborator cannot open" do
    get collaborator_learning_module_path("uso-do-sistema")

    expect(response).to have_http_status(:not_found)
  end

  it "links the journey stops to their modules" do
    get collaborator_journey_path

    lessons = inertia.props[:journey][:sections].flat_map { |section| section[:lessons] }
    expect(lessons.reject { |lesson| lesson[:status] == "locked" }.pluck(:module_id))
      .to eq(%w[conversa-clara matematica-do-dia-a-dia nossa-historia-e-valores rotinas-da-distribuidora])
  end
end
