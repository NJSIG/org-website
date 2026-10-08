'use client';

type Props = {
  email: string;
  onBack: () => void;
};

export const ForgotPasswordSent: React.FC<Props> = ({ email, onBack }) => {
  return (
    <div>
      <p>If {email} is associated with an account, a password reset link has been sent.</p>
      <button onClick={onBack}>Back to sign in</button>
    </div>
  );
};
