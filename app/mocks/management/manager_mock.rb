module Management
  # Example person behind the management area: a single administrator sees every tab
  class ManagerMock
    COMPANY = "Distribuidora Sul"

    def props
      {name: "Ana Lima", role_label: "Administradora", company: COMPANY}
    end
  end
end
