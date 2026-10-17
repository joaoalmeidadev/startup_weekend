module Collaborator
  # Example journey from the Stitch "Minha jornada" screen until journeys are modelled
  class JourneyMock
    # preview: "empty" shows the state before HR assigns a journey (demo only)
    def initialize(preview: nil)
      @empty = preview == "empty"
    end

    def props
      return empty_props if @empty

      {
        today: {minutes: 5, owner: "Distribuidora Sul"},
        step: {current: 4, total: 6},
        sections: sections,
        badge: {
          title: "Selo: Nivelado em Atendimento",
          description: "Complete todas as lições acima para receber seu certificado oficial da empresa."
        },
        summary: {completed: 3, percent: 50},
        extra_task: {text: "Avalie 2 colegas de equipe (2 min)", href: Rails.application.routes.url_helpers.collaborator_peer_review_path}
      }
    end

    private

    def empty_props
      {today: {minutes: 0, owner: "Distribuidora Sul"}, step: {current: 0, total: 0}, sections: [],
       badge: {title: "", description: ""}, summary: {completed: 0, percent: 0}}
    end

    def sections
      [
        {title: "1. Base: Soft skills e comunicação", lessons: [
          done("conversa-clara", "Conversa Clara no Trabalho"),
          done("matematica-do-dia-a-dia", "Matemática do Dia a Dia")
        ]},
        {title: "2. Empresa: Distribuidora Sul", lessons: [
          done("nossa-historia-e-valores", "Nossa História e Valores"),
          {id: "rotinas-da-distribuidora", module_id: "rotinas-da-distribuidora", title: "Rotinas da Distribuidora", status: "current", minutes: 5,
           description: "Aprenda o fluxo básico de entrada e despacho de mercadorias."}
        ]},
        {title: "3. Setor: Atendimento ao Cliente", lessons: [
          locked("Tratamento de Reclamações"),
          locked("Uso do Sistema")
        ]}
      ]
    end

    def done(module_id, title) = {module_id: module_id, title: title, status: "done"}

    def locked(title) = {title: title, status: "locked"}
  end
end
