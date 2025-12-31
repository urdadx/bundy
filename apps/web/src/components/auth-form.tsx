import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { GoogleSVG } from './ui/google-svg';
import { useRouter } from '@tanstack/react-router';

export const AuthForm = () => {
  const [isGuest, setIsGuest] = useState(false);
  const [battleName, setBattleName] = useState('');
  const router = useRouter();

  const handleGoogleSignIn = () => {
    console.log('Sign in with Google');
  };

  const handlePlayAsGuest = () => {
    setIsGuest(true);
  };

  const handleSubmitGuest = () => {
    console.log('Playing as guest with name:', battleName);
    router.navigate({
      to: '/worlds',
    });
  };

  if (isGuest) {
    return (
      <div className="flex flex-col gap-4">
        <Input
          value={battleName}
          onChange={(e) => setBattleName(e.target.value)}
          placeholder="Enter your battle name"
        />
        <Button variant="primary" onClick={handleSubmitGuest}>Play</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">

      <Button className='flex items-center' variant="primary" onClick={handleGoogleSignIn}>
        <GoogleSVG />
        Sign in with Google</Button>
      <Button onClick={handlePlayAsGuest}>Play as Guest</Button>
    </div >
  );
}