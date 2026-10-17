module Collaborator
  # Example diagnostic: a few questions per stretch, then what the journey will cover
  class DiagnosticMock
    def props
      {questions: questions}
    end

    def result
      {
        known: ["Conversa clara com colegas", "Valores da Distribuidora Sul", "Atendimento por telefone"],
        to_learn: ["Porcentagem e regra de três", "Rotinas de entrada e despacho", "Tratamento de reclamações"],
        modules: 6,
        minutes_per_day: 5
      }
    end

    private

    def questions
      [
        {stretch: "Base", kind: "objective",
         prompt: "Um produto custa R$ 80 e está com 25% de desconto. Quanto o cliente paga?",
         options: ["R$ 55", "R$ 60", "R$ 64", "R$ 75"]},
        {stretch: "Base", kind: "objective",
         prompt: "Qual destas frases está escrita do jeito certo?",
         options: ["A gente vamos ligar amanhã.", "Vamos ligar para o senhor amanhã.", "Nós vai ligar amanhã."]},
        {stretch: "Empresa", kind: "scenario",
         prompt: "Um colega novo não sabe onde registrar uma devolução. O que você faz?",
         options: ["Mostro o caminho no sistema e explico o porquê.", "Digo para ele perguntar ao gestor.", "Faço o registro por ele, sem explicar."]},
        {stretch: "Setor", kind: "scenario",
         prompt: "Um cliente chega irritado porque o pedido atrasou. O que você faz?",
         options: ["Explico que a culpa é da transportadora.", "Escuto, peço desculpas e abro o chamado.", "Peço para ele ligar mais tarde.", "Passo a ligação para outro colega."]}
      ]
    end
  end
end
