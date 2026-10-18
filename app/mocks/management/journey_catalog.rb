module Management
  # Example journeys built by HR. Stretches are fixed: Base → Empresa → Setor.
  # The goal is the sector goal (Meta do setor) plus the company-specific competencies of the journey.
  module JourneyCatalog
    STRETCHES = {base: "Base", company: "Empresa", sector: "Setor"}.freeze

    JOURNEYS = {
      "onboarding-atendimento" => {
        name: "Onboarding Atendimento", status: "active", people_in_progress: 14, badge: "Nivelado em Atendimento",
        audience: ["Setor Atendimento", "Novatos"], sector: "Atendimento", extra_goal: ["Rotinas da Distribuidora"],
        modules: {base: %w[conversa-clara matematica-do-dia-a-dia], company: %w[nossa-historia-e-valores rotinas-de-atendimento],
                  sector: %w[tratamento-de-reclamacoes uso-do-sistema]}
      },
      "onboarding-logistica" => {
        name: "Onboarding Logística", status: "active", people_in_progress: 12, badge: "Nivelado em Logística",
        audience: ["Setor Logística", "Novatos"], sector: "Logística",
        extra_goal: ["Matemática básica", "Raciocínio lógico", "Cultura da empresa", "Conferência e expedição", "Segurança no armazém"],
        modules: {base: %w[matematica-do-dia-a-dia raciocinio-logico], company: %w[nossa-historia-e-valores],
                  sector: %w[conferencia-de-carga]}
      },
      "promocao-para-lider" => {
        name: "Promoção para líder", status: "draft", people_in_progress: 0, badge: "Nivelado em Liderança",
        audience: ["3 pessoas selecionadas"], sector: nil,
        extra_goal: ["Comunicação e Escuta Ativa", "Postura e Empatia com Clientes Difíceis", "Português e escrita", "Raciocínio lógico"],
        modules: {base: %w[postura-e-empatia escrita-no-trabalho], company: [], sector: []}
      }
    }.freeze

    def self.find(id)
      JOURNEYS.fetch(id) { raise ActiveRecord::RecordNotFound, "Journey #{id} not found" }.merge(id: id)
    end

    def self.all
      JOURNEYS.keys.map { |id| find(id) }
    end

    def self.using_module(module_id)
      all.select { |journey| journey[:modules].values.flatten.include?(module_id) }
    end
  end
end
