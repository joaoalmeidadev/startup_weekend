type IconProps = {
  name: string
  className?: string
  filled?: boolean
}

// Material Symbols glyph; decorative, so the text next to it carries the meaning
export function Icon({ name, className = '', filled = false }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  )
}
