module Management
  # Journeys proposed by collaborators to share what they know. The admin approves them and decides the points;
  # the suggestion is the hours informed × the author's own hour × the company share (same rule as studying).
  class KnowledgeSubmissionCatalog
    # id, author, title, sector, hours of in-person training it replaces, sent on, status, points awarded, lessons
    SUBMISSIONS = [
      {id: "conferir-devolucao", author: "Carla Silveira", title: "Como conferir uma devolução", sector: "Atendimento",
       hours: 3, sent_on: "15/10", status: "pending", awarded_points: nil,
       lessons: [["Antes de aceitar a devolução", "O que conferir primeiro quando o produto volta?",
         "A nota e o estado da embalagem", ["Só o nome do cliente", "Nada, aceita direto"]],
         ["Registrando no sistema", "Quando registrar a devolução no sistema?",
           "Na hora, antes de guardar o produto", ["No fim do mês", "Só se o gerente pedir"]]]},
      {id: "atalhos-do-sistema", author: "Rafael Lima", title: "Atalhos do sistema de pedidos", sector: "Atendimento",
       hours: 2, sent_on: "14/10", status: "pending", awarded_points: nil,
       lessons: [["Buscar um pedido rápido", "Qual o jeito mais rápido de achar um pedido?",
         "Buscar pelo número da nota", ["Rolar a lista inteira", "Pedir para o colega"]]]},
      {id: "clientes-dificeis", author: "Maria Souza", title: "Clientes difíceis: o que funciona", sector: "Atendimento",
       hours: 2, sent_on: "28/09", status: "approved", awarded_points: 8,
       lessons: [["Ouvir sem interromper", "O cliente está bravo. Qual o primeiro passo?",
         "Deixar ele terminar de falar", ["Interromper para explicar", "Passar para outra pessoa"]]]},
      {id: "planilha-de-rotas", author: "Maria Souza", title: "Planilha de rotas", sector: "Logística",
       hours: 1.5, sent_on: "16/10", status: "pending", awarded_points: nil,
       lessons: [["Ler a planilha", "Onde ver a rota do dia?",
         "Na aba Hoje, filtrada pelo seu nome", ["Na aba Histórico", "Perguntando para o motorista"]]]}
    ].freeze

    def self.all = SUBMISSIONS.map { |submission| build(submission) }

    def self.find(id) = all.find { |submission| submission[:id] == id }

    def self.pending = all.select { |submission| submission[:status] == "pending" }

    def self.by_author(name) = all.select { |submission| submission[:author] == name }

    def self.points_for(name) = by_author(name).sum { |submission| submission[:awarded_points].to_i }

    def self.build(submission)
      submission.merge(suggested_points: suggested_points(submission), lessons: submission[:lessons].map { |row| lesson(*row) })
    end

    def self.suggested_points(submission)
      author = PeopleMock::PEOPLE.find { |person| person[:name] == submission[:author] }
      PointsRule.for_sector(author[:sector]).points_for(submission[:hours], salary: author[:salary])
    end

    def self.lesson(title, prompt, right, wrongs)
      options = [{text: right, correct: true}] + wrongs.map { |wrong| {text: wrong, correct: false} }
      {title: title, question: {prompt: prompt, options: options}}
    end
    private_class_method :build, :suggested_points, :lesson
  end
end
