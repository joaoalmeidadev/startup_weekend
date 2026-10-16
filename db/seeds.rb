# Loads environment-specific seeds from db/seeds/<env>.rb
seeds_file = Rails.root.join("db", "seeds", "#{Rails.env}.rb")

if seeds_file.exist?
  puts "Loading #{Rails.env} seeds..."
  load seeds_file
else
  puts "No seeds file found for #{Rails.env}"
end
