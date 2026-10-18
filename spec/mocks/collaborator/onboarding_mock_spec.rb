require "rails_helper"

RSpec.describe Collaborator::OnboardingMock do
  subject(:onboarding) { described_class.new }

  it "is pending for the demo newcomer who has not finished the diagnostic" do
    user = build(:user, email: "novo@nivela.com")

    expect(onboarding.pending?(user, {})).to be(true)
  end

  it "is done once the newcomer reaches the diagnostic result" do
    user = build(:user, email: "novo@nivela.com")

    expect(onboarding.pending?(user, {onboarded: true})).to be(false)
  end

  it "is never pending for other collaborators" do
    expect(onboarding.pending?(build(:user), {})).to be(false)
  end
end
