module Management
  # Example admin dashboard: the team metrics for a period plus up to three things that need attention
  class HomeMock
    def initialize(period = nil)
      @dashboard = TeamDashboardMock.new(period)
    end

    def props
      @dashboard.props.merge(attention: attention)
    end

    private

    def attention
      [
        {icon: "rate_review", text: "7 lições da IA esperando sua revisão", action: "Revisar",
         href: routes.management_lesson_reviews_path},
        {icon: "person_alert", text: "5 pessoas abaixo da meta há mais de 30 dias", action: "Ver pessoas",
         href: routes.management_people_path},
        {icon: "tune", text: "Logística ainda não tem meta definida", action: "Definir meta",
         href: routes.management_sector_goal_path(sector: "Logística")}
      ]
    end

    def routes = Rails.application.routes.url_helpers
  end
end
