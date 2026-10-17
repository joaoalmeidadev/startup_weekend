module Management
  # Example company settings
  class SettingsMock
    def props
      {
        alert_days: 30,
        alert_options: [15, 30, 60],
        ranking_enabled: true,
        badges: [
          {name: "Nivelado em Atendimento", enabled: true},
          {name: "Nivelado em Logística", enabled: true},
          {name: "5 dias seguidos", enabled: true},
          {name: "Cultura da Empresa", enabled: false}
        ]
      }
    end
  end
end
