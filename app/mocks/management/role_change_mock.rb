module Management
  # Example role change: what each new role requires compared to what the person already knows
  class RoleChangeMock
    ROLES = {
      "Supervisor de atendimento" => ["Comunicação clara", "Rotinas da Distribuidora", "Resolução de Reclamações de Entrega", "Postura profissional"],
      "Vendedor interno" => ["Comunicação clara", "Matemática básica", "Português e escrita"],
      "Conferente" => ["Matemática básica", "Raciocínio lógico", "Conferência e expedição"]
    }.freeze

    def initialize(person_id)
      @person = PersonMock.new(person_id).props
    end

    def props
      {
        person: @person.slice(:id, :name, :role, :sector),
        roles: ROLES.reject { |title, _| title == @person[:role] }.map { |title, required| role(title, required) }
      }
    end

    private

    def role(title, required)
      missing = required - @person[:knows]
      {title: title, missing: missing, weeks: [missing.size, 1].max}
    end
  end
end
