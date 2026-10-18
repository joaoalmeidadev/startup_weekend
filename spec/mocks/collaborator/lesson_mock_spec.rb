require "rails_helper"

RSpec.describe Collaborator::LessonMock do
  it "is worth what the learner's step is worth, under the step's name" do
    props = described_class.new("rotinas-da-distribuidora").props

    expect(props).to include(points: 23, module_name: "Rotinas de atendimento")
    expect(props).not_to include(:step_id)
  end

  it "says which step is missing when the learner's path does not have it" do
    stub_const("#{described_class}::LESSONS", {"orphan" => {step_id: "nope"}})

    expect { described_class.new("orphan").props }.to raise_error(KeyError, /nope/)
  end
end
