module Management
  # Fictional lesson content for the content page: a short text and an answer key (question, three options, the
  # right one and why). Rotinas de atendimento has its SAC lessons; other contents get lessons from their competency.
  # Each lesson also comes in a format (video, audio, image, text or quiz) with how long it takes.
  class LessonBank
    # The first four lessons show every format; then quiz and text take turns
    OPENING_FORMATS = %w[video text audio image].freeze
    CLOSING_FORMATS = %w[quiz text].freeze

    DURATIONS = {"video" => "3:20", "audio" => "2:45", "image" => "1 min", "text" => "2 min de leitura", "quiz" => "1 min"}.freeze

    # The sponsor's video opening the customer service product, shown only by name
    SEBRAE_LESSON = {module_id: "atendimento-ao-cliente", position: 1, credit: "Sebrae · curso gratuito (ilustrativo)"}.freeze

    # title, question, right answer, two wrong ones, explanation
    SAC = [
      ["Qual é o primeiro passo ao atender um cliente?", "Cumprimentar, dizer o nome e ouvir até o fim",
        ["Pedir o número do pedido antes de ouvir", "Transferir direto para o supervisor"],
        "Ouvir primeiro deixa o cliente mais calmo e evita perguntas repetidas."],
      ["O cliente liga irritado com um atraso na entrega. O que você faz?", "Acolher com calma e registrar o chamado em até 15 minutos",
        ["Explicar que a culpa é do trânsito na rodovia", "Pedir para ele ligar direto para a transportadora"],
        "O manual pede registro em até 15 minutos; justificar atraso irrita mais."],
      ["O cliente quer cancelar um pedido já faturado. Qual o caminho?", "Abrir o cancelamento no sistema e avisar a expedição",
        ["Dizer que não dá mais para cancelar", "Pedir para ele recusar na hora da entrega"],
        "Faturado ainda pode ser cancelado antes de sair; a expedição precisa saber."],
      ["O cliente quer trocar um produto após 10 dias. O que fazer?", "Aceitar se tiver a nota e o produto estiver lacrado",
        ["Recusar, porque passou de 7 dias", "Trocar sem conferir nada"],
        "A política aceita trocas em até 30 dias com nota e lacre."],
      ["Um perecível chegou com a validade vencendo em 2 dias. O que fazer?", "Separar e avisar o responsável antes de guardar",
        ["Guardar no fundo do estoque", "Vender com desconto sem avisar ninguém"],
        "Perecível perto do vencimento tem regra própria; o responsável decide o destino."],
      ["Quando registrar o chamado?", "Na hora, durante a ligação",
        ["No fim do dia, com calma", "Só se o cliente pedir"],
        "Registrar na hora evita esquecer detalhes e conta no prazo."],
      ["A entrega atrasou de novo. Como avisar o cliente?", "Ligar antes do prazo vencer, já com a nova data",
        ["Esperar o cliente ligar", "Mandar só um e-mail genérico"],
        "Avisar antes, com data, reduz a reclamação."],
      ["Quando encerrar o chamado?", "Depois de confirmar com o cliente que resolveu",
        ["Assim que passar para outro setor", "Depois de 24 horas sem resposta"],
        "Só o cliente diz se resolveu; encerrar antes gera retrabalho."]
    ].freeze

    GENERIC = [
      ["Na prática, qual é o primeiro passo em %s?", "Entender a situação antes de agir",
        ["Resolver do jeito mais rápido", "Esperar alguém mandar"], "Entender antes evita refazer depois."],
      ["Um colega pede ajuda com %s. O que você faz?", "Explico o passo a passo que aprendi",
        ["Faço por ele para ir mais rápido", "Digo que não é comigo"], "Explicar o passo a passo espalha o padrão certo."],
      ["Como saber se fez certo em %s?", "Confiro com o padrão que a empresa ensinou",
        ["Vejo se ninguém reclamou", "Faço igual ao último que fez"], "O padrão da empresa é a referência, não o costume."]
    ].freeze

    def initialize(mod)
      @mod = mod
    end

    def text(position)
      return "Rotina do SAC, passo #{position}: o que fazer, em que ordem e por quê, em 5 minutos." if sac?

      "Em 5 minutos, como usar #{@mod[:competency].downcase} no dia a dia, com um exemplo da empresa."
    end

    def media(position)
      lesson_format = format_at(position)
      {format: lesson_format, duration: DURATIONS.fetch(lesson_format), credit: credit(position)}
    end

    # How many lessons of each format the module has, e.g. {video: 1, text: 2}
    def formats
      (1..@mod[:lessons]).map { |position| format_at(position).to_sym }.tally
    end

    def question(position)
      prompt, right, wrongs, explanation = sac? ? SAC[position - 1] : generic(position)
      options = wrongs.map { |wrong| {text: wrong, correct: false} }.insert((position - 1) % 3, {text: right, correct: true})
      {prompt: prompt, options: options, explanation: explanation}
    end

    private

    def sac? = @mod[:id] == "rotinas-de-atendimento"

    def format_at(position)
      OPENING_FORMATS[position - 1] || CLOSING_FORMATS[(position - 1 - OPENING_FORMATS.size) % CLOSING_FORMATS.size]
    end

    def credit(position)
      SEBRAE_LESSON[:credit] if @mod[:id] == SEBRAE_LESSON[:module_id] && position == SEBRAE_LESSON[:position]
    end

    def generic(position)
      prompt, *rest = GENERIC[(position - 1) % GENERIC.size]
      [format(prompt, @mod[:competency].downcase), *rest]
    end
  end
end
