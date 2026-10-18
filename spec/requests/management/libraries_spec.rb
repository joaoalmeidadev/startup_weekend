require "rails_helper"

RSpec.describe "Management library", :inertia do
  it "lists the modules with the origin and how many journeys use each one" do
    sign_in create(:user, :hr)

    get management_library_path

    expect_inertia.to render_component("management/libraries/show")
    library = inertia.props[:library]
    expect(library.pluck(:source).uniq).to contain_exactly("ai", "nivela", "company")
    expect(library.find { |mod| mod[:id] == "nossa-historia-e-valores" }).to include(source: "company", journeys_count: 2)
    expect(library.find { |mod| mod[:id] == "seguranca-no-armazem" }).to include(journeys_count: 0)
  end

  it "is only for management" do
    sign_in create(:user)

    get management_library_path

    expect(response).to redirect_to(collaborator_journey_path)
  end
end
