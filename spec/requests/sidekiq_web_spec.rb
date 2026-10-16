require "rails_helper"

RSpec.describe "Sidekiq dashboard" do
  it "redirects guests to the login page" do
    get "/sidekiq"

    expect(response).to redirect_to("/users/sign_in")
  end

  it "is hidden from regular users" do
    sign_in create(:user)

    get "/sidekiq"

    expect(response).to have_http_status(:not_found)
  end

  it "is available to admins" do
    sign_in create(:user, :admin)

    get "/sidekiq"

    expect(response).to have_http_status(:ok)
  end
end
