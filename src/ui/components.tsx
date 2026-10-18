import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon, type IconName } from '../graphics/icons';
import { Owl, type OwlMood } from '../graphics/Owl';
import { speak } from './speech';

type Variant = 'primary' | 'forest' | 'ghost' | 'plain';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  big?: boolean;
  wide?: boolean;
  icon?: IconName;
}

export function Button({ variant = 'plain', big, wide, icon, className = '', children, ...rest }: ButtonProps) {
  const classes = [
    'btn',
    variant !== 'plain' && `btn--${variant}`,
    big && 'btn--big',
    wide && 'btn--wide',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type="button" className={classes} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

export function IconButton({ icon, label, ...rest }: { icon: IconName; label: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type="button" className="btn icon-btn" aria-label={label} title={label} {...rest}>
      <Icon name={icon} />
    </button>
  );
}

interface ScreenProps {
  title?: string;
  onBack?: () => void;
  right?: ReactNode;
  center?: boolean;
  children: ReactNode;
}

export function Screen({ title, onBack, right, center, children }: ScreenProps) {
  return (
    <div className="screen">
      {(title || onBack || right) && (
        <header className="topbar">
          {onBack ? <IconButton icon="back" label="Tillbaka" onClick={onBack} /> : <span />}
          {title && <span className="topbar__title">{title}</span>}
          {right ?? <span style={{ width: 60 }} />}
        </header>
      )}
      <main className={`screen__body${center ? ' screen__body--center' : ''}`}>{children}</main>
    </div>
  );
}

/** The owl with a speech bubble. Text can be read aloud for children who do not read yet. */
export function Guide({ mood = 'happy', children, say }: { mood?: OwlMood; children: ReactNode; say: string }) {
  return (
    <div className="guide">
      <Owl mood={mood} size={110} />
      <div className="bubble">
        <span className="bubble__text">{children}</span>
        <button type="button" className="btn bubble__speak" aria-label="Läs upp" title="Läs upp" onClick={() => speak(say)}>
          <Icon name="listen" size={24} />
        </button>
      </div>
    </div>
  );
}

export function Dots({ total, current }: { total: number; current: number }) {
  return (
    <div className="dots" aria-label={`${Math.min(current + 1, total)} av ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`dot${i < current ? ' dot--done' : i === current ? ' dot--current' : ''}`} />
      ))}
    </div>
  );
}
