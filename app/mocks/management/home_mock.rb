module Management
  # Example HR home: three numbers and up to three things that need attention
  class HomeMock
    def props
      setup_steps = SetupMock.new.props[:steps]
      {numbers: numbers, attention: attention,
       setup: {done: setup_steps.count { |step| step[:done] }, total: setup_steps.size, href: routes.management_setup_path}}
    end

    private

    def numbers
      [
        {label: "Nivelados", value: "62%", icon: "verified", tone: "leveled"},
        {label: "Aprendendo", value: "30", icon: "trending_up", tone: "learning"},
        {label: "Precisam de atenção", value: "5", icon: "priority_high", tone: "attention"}
      ]
    end

    def attention
      [
        {icon: "rate_review", text: "7 lições da IA esperando sua revisão", action: "Revisar",
         href: routes.management_learning_module_path("rotinas-de-atendimento")},
        {icon: "person_alert", text: "5 pessoas abaixo da meta há mais de 30 dias", action: "Ver pessoas",
         href: routes.management_people_path},
        {icon: "tune", text: "Logística ainda não tem meta definida", action: "Definir meta",
         href: routes.management_sector_goal_path(sector: "Logística")}
      ]
    end

    def routes = Rails.application.routes.url_helpers
  end
end
