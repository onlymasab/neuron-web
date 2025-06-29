import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useCloudStore } from '@/stores/useCloudStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { createClient } from '@/lib/supabase/client';

type ShareDialogProps = {
  fileId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ShareDialog({ fileId, open, onOpenChange }: ShareDialogProps) {
  const [emailInput, setEmailInput] = useState('');
  const [loading, setLoading] = useState(false);

  const shareFile = useCloudStore((s) => s.shareFileWithUsers);
  const currentUser = useAuthStore((s) => s.user);

  const handleShare = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      const emails = emailInput
        .split(',')
        .map((e) => e.trim().toLowerCase())
        .filter((e) => e.length > 0);

        console.log('Found users:', emails);//chage

      if (emails.length === 0) {
        toast.error('Please enter at least one valid email');
        setLoading(false);
        return;
      }
      const { data: allProfiles } = await supabase.from('profiles').select('*');//change
      console.log('All profiles:', allProfiles);

      const { data: users, error } = await supabase
        .from('profiles')
        .select('id,email')
        .or(emails.map(e => `email.ilike.${e}`).join(','));

      if (error || !users) {
        throw new Error('Failed to fetch user IDs for provided emails');
      }

      const userIds = users
        .map((u) => u.id)
        .filter((id) => id !== currentUser?.id);

      if (userIds.length === 0) {
        toast.error('No valid users found to share with');
        setLoading(false);
        return;
      }

      await shareFile(fileId, userIds);

      toast.success(`File shared with ${userIds.length} user(s)`);
      setEmailInput('');
      onOpenChange(false); // Close dialog
    } catch (err: any) {
      toast.error(err.message || 'Error sharing file');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4">
        <DialogTitle className="text-lg font-semibold">
          Share this file
        </DialogTitle>

        <Input
          type="text"
          placeholder="Enter email(s), comma separated"
          value={emailInput}
          onChange={(e) => setEmailInput(e.target.value)}
        />

        <Button
          onClick={handleShare}
          disabled={loading || !emailInput.trim()}
        >
          {loading ? 'Sharing...' : 'Share'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
