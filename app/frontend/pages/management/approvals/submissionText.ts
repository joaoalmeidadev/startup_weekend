const decimal = (value: number) => value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })

// Round reais stay short (R$ 12); broken ones show the cents (R$ 9,50)
const money = (value: number) =>
  Number.isInteger(value)
    ? decimal(value)
    : value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const hoursText = (hours: number) => `${decimal(hours)} h de treino`

// The suggestion explained: hours informed × the author's own hour × the company share
export const pointsFormula = ({
  hours,
  hourly,
  share,
  points,
}: {
  hours: number
  hourly: number
  share: number
  points: number
}) => `${decimal(hours)} h × R$ ${money(hourly)}/h × ${Math.round(share * 100)}% = ${points} pts`

export const firstName = (name: string) => name.trim().split(/\s+/)[0]
