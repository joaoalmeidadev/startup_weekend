require "rails_helper"

RSpec.describe "Collaborator home", :inertia do
  it "shares who is signed in for the layout" do
    sign_in create(:user)

    get collaborator_home_path

    expect(inertia.props[:viewer]).to include(name: "Maria Souza", company: "Distribuidora Sul")
  end

  it "sends management users back to their own area" do
    sign_in create(:user, :hr)

    get collaborator_home_path

    expect(response).to redirect_to(management_root_path)
  end

  it "asks guests to sign in" do
    get collaborator_home_path

    expect(response).to redirect_to(new_user_session_path)
  end
end
