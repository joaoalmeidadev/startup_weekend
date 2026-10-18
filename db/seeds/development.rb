# Idempotent development seeds
User.find_or_create_by!(email: "dev@example.com") do |user|
  user.password = "password123"
  user.admin = true
  puts "  ✓ Created dev admin (dev@example.com / password123)"
end

# One user per role for the Nivela demo (password: password123)
{
  "colaborador@nivela.dev" => :collaborator,
  "rh@nivela.dev" => :hr,
  "gestor@nivela.dev" => :manager,
  "admin@nivela.dev" => :platform_admin
}.each do |email, role|
  User.find_or_create_by!(email: email) do |user|
    user.password = "password123"
    user.role = role
    puts "  ✓ Created #{role} (#{email} / password123)"
  end
end

# Short logins for live demos (password: 12345678)
{
  "admin@nivela.com" => :hr,
  "gestor@nivela.com" => :manager,
  "colab@nivela.com" => :collaborator
}.each do |email, role|
  User.find_or_create_by!(email: email) do |user|
    user.password = "12345678"
    user.role = role
    puts "  ✓ Created #{role} (#{email} / 12345678)"
  end
end

# Newcomer for the onboarding demo: lands on the welcome screen until the diagnostic result
User.find_or_create_by!(email: "novo@nivela.com") do |user|
  user.password = "12345678"
  user.role = :collaborator
  puts "  ✓ Created collaborator newcomer (novo@nivela.com / 12345678)"
end
