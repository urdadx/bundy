import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GoogleSVG } from './ui/google-svg';
import { useRouter } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';

export const AuthForm = () => {
  const [isGuest, setIsGuest] = useState(false);
  const [battleName, setBattleName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/worlds',
    });
  };

  const handlePlayAsGuest = () => {
    setIsGuest(true);
  };

  const handleSubmitGuest = async () => {
    if (!battleName.trim()) return;

    setIsLoading(true);
    try {
      await authClient.signIn.anonymous({
        fetchOptions: {
          onSuccess: () => {
            router.navigate({
              to: '/worlds', search: {

              }
            });
          },
        },
      });

      // Update the user's name after anonymous sign in
      await authClient.updateUser({
        name: battleName.trim(),
      });

      router.navigate({ to: '/worlds', search: {} });
    } catch (error) {
      console.error('Failed to create guest account:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isGuest) {
    return (
      <div className="flex flex-col gap-4">
        <Input
          value={battleName}
          onChange={(e) => setBattleName(e.target.value)}
          placeholder="Enter your battle name"
          disabled={isLoading}
        />
        <Button
          variant="primary"
          onClick={handleSubmitGuest}
          disabled={isLoading || !battleName.trim()}
        >
          {isLoading ? 'Creating...' : 'Play'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Button className='flex items-center' variant="primary" onClick={handleGoogleSignIn}>
        <GoogleSVG />
        Sign in with Google
      </Button>
      <Button onClick={handlePlayAsGuest}>Play as Guest</Button>
    </div>
  );
}