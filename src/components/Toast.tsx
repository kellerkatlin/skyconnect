import { useEffect } from 'react';

export type ToastInfo = { msg: string; err?: boolean } | null;

type Props = {
  toast: ToastInfo;
  onClose: () => void;
};

export function Toast({ toast, onClose }: Props) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 2400);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className={'toast' + (toast.err ? ' err' : '')}>
      {toast.msg}
    </div>
  );
}
