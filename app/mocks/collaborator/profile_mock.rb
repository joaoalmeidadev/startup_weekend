module Collaborator
  # Example settings from the Stitch "Meu perfil" screen
  class ProfileMock
    def props
      {
        reminder_time: "09:00",
        reminder_options: %w[08:00 09:00 13:30 17:00]
      }
    end
  end
end
