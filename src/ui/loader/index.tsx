import { cn } from 'utils';
import './loader.css';

type LoaderProps = {
  position?: 'fixed' | 'absolute';
};

function Loader({ position = 'fixed' }: LoaderProps) {
  return (
    <div
      className={cn('loader-wrapper', position)}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="loader-spinner" /></div>
  );
}

export default Loader;
