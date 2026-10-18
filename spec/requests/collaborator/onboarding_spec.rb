require "rails_helper"

RSpec.describe "Collaborator onboarding", :inertia do
  let(:newcomer) { create(:user, email: "novo@nivela.com") }

  it "sends the newcomer to the welcome screen before the home" do
    sign_in newcomer

    get collaborator_home_path

    expect(response).to redirect_to(collaborator_welcome_path)
  end

  it "opens the home once the newcomer has seen the diagnostic result" do
    sign_in newcomer

    get result_collaborator_diagnostic_path
    get collaborator_home_path

    expect_inertia.to render_component("collaborator/homes/show")
  end

  it "opens the home right away for a collaborator already on board" do
    sign_in create(:user)

    get collaborator_home_path

    expect_inertia.to render_component("collaborator/homes/show")
  end

  it "keeps the newcomer on the onboarding even when she opens another page" do
    sign_in newcomer

    get collaborator_journeys_path

    expect(response).to redirect_to(collaborator_welcome_path)
  end

  it "lets the newcomer go through the welcome and the diagnostic" do
    sign_in newcomer

    get collaborator_welcome_path
    get collaborator_diagnostic_path

    expect_inertia.to render_component("collaborator/diagnostics/show")
  end
end
