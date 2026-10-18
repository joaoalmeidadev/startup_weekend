require "rails_helper"

RSpec.describe Management::PointsRule do
  subject(:rule) { described_class.new }

  it "turns the monthly salaries into hours (salary ÷ 220 h), with no extra charges" do
    expect(rule.teacher_hourly).to eq(20)
    expect(rule.learner_hourly).to eq(10)
    expect(rule.hour_cost).to eq(30)
  end

  it "gives the learner points for each hour studied: their own hour × the company's share (1 pt = R$ 1)" do
    expect(rule.points_per_hour).to eq(4)
    expect(described_class.new(reward_share: 0.6).points_per_hour).to eq(6)
  end

  it "prices the hours studied with the learner's own salary when it was informed" do
    expect(rule.points_for(5)).to eq(20)
    expect(rule.points_for(8, salary: 2090)).to eq(30)
    expect(rule.points_per_hour(salary: 2090)).to eq(3.8)
  end

  it "measures the saving with both hours, who teaches and who learns" do
    expect(rule.saved_for(9)).to eq(270)
  end

  it "shares the company default with the pages" do
    expect(rule.props).to eq(teacher_salary: 4400, learner_salary: 2200, reward_share: 0.4)
  end

  it "uses a sector's own salaries when it has them, and the company default otherwise" do
    expect(described_class.for_sector("Logística").hour_cost).to eq(27)
    expect(described_class.for_sector("Logística").points_per_hour).to eq(3.6)
    expect(described_class.for_sector("Atendimento").hour_cost).to eq(30)
    expect(described_class.for_sector("Staff").hour_cost).to eq(30)
  end

  it "picks the cheapest hour among several sectors, so rewards never go beyond the saving" do
    expect(described_class.cheapest(%w[Atendimento Logística]).hour_cost).to eq(27)
    expect(described_class.cheapest([]).hour_cost).to eq(30)
  end

  it "tells whether a sector has its own training cost" do
    expect(described_class.own_cost?("Logística")).to be(true)
    expect(described_class.own_cost?("Atendimento")).to be(false)
  end
end
