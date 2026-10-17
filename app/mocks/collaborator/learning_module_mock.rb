module Collaborator
  # Example modules the collaborator can open from the journey (finished ones and the current one)
  class LearningModuleMock
    MODULES = {
      "conversa-clara" => {name: "Conversa Clara no Trabalho", lessons: ["Ouvir antes de responder", "Falar de um jeito simples", "Combinar e confirmar"], done: 3},
      "matematica-do-dia-a-dia" => {name: "Matemática do Dia a Dia", lessons: ["Somar e subtrair troco", "Porcentagem sem medo", "Regra de três na prática"], done: 3},
      "nossa-historia-e-valores" => {name: "Nossa História e Valores", lessons: ["Como a Distribuidora começou", "Nossos valores no dia a dia"], done: 2},
      "rotinas-da-distribuidora" => {name: "Rotinas da Distribuidora",
                                     lessons: ["Chegada do caminhão", "Conferência da nota", "Avarias e faltas", "Do caminhão à prateleira", "Separação de pedidos"],
                                     done: 3, current_lesson: "rotinas-da-distribuidora"}
    }.freeze

    def initialize(id)
      @module = MODULES.fetch(id) { raise ActiveRecord::RecordNotFound, "Module #{id} not available" }
    end

    def props
      {
        name: @module[:name],
        done: @module[:done],
        lessons: @module[:lessons].each_with_index.map { |title, index| {title: title, status: status(index)} },
        continue_path: continue_path
      }
    end

    private

    def status(index)
      return "done" if index < @module[:done]

      (index == @module[:done]) ? "current" : "locked"
    end

    def continue_path
      return unless @module[:current_lesson]

      Rails.application.routes.url_helpers.collaborator_lesson_path(@module[:current_lesson])
    end
  end
end
