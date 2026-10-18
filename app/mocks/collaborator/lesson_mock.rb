module Collaborator
  # Example microlesson shown by "Continuar" on the home and the journeys. It is a lesson of a journey step,
  # so it is worth what Learner says that step is worth.
  class LessonMock
    LESSONS = {
      "rotinas-da-distribuidora" => {
        title: "Rotinas da Distribuidora",
        step_id: "rotinas-de-atendimento",
        minutes: 5,
        video: {title: "Do caminhão à prateleira", duration: "1:45"},
        explanation: [
          "Toda mercadoria que chega passa pela conferência antes de ir para o estoque.",
          "Se algo vier faltando ou avariado, anote na nota e avise o responsável na hora.",
          "Só depois de conferida a mercadoria pode ser separada para os pedidos."
        ],
        question: {
          prompt: "Chegou uma caixa amassada. Qual é o primeiro passo?",
          options: [
            {text: "Guardar no estoque e avisar depois.", correct: false, feedback: "Quase! Antes de guardar, a mercadoria precisa ser conferida."},
            {text: "Anotar na nota e avisar o responsável.", correct: true, feedback: "Isso mesmo! Registrar na hora evita prejuízo e retrabalho."},
            {text: "Devolver ao motorista sem falar com ninguém.", correct: false, feedback: "Quase! Primeiro registre e avise o responsável."}
          ]
        },
        badge: "Rotinas da Distribuidora"
      }
    }.freeze

    def initialize(id)
      @id = id
      @lesson = LESSONS.fetch(id) { raise ActiveRecord::RecordNotFound, "Lesson #{id} not found" }
    end

    def props
      @lesson.except(:step_id).merge(id: @id, module_name: step[:name], points: step[:points])
    end

    private

    def step
      @step ||= Learner.new.props[:journeys].flat_map { |journey| journey[:steps] }
        .find { |item| item[:module_id] == @lesson[:step_id] } ||
        raise(KeyError, "Step #{@lesson[:step_id]} is not in the learner's path")
    end
  end
end
