require "rails_helper"

RSpec.describe "Collaborator onboarding", :inertia do
  let(:newcomer) { create(:user, email: "novo@nivela.com") }

  it "sends the newcomer to the welcome screen before the journey" do
    sign_in newcomer

    get collaborator_journey_path

    expect(response).to redirect_to(collaborator_welcome_path)
  end

  it "opens the journey once the newcomer has seen the diagnostic result" do
    sign_in newcomer

    get result_collaborator_diagnostic_path
    get collaborator_journey_path

    expect_inertia.to render_component("collaborator/journeys/show")
  end

  it "opens the journey right away for a collaborator already on board" do
    sign_in create(:user)

    get collaborator_journey_path

    expect_inertia.to render_component("collaborator/journeys/show")
  end
end
