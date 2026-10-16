require "rails_helper"

RSpec.describe "User registrations", :inertia do
  describe "GET /users/sign_up" do
    it "renders the sign up page" do
      get new_user_registration_path

      expect_inertia.to render_component("users/registrations/new")
    end
  end

  describe "POST /users" do
    let(:valid_params) do
      {user: {email: "new@example.com", password: "password123", password_confirmation: "password123"}}
    end

    it "creates the user and redirects home" do
      expect { post user_registration_path, params: valid_params }.to change(User, :count).by(1)

      expect(response).to redirect_to(root_path)
    end

    it "re-renders the sign up page with validation errors when invalid" do
      expect {
        post user_registration_path, params: {user: {email: "", password: "short", password_confirmation: "x"}}
      }.not_to change(User, :count)

      expect(response).to have_http_status(:unprocessable_content)
      expect_inertia.to render_component("users/registrations/new")
      expect(inertia.props[:errors].keys).to include("email", "password", "password_confirmation")
    end
  end
end
