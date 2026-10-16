require "rails_helper"

RSpec.describe "Home", :inertia do
  describe "GET /" do
    it "renders the home page for guests" do
      get root_path

      expect(response).to have_http_status(:ok)
      expect_inertia.to render_component("home/index")
      expect_inertia.to include_props(current_user: nil)
    end

    it "shares the signed-in user" do
      user = create(:user)
      sign_in user

      get root_path

      expect_inertia.to include_props(current_user: {"id" => user.id, "email" => user.email})
    end
  end
end
