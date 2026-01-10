import { Button } from "./ui/button";
import { GoogleSVG } from "./ui/google-svg";

const IntroStage = ({
  handleGoogleSignIn,
  handlePlayAsGuest,
}: {
  handleGoogleSignIn: () => void;
  handlePlayAsGuest: () => void;
}) => (
  <div className="flex flex-col justify-center gap-4 px-1">
    {/* <Button className='flex items-center w-full' variant="primary" onClick={handleGoogleSignIn}>
      <GoogleSVG />
      Sign in with Google
    </Button> */}
    <Button className="w-full" onClick={handlePlayAsGuest}>
      Play as Guest
    </Button>
  </div>
);

export { IntroStage };
