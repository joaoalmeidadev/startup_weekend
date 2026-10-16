require "rails_helper"

RSpec.describe "User sessions", :inertia do
  let!(:user) { create(:user, email: "jane@example.com", password: "password123") }

  describe "GET /users/sign_in" do
    it "renders the login page" do
      get new_user_session_path

      expect_inertia.to render_component("users/sessions/new")
    end
  end

  describe "POST /users/sign_in" do
    it "signs the user in and redirects home" do
      post user_session_path, params: {user: {email: "jane@example.com", password: "password123"}}

      expect(response).to redirect_to(root_path)
      expect(controller.current_user).to eq(user)
    end

    it "re-renders the login page with an alert on bad credentials" do
      post user_session_path, params: {user: {email: "jane@example.com", password: "wrong"}}

      expect(response).to have_http_status(:unprocessable_content)
      expect_inertia.to render_component("users/sessions/new")
      expect_inertia.to include_props(flash: {"alert" => "Invalid email or password."})
    end

    it "answers Inertia XHR requests with the login page instead of a 401" do
      post user_session_path,
        params: {user: {email: "jane@example.com", password: "wrong"}},
        headers: {"X-Inertia" => "true", "X-Requested-With" => "XMLHttpRequest"}

      expect(response).to have_http_status(:unprocessable_content)
      expect(response.headers["X-Inertia"]).to eq("true")
    end
  end

  describe "DELETE /users/sign_out" do
    it "signs the user out" do
      sign_in user

      delete destroy_user_session_path

      expect(response).to have_http_status(:see_other)
      expect(response).to redirect_to(root_path)
    end

    it "clears the encrypted Inertia history on the next page" do
      sign_in user

      delete destroy_user_session_path
      follow_redirect!

      page_json = Nokogiri::HTML(response.body).at_css("script[data-page]").text
      expect(JSON.parse(page_json)).to include("clearHistory" => true)
    end
  end
end
