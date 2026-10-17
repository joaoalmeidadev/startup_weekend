module Collaborator
  # Example 360 review: a few statements about each colleague, on a 5-step scale
  class PeerReviewMock
    def props
      {
        colleagues: [{name: "Joana Lima", sector: "Atendimento"}, {name: "Carlos Souza", sector: "Atendimento"}],
        statements: ["explica as coisas com clareza?", "ajuda os colegas quando precisam?", "trata os clientes com calma?"],
        scale: ["Nunca", "Raramente", "Às vezes", "Quase sempre", "Sempre"]
      }
    end
  end
end
