module Management
  class SettingsController < BaseController
    def show
      render inertia: {settings: SettingsMock.new.props}
    end
  end
end
