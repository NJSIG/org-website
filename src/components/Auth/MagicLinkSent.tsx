'use client';

type Props = {
  email: string;
  onBack: () => void;
};

export const MagicLinkSent: React.FC<Props> = ({ email, onBack }) => {
  return (
    <div>
      <p>A sign in link has been sent to {email}.</p>
      <button onClick={onBack}>Back to sign in</button>
    </div>
  );
};
