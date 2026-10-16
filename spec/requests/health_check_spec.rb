require "rails_helper"

RSpec.describe "Health check" do
  it "answers /up on loopback without the dev-only localhost redirect" do
    host! "127.0.0.1"

    get "/up"

    expect(response).to have_http_status(:ok)
  end
end
