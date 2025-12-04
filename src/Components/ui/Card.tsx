
export const Card = ({
  header,
  image,
  badge,
  children,
  footer,
  actions,
  className = '',
  style = {},
  bodyClassName = '',
  rounded = true,
} : {
  header?: React.ReactNode;
  image?: {
    src: string;
    alt?: string;
    style?: React.CSSProperties;
    height?: number;
    cover?: boolean;
    top?: boolean;
  };
  badge?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  bodyClassName?: string;
  rounded?: boolean;
}) => {
  const roundedClass = rounded ? 'rounded-3' : '';

  return (
    <div className={`card shadow-sm ${className} ${roundedClass}`} style={style}>
      {image && image.top && (
        <div className="position-relative">
          <img
            src={image.src}
            alt={image.alt || 'card image'}
            className={`card-img-top ${image.cover ? '' : ''}`}
            style={image.style || { height: image.height || 180, objectFit: image.cover ? 'cover' : 'contain' }}
          />
          {badge && (
            <span className="position-absolute top-0 end-0 m-2 badge bg-primary">{badge}</span>
          )}
        </div>
      )}

      {header && <div className="card-header bg-transparent border-0">{header}</div>}

      <div className={`card-body ${bodyClassName}`}>
        {children}
      </div>

      {actions && <div className="card-body border-top pt-2">{actions}</div>}

      {footer && <div className="card-footer bg-transparent border-0">{footer}</div>}
    </div>
  );
};
