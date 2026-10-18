module Management
  # Rewards the team trades for study points. One point is worth R$ 1, so a reward costs as many points as reais;
  # how many points an hour of study earns comes from the admin's PointsRule. A free reward gets hand-set points.
  class RewardCatalog
    # name, icon, category, cost in R$, stock (nil = unlimited), points when the reward costs nothing
    REWARDS = [
      ["Caneca Nivela", "coffee", "Brinde", 25, 20],
      ["Vale-lanche", "lunch_dining", "Vale", 30, nil],
      ["Ingresso de cinema", "movie", "Experiência", 40, 10],
      ["Escolher a escala da semana", "calendar_month", "Folga", 0, nil, 40],
      ["Meio período de folga", "schedule", "Folga", 75, nil],
      ["Dia de folga", "beach_access", "Folga", 150, nil]
    ].freeze

    IDEAS = [
      ["Vale-combustível", "local_gas_station", "Vale", 50, nil],
      ["Almoço com o gestor", "restaurant", "Experiência", 60, nil],
      ["Camiseta da empresa", "checkroom", "Brinde", 45, nil],
      ["Livro ou curso", "menu_book", "Experiência", 80, nil],
      ["Kit café", "local_cafe", "Brinde", 35, nil]
    ].freeze

    def self.rewards = REWARDS.map { |row| build(*row) }

    def self.ideas = IDEAS.map { |row| build(*row) }

    def self.find(name) = rewards.find { |reward| reward[:name] == name }

    def self.build(name, icon, category, cost, stock, points = cost)
      {id: name.parameterize, name: name, icon: icon, category: category, cost: cost, points: points, stock: stock}
    end
    private_class_method :build
  end
end
