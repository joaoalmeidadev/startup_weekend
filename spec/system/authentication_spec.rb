require "rails_helper"

RSpec.describe "Authentication", :js do
  def sign_in_with(email, password)
    visit root_path
    fill_in "E-mail", with: email
    fill_in "Senha", with: password
    click_button "Entrar"
  end

  it "takes a collaborator to the journey and back to the login on sign out" do
    create(:user, email: "maria@example.com", password: "password123")

    sign_in_with("maria@example.com", "password123")
    expect(page).to have_content("Sua Trilha de Aprendizado")

    click_link "Perfil", match: :first
    click_button "Sair da minha conta"
    expect(page).to have_button("Entrar")
  end

  it "takes an HR user to the management area and back to the login on sign out" do
    create(:user, :hr, email: "ana@example.com", password: "password123")

    sign_in_with("ana@example.com", "password123")
    expect(page).to have_content("Setores")

    click_button "Ana Lima"
    click_button "Sair"
    expect(page).to have_button("Entrar")
  end

  it "shows an alert on wrong credentials" do
    create(:user, email: "jane@example.com", password: "password123")

    sign_in_with("jane@example.com", "wrong-password")

    expect(page).to have_content("E-mail ou senha inválidos.")
  end
end
