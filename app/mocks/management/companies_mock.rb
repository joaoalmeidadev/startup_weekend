module Management
  # Example client companies seen by the Nivela team
  class CompaniesMock
    def props
      {
        numbers: [
          {label: "Empresas ativas", value: "2"},
          {label: "Pessoas ativas", value: "116"},
          {label: "Média de nivelados", value: "54%"}
        ],
        companies: [
          {name: "Distribuidora Sul", plan: "Pro · R$ 18 por pessoa/mês", people: 42, leveled: 62, status: "active", next_charge: "10/11/2026 · R$ 756"},
          {name: "Metalúrgica Pampa", plan: "Essencial · R$ 12 por pessoa/mês", people: 74, leveled: 46, status: "active", next_charge: "05/11/2026 · R$ 888"},
          {name: "Clínica Bem Viver", plan: "Teste grátis · 30 dias", people: 9, leveled: 0, status: "trial", next_charge: "Teste termina em 12 dias"}
        ]
      }
    end
  end
end
