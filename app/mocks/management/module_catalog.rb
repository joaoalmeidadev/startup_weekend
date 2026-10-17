module Management
  # Example module library shared by the journey mocks. Base modules come from the Nivela catalog.
  module ModuleCatalog
    MODULES = {
      "conversa-clara" => {name: "Conversa Clara no Trabalho", competency: "Comunicação clara", stretch: :base, lessons: 4, status: "published", source: "Biblioteca Nivela"},
      "matematica-do-dia-a-dia" => {name: "Matemática do Dia a Dia", competency: "Matemática básica", stretch: :base, lessons: 5, status: "published", source: "Biblioteca Nivela"},
      "raciocinio-logico" => {name: "Raciocínio Lógico na Prática", competency: "Raciocínio lógico", stretch: :base, lessons: 4, status: "published", source: "Biblioteca Nivela"},
      "escrita-no-trabalho" => {name: "Escrita no Trabalho", competency: "Português e escrita", stretch: :base, lessons: 4, status: "published", source: "Biblioteca Nivela"},
      "postura-e-empatia" => {name: "Postura e Empatia", competency: "Postura profissional", stretch: :base, lessons: 3, status: "published", source: "Biblioteca Nivela"},
      "nossa-historia-e-valores" => {name: "Nossa História e Valores", competency: "Cultura da empresa", stretch: :company, lessons: 3, status: "published", source: "Apresentação institucional.pdf"},
      "rotinas-de-atendimento" => {name: "Rotinas de atendimento", competency: "Rotinas da Distribuidora", stretch: :company, lessons: 8, status: "in_review", source: "Manual de SAC.pdf (gerado por IA)"},
      "tratamento-de-reclamacoes" => {name: "Tratamento de Reclamações", competency: "Resolução de Reclamações de Entrega", stretch: :sector, lessons: 6, status: "draft", source: "Escrito pelo RH"},
      "uso-do-sistema" => {name: "Uso do Sistema", competency: "Uso do Sistema Interno de Pedidos", stretch: :sector, lessons: 5, status: "draft", source: "Escrito pelo RH"},
      "conferencia-de-carga" => {name: "Conferência de Carga", competency: "Conferência e expedição", stretch: :sector, lessons: 5, status: "published", source: "Procedimento de expedição.pdf"}
    }.freeze

    def self.find(id)
      MODULES.fetch(id) { raise ActiveRecord::RecordNotFound, "Module #{id} not found" }.merge(id: id)
    end

    def self.summary(id)
      find(id).slice(:id, :name, :competency, :lessons, :status)
    end

    def self.base_library
      MODULES.select { |_, mod| mod[:stretch] == :base }.keys.map { |id| summary(id) }
    end
  end
end
