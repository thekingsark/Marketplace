export type ValidIconSize =
  | 140
  | 128
  | 100
  | 96
  | 80
  | 76
  | 70
  | 68
  | 64
  | 48
  | 42
  | 40
  | 36
  | 34
  | 32
  | 30
  | 28
  | 24
  | 20
  | 18
  | 16
  | 14
  | 12
  | 8
  | 6
  | 4
  | 'auto'

interface IconProps {
  type: string
  size?: ValidIconSize
  rotate?: number
  color?: string
}

const ErrorComp = () => {
  return <div>Icon</div>
}

export const Icon = (params: IconProps) => {
  const { type, size = 24, rotate, color = 'currentColor' } = params

  let Svg
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    Svg = require(`../../../public/assets/svg/${type}.svg`).default
  } catch (error) {
    console.error('Icon not found', type, error)
    Svg = ErrorComp
  }

  const style = {
    '--rotate-deg': rotate ? `${rotate}deg` : '0deg',
    '--size': `${size}px`,
    '--color': color,
    '--error-color': color || 'red',
    '--fill-opacity': color !== 'currentColor' ? 1 : undefined,
  }

  return (
    <div className="icon" style={style as React.CSSProperties}>
      <Svg />
    </div>
  )
}
