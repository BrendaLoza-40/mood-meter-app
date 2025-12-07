import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoginSuccess: () => void;
}

// Default admin credentials (in a real app, this would be handled by a backend)
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123'
};

export function AdminLogin({ open, onOpenChange, onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
        toast.success('Login successful!');
        onLoginSuccess();
        onOpenChange(false);
        setUsername('');
        setPassword('');
      } else {
        toast.error('Invalid username or password');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleClose = () => {
    setUsername('');
    setPassword('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <DialogTitle>Admin Login</DialogTitle>
          </div>
          <DialogDescription>
            Enter your admin credentials to access settings
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-3">
            <p className="text-sm text-muted-foreground">
              Default credentials for demo:
            </p>
            <p className="text-sm mt-1">
              <span className="font-medium">Username:</span> admin
            </p>
            <p className="text-sm">
              <span className="font-medium">Password:</span> admin123
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>Loading...</>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
