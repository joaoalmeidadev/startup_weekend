require "rails_helper"

RSpec.describe "Home" do
  describe "GET /" do
    it "sends guests to the login page" do
      get root_path

      expect(response).to redirect_to(new_user_session_path)
    end

    it "sends signed-in users to their area" do
      sign_in create(:user, :manager)

      get root_path

      expect(response).to redirect_to(management_root_path)
    end
  end
end
