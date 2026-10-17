require "rails_helper"
require "csv"

RSpec.describe "People report export" do
  it "downloads the people list as CSV" do
    sign_in create(:user, :hr)

    get management_people_path(format: :csv)

    expect(response.media_type).to eq("text/csv")
    expect(response.headers["Content-Disposition"]).to include("pessoas-nivela.csv")
    rows = CSV.parse(response.body, headers: true)
    expect(rows.headers).to eq(%w[Nome Setor Status])
    expect(rows["Nome"]).to include("Maria Souza")
  end
end
