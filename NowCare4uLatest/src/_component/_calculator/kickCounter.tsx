import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../auth/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Label } from '../../components/ui/label';
import { Plus, Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible';

interface KickEntry {
  display: string;
  time: number;
}

interface Notification {
  id: number;
  title: string;
  body: string;
  type: number;
}

const KickCounter: React.FC = () => {
  const navigate = useNavigate();
  const [userList, setUserList] = useState<KickEntry[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [userConsent, setUserConsent] = useState<boolean>(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [duration, setDuration] = useState<number>(0);
  const [nameInput, setNameInput] = useState('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // shareDialogOpen already declared above

  useEffect(() => {
    loadUserData();
    loadNotificationSettings();
    loadKickData();
    loadNotificationData();
  }, []);

  const { user, token } = useUser();

  const loadUserData = async () => {
    try {
      if (!token) return;
      const res = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/kick-counter/data', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to fetch kick data');
      const data = await res.json();
      const resolvedName = data.name || (user?.displayName || user?.phone || '');
      setName(resolvedName);
      setNameInput(resolvedName && resolvedName !== 'null' ? resolvedName : '');
      setUserList((data.count || []).map((it: any) => ({ display: it.display, time: it.time })));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveNameOnly = async () => {
    try {
      if (!token) return;
      const newName = nameInput.trim();
      if (!newName) return;
      await fetch('https://nowcare4-u-production-acbz.vercel.app/api/kick-counter/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newName, count: userList }),
      });
      setName(newName);
      alert('Name saved');
    } catch (e) {
      console.error('Error saving name', e);
      alert('Failed to save name');
    }
  };

  const saveCurrent = async () => {
    try {
      if (!token) return;
      await fetch('https://nowcare4-u-production-acbz.vercel.app/api/kick-counter/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, count: userList }),
      });
      // After first successful save, set up notifications if user consented
      if (notifications.length === 0 && userConsent) {
        await setupNotifications();
      }
      alert('Kick details saved');
    } catch (e) {
      console.error('Error saving kick data', e);
      alert('Failed to save kick details');
    }
  };

  const loadNotificationSettings = async () => {
    try {
      if (!token) return;
      const res = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/kick-counter/notifications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      const list = data.notification || [];
      setNotifications(list);
    } catch (e) {
      console.error('Error loading notifications', e);
    }
  };

  const loadKickData = async () => {
    try {
      if (!token) return;
      // Data is loaded in loadUserData
    } catch (error) {
      console.error('Error loading kick data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotificationData = async () => {
    // Already loaded in loadNotificationSettings
  };

  const formatDate = (): string => {
    const now = new Date();
    return now.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const addKick = async () => {
    if (!token) return;

    const newKick: KickEntry = {
      display: formatDate(),
      time: Date.now()
    };

    const updatedList = [...userList, newKick];
    setUserList(updatedList);
  };

  const setupNotifications = async () => {
    try {
      if (!token) return;

      const notificationList: Notification[] = [];
      const now = new Date();
      const reminderTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0);

      // Add initial notification
      notificationList.push({
        id: Math.floor(reminderTime.getTime() / 1000),
        title: "Kick Counter Reminder",
        body: "Don't forget to update your record.",
        type: 1
      });

      // Add notifications for next 30 days (every 2 days)
      for (let i = 1; i < 30; i++) {
        const newTime = new Date(reminderTime.getTime() + (i * 2 * 24 * 60 * 60 * 1000));
        notificationList.push({
          id: Math.floor(newTime.getTime() / 1000),
          title: "Kick Counter Reminder",
          body: "Don't forget to update your record.",
          type: 1
        });
      }

      // Save notifications to backend
      await fetch('https://nowcare4-u-production-acbz.vercel.app/api/kick-counter/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ notification: notificationList }),
      });

      setNotifications(notificationList);
    } catch (error) {
      console.error('Error setting up notifications:', error);
    }
  };

  const disableNotifications = async () => {
    setLoading(true);
    try {
      if (!token) return;

      await fetch('https://nowcare4-u-production-acbz.vercel.app/api/kick-counter/notifications', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications([]);
    } catch (error) {
      console.error('Error disabling notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const sharePdf = async () => {
    try {
      if (!token) return;

      const res = await fetch('https://nowcare4-u-production-acbz.vercel.app/api/kick-counter/share-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ duration }),
      });
      if (!res.ok) throw new Error('Failed to generate PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kick_counter.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error sharing PDF:', error);
    }
    setShareDialogOpen(false);
  };



  // Removed unused getFilteredList function

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="bg-white/80 backdrop-blur border border-gray-100 shadow-lg rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-2xl font-bold text-blue-600">Kick Counter</CardTitle>
            <span className="text-pink-500">👣</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate('/kick-records')}>
              Records
            </Button>
            <Button variant="default" size="sm" onClick={saveCurrent} className="bg-green-600 hover:bg-green-700">
              Save
            </Button>
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Please select duration</DialogTitle>
                </DialogHeader>
                <RadioGroup value={duration.toString()} onValueChange={(value: string) => setDuration(parseInt(value))}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="0" id="24hours" />
                    <Label htmlFor="24hours">Last 24 hours</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1" id="week" />
                    <Label htmlFor="week">Past week</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="complete" />
                    <Label htmlFor="complete">Complete List</Label>
                  </div>
                </RadioGroup>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline" onClick={() => setShareDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={sharePdf}>
                    Share
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Welcome Message */}
          <div className="text-left">
            <h2 className="text-xl font-medium">
              {name && name !== "null" ? `Welcome ${name}` : "Welcome"}
            </h2>
          </div>

          {/* Ask for Name if missing or looks like phone */}
          {(!name || name === 'null' || /^\+?\d[\d\s-]+$/.test(name)) && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800 mb-2">Please enter your name to personalize your Kick Counter.</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your name"
                  className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <Button onClick={saveNameOnly} disabled={!nameInput.trim()} className="bg-blue-600 hover:bg-blue-700 text-white">
                  Save name
                </Button>
              </div>
            </div>
          )}

          {/* Add Kick Section */}
          <div className="text-center space-y-4">
            <Button
              onClick={addKick}
              size="lg"
              className="w-24 h-24 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg"
            >
              <Plus className="w-12 h-12" />
            </Button>
            <p className="text-sm text-gray-600">Tap to add count</p>

            <div className="flex items-center justify-center space-x-2">
              <span className="text-2xl">Total Kicks:</span>
              <span className="text-3xl font-semibold text-blue-600">{userList.length}</span>
            </div>
          </div>

          {/* Notification Consent */}
          <div className="flex items-center justify-center space-x-2 p-4">
            <Checkbox
              id="consent"
              checked={userConsent}
              onCheckedChange={(checked: boolean) => setUserConsent(!!checked)}
            />
            <Label htmlFor="consent" className="text-center">
              Notify me to update the entries every second day!
            </Label>
          </div>

          {/* Information Text */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm leading-relaxed">
              One of the most exciting moments in your pregnancy is when you feel those first little flutters of your baby kicking. These tiny movements reassure you that your baby is developing and help you feel closer to the little life inside of you.
              <br /><br />
              Though the womb is a tight space in which to exercise, it turns out that those kicks are vital for the baby's healthy bone and joint development, an expert told Live Science. Fetuses begin moving in the womb about as early as 7 weeks, when they slowly bend their necks, according to a review paper published in the journal Ultrasound in Obstetrics & Gynecology.
            </p>
          </div>

          {/* Past Details */}
          {userList.length > 0 && (
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-between">
                  <span className="font-semibold">Tap to check past Details</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {userList.map((entry, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded border-l-4 border-blue-500">
                      {entry.display}
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Disable Notifications Button */}
          {notifications.length > 0 && (
            <div className="text-center">
              <Button
                onClick={disableNotifications}
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
              >
                Disable Kick Counter Notification
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KickCounter;
