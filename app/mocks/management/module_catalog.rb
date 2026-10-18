module Management
  # Example module library shared by the journey mocks.
  # source: where the content comes from — "ai" (company material turned into lessons by the AI, reviewed by HR),
  # "nivela" (ready-made Nivela library, the Base stretch) or "company" (written by the company without AI).
  # teaching_hours: hours of person-to-person hand-off the module replaces for each newcomer.
  module ModuleCatalog
    SOURCES = %w[ai nivela company].freeze

    MODULES = {
      # Nivela library: ready to use in any sector. research_share = % of the 16 surveyed companies citing the skill as a gap
      "raciocinio-logico" => {name: "Raciocínio Lógico na Prática", competency: "Raciocínio", stretch: :base, lessons: 4, status: "published", source: "nivela", teaching_hours: 2, research_share: 56},
      "interpretacao-de-instrucoes" => {name: "Interpretação de Instruções e Procedimentos", competency: "Interpretação", stretch: :base, lessons: 4, status: "published", source: "nivela", teaching_hours: 3, research_share: 44},
      "conversa-clara" => {name: "Conversa Clara no Trabalho", competency: "Comunicação", stretch: :base, lessons: 4, status: "published", source: "nivela", teaching_hours: 3, research_share: 44},
      "escrita-no-trabalho" => {name: "Escrita no Trabalho", competency: "Escrita", stretch: :base, lessons: 4, status: "published", source: "nivela", teaching_hours: 2, research_share: 38},
      "matematica-do-dia-a-dia" => {name: "Matemática do Dia a Dia", competency: "Matemática", stretch: :base, lessons: 5, status: "published", source: "nivela", teaching_hours: 3},
      "postura-e-empatia" => {name: "Postura e Empatia", competency: "Empatia", stretch: :base, lessons: 3, status: "published", source: "nivela", teaching_hours: 3},
      "atendimento-ao-cliente" => {name: "Atendimento ao Cliente: Fundamentos", competency: "Atendimento", stretch: :sector, lessons: 5, status: "published", source: "nivela", teaching_hours: 4},
      "resolucao-de-problemas" => {name: "Resolução de Problemas no Dia a Dia", competency: "Resolução", stretch: :sector, lessons: 4, status: "published", source: "nivela", teaching_hours: 3},
      "organizacao-e-tempo" => {name: "Organização e Gestão do Tempo", competency: "Organização", stretch: :sector, lessons: 4, status: "published", source: "nivela", teaching_hours: 2},
      "trabalho-em-equipe" => {name: "Trabalho em Equipe e Feedback", competency: "Colaboração", stretch: :sector, lessons: 4, status: "published", source: "nivela", teaching_hours: 3},
      "seguranca-no-trabalho" => {name: "Segurança e Boas Práticas no Trabalho", competency: "Segurança", stretch: :sector, lessons: 3, status: "published", source: "nivela", teaching_hours: 2},
      "vendas-basico" => {name: "Vendas: o Básico para Quem Atende", competency: "Vendas", stretch: :sector, lessons: 5, status: "published", source: "nivela", teaching_hours: 3},
      "nossa-historia-e-valores" => {name: "Nossa História e Valores", competency: "Cultura", stretch: :company, lessons: 3, status: "published", source: "company", teaching_hours: 2, material: "Apresentação institucional.pdf"},
      "rotinas-de-atendimento" => {name: "Rotinas de atendimento", competency: "Rotinas", stretch: :company, lessons: 8, status: "in_review", source: "ai", teaching_hours: 6, teacher_salary: 5500, material: "Manual de SAC.pdf"},
      "politica-de-trocas" => {name: "Política de Trocas e Devoluções", competency: "Devoluções", stretch: :company, lessons: 5, status: "published", source: "ai", teaching_hours: 4, material: "Política comercial.pdf"},
      "tratamento-de-reclamacoes" => {name: "Tratamento de Reclamações", competency: "Reclamações", stretch: :sector, lessons: 6, status: "draft", source: "company", teaching_hours: 5, teacher_salary: 5500, material: "Escrito pelo RH"},
      "uso-do-sistema" => {name: "Uso do Sistema", competency: "Sistema", stretch: :sector, lessons: 5, status: "draft", source: "company", teaching_hours: 4, teacher_salary: 3300, material: "Escrito pelo RH"},
      "conferencia-de-carga" => {name: "Conferência de Carga", competency: "Conferência", stretch: :sector, lessons: 5, status: "published", source: "ai", teaching_hours: 5, material: "Procedimento de expedição.pdf"},
      "seguranca-no-armazem" => {name: "Segurança no Armazém", competency: "Segurança", stretch: :sector, lessons: 4, status: "published", source: "ai", teaching_hours: 3, material: "Normas de segurança.pdf"}
    }.freeze

    def self.find(id)
      mod = MODULES.fetch(id) { raise ActiveRecord::RecordNotFound, "Module #{id} not found" }
      {material: "Biblioteca Nivela"}.merge(mod, id: id)
    end

    def self.summary(id)
      mod = find(id)
      mod.slice(:id, :name, :competency, :lessons, :status, :source, :teaching_hours)
        .merge(stretch: mod[:stretch].to_s, research_share: mod[:research_share], teacher_salary: mod[:teacher_salary])
    end

    def self.all
      MODULES.keys.map { |id| summary(id) }
    end

    # Every competency the library trains, once each
    def self.competencies
      all.pluck(:competency).uniq.sort
    end

    def self.by_source(source)
      all.select { |mod| mod[:source] == source }
    end
  end
end
