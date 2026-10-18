module Management
  # Example people behind the management area: the team manager has their own name
  class ManagerMock
    COMPANY = "Distribuidora Sul"

    def initialize(user = nil)
      @user = user
    end

    def props
      return {name: "Rafael Costa", role_label: "Gestor · Atendimento", company: COMPANY} if @user&.manager?

      {name: "Ana Lima", role_label: "RH", company: COMPANY}
    end
  end
end
