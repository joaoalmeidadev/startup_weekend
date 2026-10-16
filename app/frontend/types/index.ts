export type FlashData = {
  notice?: string
  alert?: string
}

export type CurrentUser = {
  id: number
  email: string
}

export type SharedProps = {
  current_user: CurrentUser | null
  flash: FlashData
}
