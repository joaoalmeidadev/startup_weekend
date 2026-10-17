require "rails_helper"

RSpec.describe "Management setup", :inertia do
  before { sign_in create(:user, :hr) }

  it "renders the four setup steps, the first two already done" do
    get management_setup_path

    expect_inertia.to render_component("management/setups/show")
    steps = inertia.props[:steps]
    expect(steps.pluck(:title)).to eq(["Empresa e logo", "Setores e cargos", "Cultura e valores", "Convidar pessoas"])
    expect(steps.pluck(:done)).to eq([true, true, false, false])
  end

  it "points the home page to the unfinished setup" do
    get management_root_path

    expect(inertia.props[:home][:setup]).to include(done: 2, total: 4, href: management_setup_path)
  end
end
