module Management
  # Example AI lesson review from the Stitch "Revisar lição da IA" screens.
  # Every position shows the same sample lesson; only the progress around it changes.
  class LessonReviewMock
    TOTAL = 8
    FIRST_PENDING = 2
    JOURNEY_ID = "onboarding-atendimento"
    MODULE_ID = "rotinas-de-atendimento"

    def initialize(position)
      @position = position.clamp(1, TOTAL)
    end

    def props
      {
        position: @position,
        total: TOTAL,
        approved: @position - 1,
        final: @position == TOTAL,
        breadcrumb: breadcrumb,
        module_name: "Rotinas de atendimento",
        done_path: routes.management_library_path,
        team: "atendimento",
        manual: manual,
        lesson: lesson,
        question: question,
        other_questions: 1
      }
    end

    private

    def breadcrumb
      [
        {label: "Jornadas", href: routes.management_journeys_path},
        {label: "Onboarding Atendimento", href: routes.management_journey_path(JOURNEY_ID)},
        {label: "Módulo: Rotinas de atendimento", href: routes.management_learning_module_path(MODULE_ID)}
      ]
    end

    def routes = Rails.application.routes.url_helpers

    def manual
      {
        before: "Quando o cliente entrar em contato por motivo de atraso na entrega, o operador deve",
        highlight: "acolher a solicitação sem repassar a culpa para a transportadora",
        after: ". Deve abrir o chamado em até 15 minutos e comunicar com clareza a nova previsão estimada.",
        note: "Esse trecho orienta o operador de triagem a manter a postura institucional e registrar o prazo sem atritos no atendimento.",
        source: "Manual de SAC · página 14"
      }
    end

    def lesson
      {
        minutes: 5,
        title: "Como acolher uma reclamação de atraso",
        intro: "Quando o cliente reclama de entrega atrasada, ele quer ser ouvido e ter certeza de que o problema será resolvido. " \
               "Nosso papel é transmitir segurança e agilidade.",
        steps: [
          {title: "Acolha com calma:", body: "diga", quote: "Compreendo a urgência e vou acompanhar seu caso agora mesmo."},
          {title: "Abra o chamado em até 15 min:", body: "cadastre na tela de pendências com a prioridade correta."},
          {title: "Dê uma previsão realista:", body: "avise com certeza a data em que daremos o retorno da solução."}
        ]
      }
    end

    def question
      {
        prompt: "Um cliente ligou furioso porque o pedido de secos atrasou. O que o colaborador deve fazer?",
        options: [
          {text: "A) Explicar que a culpa é do trânsito na rodovia.", correct: false},
          {text: "B) Acolher com calma e registrar o chamado em até 15 minutos.", correct: true},
          {text: "C) Mandar ligar direto para a transportadora.", correct: false}
        ]
      }
    end
  end
end
