require "rails_helper"

RSpec.describe "Authentication", :js do
  it "lets a visitor sign up, sign out and sign back in" do
    visit root_path
    click_link "Criar conta"

    fill_in "E-mail", with: "jane@example.com"
    fill_in "Senha", with: "password123"
    fill_in "Confirmar senha", with: "password123"
    click_button "Criar conta"

    expect(page).to have_content("Olá, jane@example.com")

    click_button "Sair"
    expect(page).to have_content("Bem-vindo")

    click_link "Entrar"
    fill_in "E-mail", with: "jane@example.com"
    fill_in "Senha", with: "password123"
    click_button "Entrar"

    expect(page).to have_content("Olá, jane@example.com")
  end

  it "shows validation errors on invalid sign up" do
    visit new_user_registration_path

    fill_in "E-mail", with: "jane@example.com"
    fill_in "Senha", with: "123"
    fill_in "Confirmar senha", with: "123"
    click_button "Criar conta"

    expect(page).to have_content("is too short")
  end

  it "shows an alert on wrong credentials" do
    create(:user, email: "jane@example.com", password: "password123")
    visit new_user_session_path

    fill_in "E-mail", with: "jane@example.com"
    fill_in "Senha", with: "wrong-password"
    click_button "Entrar"

    expect(page).to have_content("Invalid email or password.")
  end
end
