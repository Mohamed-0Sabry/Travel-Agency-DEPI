import React from "react";

interface CardProps {
  img: string;
  imgClass:string
  alt: string;
  title?: string;
  text?: string;
  btnLabel?: string;
  btnLink?: string;
  btnClass?: string;
  cardClass?: string;
  bodyClass?: string;
  children?: React.ReactNode;
  cardTitle?:string
}

export const Card: React.FC<CardProps> = ({
  img,
  imgClass,
  alt,
  title,
  text,
  btnLabel,
  btnClass = "btn btn-primary",
  cardClass = "card",
  bodyClass = "card-body",
  cardTitle='card-title',
  children,
}) => {
  return (
    <div className={cardClass}>
      <img src={img} className={imgClass} alt={alt} />
      <div className={bodyClass}>
        {children ? (
          children
        ) : (
          <>
            {title && <h3 className={cardTitle}>{title}</h3>}
            {text && <p className="card-text">{text}</p>}
            {btnLabel && (
              <button className={btnClass}>
                {btnLabel}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
