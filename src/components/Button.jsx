import { Link } from 'react-router-dom'

export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  type,
  className = '',
  children,
  ...props
}) {
  const cls = `btn btn-${variant} btn-${size} ${className}`.trim()
  if (to) {
    return (
      <Link to={to} className={cls} {...props}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type || 'button'} className={cls} {...props}>
      {children}
    </button>
  )
}
