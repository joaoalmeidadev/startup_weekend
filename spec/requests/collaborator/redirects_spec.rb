require "rails_helper"

RSpec.describe "Collaborator old pages" do
  it "sends the old Meu progresso to the home" do
    get "/collaborator/progress"

    expect(response).to redirect_to("/collaborator/home")
    expect(response).to have_http_status(:found)
  end

  it "sends the old Minha jornada to the journeys" do
    get "/collaborator/journey"

    expect(response).to redirect_to("/collaborator/journeys")
  end
end
