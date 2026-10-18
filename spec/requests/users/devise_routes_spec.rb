require "rails_helper"

# Only sign in and sign out have Inertia pages. Anything else Devise would expose
# falls back to unstyled ERB views, so it stays disabled until built.
# Sign up is off on purpose: each company invites its own people (B2B).
RSpec.describe "Devise routes" do
  it "does not expose password recovery" do
    expect(Rails.application.routes.url_helpers).not_to respond_to(:new_user_password_path)
  end

  it "does not expose account editing or cancellation" do
    helpers = Rails.application.routes.url_helpers

    expect(helpers).not_to respond_to(:edit_user_registration_path)
    expect(helpers).not_to respond_to(:cancel_user_registration_path)
  end

  it "does not expose public sign up" do
    expect(Rails.application.routes.url_helpers).not_to respond_to(:new_user_registration_path)
  end
end
