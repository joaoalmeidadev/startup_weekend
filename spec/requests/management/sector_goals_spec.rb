require "rails_helper"

RSpec.describe "Management sector goal", :inertia do
  describe "GET /management/sector_goal" do
    it "renders each competency with the experts average and the current goal" do
      sign_in create(:user, :hr)

      get management_sector_goal_path

      expect_inertia.to render_component("management/sector_goals/show")
      expect(inertia.props[:sector_goal][:competencies].first).to include(experts_average: 88, goal: 80)
    end

    it "switches to another sector" do
      sign_in create(:user, :hr)

      get management_sector_goal_path(sector: "Comercial")

      expect(inertia.props[:sector_goal]).to include(sector: "Comercial")
      expect(inertia.props[:sector_goal][:competencies]).not_to be_empty
    end

    it "shows Logística without a goal yet" do
      sign_in create(:user, :hr)

      get management_sector_goal_path(sector: "Logística")

      expect(inertia.props[:sector_goal]).to include(sector: "Logística", experts_count: 0, competencies: [])
    end

    it "is only for management" do
      sign_in create(:user)

      get management_sector_goal_path

      expect(response).to redirect_to(collaborator_journey_path)
    end
  end
end
