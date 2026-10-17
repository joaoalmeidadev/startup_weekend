module Management
  # Example "Primeiros passos" checklist for a company that is halfway configured
  class SetupMock
    def props
      {
        steps: [
          step("Empresa e logo", "apartment", true, ["Nome da empresa", "Distribuidora Sul"], ["Cidade", "Pelotas/RS"]),
          step("Setores e cargos", "account_tree", true, ["Setores", "Atendimento, Comercial, Logística"]),
          step("Cultura e valores", "favorite", false, ["Missão", ""], ["Valores (separados por vírgula)", ""]),
          step("Convidar pessoas", "group_add", false, ["E-mails (separados por vírgula)", ""])
        ]
      }
    end

    private

    def step(title, icon, done, *fields)
      {title: title, icon: icon, done: done, fields: fields.map { |label, value| {label: label, value: value} }}
    end
  end
end
