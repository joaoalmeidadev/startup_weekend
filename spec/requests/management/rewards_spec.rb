require "rails_helper"

RSpec.describe "Management rewards", :inertia do
  it "renders the empty rewards page" do
    sign_in create(:user, :hr)

    get management_rewards_path

    expect_inertia.to render_component("management/rewards/show")
  end

  it "is only for management" do
    sign_in create(:user)

    get management_rewards_path

    expect(response).to redirect_to(collaborator_journey_path)
  end
end
