require "rails_helper"

RSpec.describe "Management approvals", :inertia do
  before { sign_in create(:user, :hr) }

  it "lists the journeys shared by collaborators and the AI lessons to review" do
    get management_approvals_path

    expect_inertia.to render_component("management/approvals/index")
    expect(inertia.props[:submissions].first).to include(status: "pending")
    expect(inertia.props[:submissions].first[:author]).to include(:name, :avatar_url, :sector)
    expect(inertia.props[:ai_reviews].first).to include(name: "Rotinas de atendimento", review_path: management_lesson_review_path(2))
  end

  it "opens a proposal with its lessons and the suggested points explained" do
    get management_approval_path("conferir-devolucao")

    expect_inertia.to render_component("management/approvals/show")
    submission = inertia.props[:submission]
    expect(submission).to include(title: "Como conferir uma devolução", hours: 3, suggested_points: 14)
    expect(submission[:author]).to include(name: "Carla Silveira", hourly: 12.0)
    expect(inertia.props[:reward_share]).to eq(0.4)
  end

  it "answers 404 for an unknown proposal" do
    get management_approval_path("nope")

    expect(response).to have_http_status(:not_found)
  end

  it "shares how many approvals are waiting, for the sidebar" do
    get management_root_path

    expect(inertia.props[:pending_approvals]).to eq(4)
  end
end
