require "rails_helper"

RSpec.describe "Admin Nivela area", :inertia do
  before { sign_in create(:user, :platform_admin) }

  it "lists the client companies with their plan and status" do
    get management_companies_path

    expect_inertia.to render_component("management/companies/index")
    expect(inertia.props[:companies].pluck(:name)).to eq(["Distribuidora Sul", "Metalúrgica Pampa", "Clínica Bem Viver"])
    expect(inertia.props[:numbers].size).to eq(3)
  end

  it "shows the Nivela base library" do
    get management_library_path

    expect_inertia.to render_component("management/libraries/show")
    expect(inertia.props[:modules].pluck(:id)).to include("conversa-clara", "matematica-do-dia-a-dia")
    expect(inertia.props[:modules].first[:lesson_titles]).not_to be_empty
  end
end
