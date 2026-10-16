# Idempotent development seeds
User.find_or_create_by!(email: "dev@example.com") do |user|
  user.password = "password123"
  user.admin = true
  puts "  ✓ Created dev admin (dev@example.com / password123)"
end
