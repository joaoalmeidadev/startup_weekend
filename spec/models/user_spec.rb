require "rails_helper"

# == Schema Information
#
# Table name: users
#
#  id                     :bigint           not null, primary key
#  admin                  :boolean          default(FALSE), not null
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  remember_created_at    :datetime
#  reset_password_sent_at :datetime
#  reset_password_token   :string
#  role                   :string           default("collaborator"), not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#
# Indexes
#
#  index_users_on_email                 (email) UNIQUE
#  index_users_on_reset_password_token  (reset_password_token) UNIQUE
#  index_users_on_role                  (role)
#
RSpec.describe User do
  subject(:user) { build(:user) }

  it { is_expected.to validate_presence_of(:email) }
  it { is_expected.to validate_uniqueness_of(:email).case_insensitive }
  it { is_expected.to validate_presence_of(:password) }
  it { is_expected.to validate_length_of(:password).is_at_least(6) }

  it do
    expect(user).to define_enum_for(:role)
      .with_values(collaborator: "collaborator", hr: "hr", manager: "manager", platform_admin: "platform_admin")
      .backed_by_column_of_type(:string)
  end

  it "is a collaborator by default" do
    expect(User.new).to be_collaborator
  end

  it "has a valid factory" do
    expect(user).to be_valid
  end
end
