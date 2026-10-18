module Management
  # Rewards the team trades for study points. Each lesson saves ~0,6 h of someone training in person
  # (R$ 40/h), so a point is worth ~R$ 1,20 of training saved; a reward gives back at most 40% of that.
  # The collaborator only sees points and rewards; the cost math is for the manager.
  class RewardCatalog
    POINT_VALUE = 1.2
    SHARE = 0.4
    MIN_POINTS = 30
    HOURLY_COST = 40

    # name, icon, category, cost in R$, stock (nil = unlimited)
    REWARDS = [
      ["Caneca Nivela", "coffee", "Brinde", 25, 20],
      ["Vale-lanche", "lunch_dining", "Vale", 30, nil],
      ["Ingresso de cinema", "movie", "Experiência", 40, 10],
      ["Escolher a escala da semana", "calendar_month", "Folga", 0, nil],
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

    def self.rule = {point_value: POINT_VALUE, share: SHARE, min_points: MIN_POINTS, hourly_cost: HOURLY_COST}

    # Enough points for the training saved to cover the cost at the share; integer math avoids float ceil surprises
    def self.points_for(cost)
      [(Rational(cost) / (Rational("1.2") * Rational("0.4"))).ceil, MIN_POINTS].max
    end

    def self.saved_for(points) = (points * POINT_VALUE).round(2)

    def self.rewards = REWARDS.map { |row| build(*row) }

    def self.ideas = IDEAS.map { |row| build(*row) }

    def self.find(name) = rewards.find { |reward| reward[:name] == name }

    def self.build(name, icon, category, cost, stock)
      {id: name.parameterize, name: name, icon: icon, category: category, cost: cost, points: points_for(cost), stock: stock}
    end
    private_class_method :build
  end
end
