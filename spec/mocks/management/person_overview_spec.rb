require "rails_helper"

RSpec.describe Management::PersonOverview do
  it "has no progress yet for someone no journey reaches" do
    newcomer = {name: "Ana Nova", sector: "Financeiro", status: "on_track", completed: 0, score: 40,
                last_active: "hoje", weekly_minutes: 0, days: 30}

    expect(described_class.new(newcomer).progress).to eq(percent: 0, current_module: nil)
  end
end
