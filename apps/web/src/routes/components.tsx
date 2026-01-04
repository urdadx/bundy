import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'
import { ActiveButton } from '../components/duolingo-buttons/active-button'
import { HealthBar } from '../components/health-bar'
import { XPCount } from '../components/xp-count'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from '@/components/ui/alert-dialog'

export const Route = createFileRoute('/components')({
  component: RouteComponent,
})

function RouteComponent() {
  const [playerHP, setPlayerHP] = useState(100);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [smallSwitchChecked, setSmallSwitchChecked] = useState(false);

  // Example: When an opponent hits an UPPERCUT
  const handleDamage = () => {
    setPlayerHP(prev => Math.max(0, prev - 25));
  };

  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      {/* All Button Variants Row */}
      <div className="flex flex-wrap gap-4 mb-8">
        {(["default", "primary", "secondary", "danger", "super", "highlight", "golden", "locked", "ghost", "immersive", "active", "correct", "incorrect"] as const).map((variant) => (
          <Button key={variant} variant={variant} className="min-w-30">
            {variant.charAt(0).toUpperCase() + variant.slice(1)}
          </Button>
        ))}
      </div>

      {/* Demo of ActiveButton component */}
      <div className="my-8">
        <h2 className="text-xl font-bold mb-2">ActiveButton Demo</h2>
        <ActiveButton
          title="Lesson 1"
          prompt="Start your first lesson!"
          variant="golden"
          current={true}
          completed={false}
          percentage={60}
          href="/lesson/1"
          hrefText="Go to Lesson"
          ariaLabel="Go to Lesson 1"
        />
      </div>

      {/* Demo of HealthBar component */}
      <div className="my-8">
        <h2 className="text-xl font-bold mb-2">HealthBar Demo</h2>
        <div className="p-8 space-y-8 max-w-md bg-white rounded-3xl border-2 border-b-8 border-slate-200">
          <HealthBar
            value={playerHP}
            max={100}
            label="Bundy"
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=Bundy"
          />

          <div className="grid grid-cols-2 gap-4">
            <Button variant="danger" onClick={handleDamage}>Take Damage</Button>
            <Button variant="primary" onClick={() => setPlayerHP(100)}>Heal</Button>
          </div>
        </div>
      </div>

      {/* Demo of XPCount component */}
      <div className="my-8">
        <h2 className="text-xl font-bold mb-2">XPCount Demo</h2>
        <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 w-fit">
          <XPCount count={1250} />
          <XPCount count={45820} />
        </div>
      </div>

      <div className='my-8'>
        <div className="max-w-md space-y-2">
          <h2 className="text-xl font-bold mb-2">Input Component Demo</h2>
          <Input placeholder="Type something..." />
        </div>
      </div>

      {/* Demo of Switch component */}
      <div className="my-8">
        <h2 className="text-xl font-bold mb-2">Switch Demo</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch size="default" checked={switchChecked} onCheckedChange={setSwitchChecked} />
            <span>Default Switch is {switchChecked ? 'on' : 'off'}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Switch size="sm" checked={smallSwitchChecked} onCheckedChange={setSmallSwitchChecked} />
            <span>Small Switch is {smallSwitchChecked ? 'on' : 'off'}</span>
          </div>
        </div>
      </div>

      {/* Demo of Dialog component */}
      <div className="my-8">
        <h2 className="text-xl font-bold mb-2">Dialog Demo</h2>
        <Dialog>
          <DialogTrigger>
            <Button variant="primary">Open Dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>This is a dialog description.</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary">Cancel</Button>
              <Button variant="primary">Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Demo of AlertDialog component */}
      <div className="my-8">
        <h2 className="text-xl font-bold mb-2">AlertDialog Demo</h2>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button variant="danger">Open Alert Dialog</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>


    </div>
  )
}
