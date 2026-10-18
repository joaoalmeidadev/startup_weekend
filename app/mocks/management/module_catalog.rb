module Management
  # Example module library shared by the journey mocks.
  # source: where the content comes from — "ai" (company material turned into lessons by the AI, reviewed by HR),
  # "nivela" (ready-made Nivela library, the Base stretch) or "company" (written by the company without AI).
  # teaching_hours: hours of person-to-person hand-off the module replaces for each newcomer.
  # covers: the sector goal competency the module trains, when it differs from its own competency name.
  module ModuleCatalog
    SOURCES = %w[ai nivela company].freeze

    MODULES = {
      # Nivela library: ready to use in any sector. research_share = % of the 16 surveyed companies citing the skill as a gap
      "raciocinio-logico" => {name: "Raciocínio Lógico na Prática", competency: "Raciocínio lógico", stretch: :base, lessons: 4, status: "published", source: "nivela", teaching_hours: 2, research_share: 56},
      "interpretacao-de-instrucoes" => {name: "Interpretação de Instruções e Procedimentos", competency: "Interpretação de instruções", stretch: :base, lessons: 4, status: "published", source: "nivela", teaching_hours: 3, research_share: 44},
      "conversa-clara" => {name: "Conversa Clara no Trabalho", competency: "Comunicação clara", covers: "Comunicação e Escuta Ativa", stretch: :base, lessons: 4, status: "published", source: "nivela", teaching_hours: 3, research_share: 44},
      "escrita-no-trabalho" => {name: "Escrita no Trabalho", competency: "Português e escrita", stretch: :base, lessons: 4, status: "published", source: "nivela", teaching_hours: 2, research_share: 38},
      "matematica-do-dia-a-dia" => {name: "Matemática do Dia a Dia", competency: "Matemática básica", stretch: :base, lessons: 5, status: "published", source: "nivela", teaching_hours: 3},
      "postura-e-empatia" => {name: "Postura e Empatia", competency: "Postura profissional", covers: "Postura e Empatia com Clientes Difíceis", stretch: :base, lessons: 3, status: "published", source: "nivela", teaching_hours: 3},
      "atendimento-ao-cliente" => {name: "Atendimento ao Cliente: Fundamentos", competency: "Atendimento ao cliente", stretch: :sector, lessons: 5, status: "published", source: "nivela", teaching_hours: 4},
      "resolucao-de-problemas" => {name: "Resolução de Problemas no Dia a Dia", competency: "Resolução de problemas", stretch: :sector, lessons: 4, status: "published", source: "nivela", teaching_hours: 3},
      "organizacao-e-tempo" => {name: "Organização e Gestão do Tempo", competency: "Organização e gestão do tempo", stretch: :sector, lessons: 4, status: "published", source: "nivela", teaching_hours: 2},
      "trabalho-em-equipe" => {name: "Trabalho em Equipe e Feedback", competency: "Trabalho em equipe", stretch: :sector, lessons: 4, status: "published", source: "nivela", teaching_hours: 3},
      "seguranca-no-trabalho" => {name: "Segurança e Boas Práticas no Trabalho", competency: "Segurança no trabalho", stretch: :sector, lessons: 3, status: "published", source: "nivela", teaching_hours: 2},
      "vendas-basico" => {name: "Vendas: o Básico para Quem Atende", competency: "Vendas básicas", stretch: :sector, lessons: 5, status: "published", source: "nivela", teaching_hours: 3},
      "nossa-historia-e-valores" => {name: "Nossa História e Valores", competency: "Cultura da empresa", stretch: :company, lessons: 3, status: "published", source: "company", teaching_hours: 2, material: "Apresentação institucional.pdf"},
      "rotinas-de-atendimento" => {name: "Rotinas de atendimento", competency: "Rotinas da Distribuidora", stretch: :company, lessons: 8, status: "in_review", source: "ai", teaching_hours: 6, material: "Manual de SAC.pdf"},
      "politica-de-trocas" => {name: "Política de Trocas e Devoluções", competency: "Trocas e devoluções", stretch: :company, lessons: 5, status: "published", source: "ai", teaching_hours: 4, material: "Política comercial.pdf"},
      "tratamento-de-reclamacoes" => {name: "Tratamento de Reclamações", competency: "Resolução de Reclamações de Entrega", stretch: :sector, lessons: 6, status: "draft", source: "company", teaching_hours: 5, material: "Escrito pelo RH"},
      "uso-do-sistema" => {name: "Uso do Sistema", competency: "Uso do Sistema Interno de Pedidos", stretch: :sector, lessons: 5, status: "draft", source: "company", teaching_hours: 4, material: "Escrito pelo RH"},
      "conferencia-de-carga" => {name: "Conferência de Carga", competency: "Conferência e expedição", stretch: :sector, lessons: 5, status: "published", source: "ai", teaching_hours: 5, material: "Procedimento de expedição.pdf"},
      "seguranca-no-armazem" => {name: "Segurança no Armazém", competency: "Segurança no armazém", stretch: :sector, lessons: 4, status: "published", source: "ai", teaching_hours: 3, material: "Normas de segurança.pdf"}
    }.freeze

    def self.find(id)
      mod = MODULES.fetch(id) { raise ActiveRecord::RecordNotFound, "Module #{id} not found" }
      {material: "Biblioteca Nivela"}.merge(mod, id: id)
    end

    def self.summary(id)
      mod = find(id)
      mod.slice(:id, :name, :competency, :lessons, :status, :source, :teaching_hours)
        .merge(stretch: mod[:stretch].to_s, covers: mod.fetch(:covers, mod[:competency]), research_share: mod[:research_share])
    end

    def self.all
      MODULES.keys.map { |id| summary(id) }
    end

    def self.by_source(source)
      all.select { |mod| mod[:source] == source }
    end
  end
end
