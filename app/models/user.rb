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
class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :recoverable, :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  # (:recoverable is off until the password reset pages exist, see ai-notes/todo.md)
  devise :database_authenticatable, :rememberable, :validatable

  # `admin` only grants access to /sidekiq; product access is driven by `role`
  enum :role, {
    collaborator: "collaborator",
    hr: "hr",
    manager: "manager",
    platform_admin: "platform_admin"
  }, default: :collaborator
end
