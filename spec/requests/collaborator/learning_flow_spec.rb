require "rails_helper"

RSpec.describe "Collaborator learning flow", :inertia do
  before { sign_in create(:user) }

  it "welcomes the collaborator before the diagnostic" do
    get collaborator_welcome_path

    expect_inertia.to render_component("collaborator/welcomes/show")
  end

  it "asks the diagnostic questions one stretch at a time" do
    get collaborator_diagnostic_path

    expect_inertia.to render_component("collaborator/diagnostics/show")
    questions = inertia.props[:diagnostic][:questions]
    expect(questions.pluck(:stretch)).to eq(%w[Base Base Empresa Setor])
    expect(questions.first[:options].size).to be >= 3
  end

  it "shows what the collaborator already knows and what the journey will teach" do
    get result_collaborator_diagnostic_path

    expect_inertia.to render_component("collaborator/diagnostics/result")
    expect(inertia.props[:result]).to include(modules: 6, minutes_per_day: 5)
    expect(inertia.props[:result][:known].size).to eq(3)
    expect(inertia.props[:result][:to_learn].size).to eq(3)
  end

  it "renders a lesson with video, explanation and a question" do
    get collaborator_lesson_path("rotinas-da-distribuidora")

    expect_inertia.to render_component("collaborator/lessons/show")
    lesson = inertia.props[:lesson]
    expect(lesson).to include(title: "Rotinas da Distribuidora", points: 23)
    expect(lesson[:question][:options].count { |option| option[:correct] }).to eq(1)
  end

  it "answers 404 for an unknown lesson" do
    get collaborator_lesson_path("nope")

    expect(response).to have_http_status(:not_found)
  end

  it "keeps the flow for collaborators only" do
    sign_in create(:user, :hr)

    get collaborator_diagnostic_path

    expect(response).to redirect_to(management_root_path)
  end
end
