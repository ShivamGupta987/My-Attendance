import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Calendar, Clock, Plus, Edit, Trash2, TrendingUp } from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { useTimetable } from '@/hooks/useTimetable';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Attendance = () => {
  const { attendance, stats, loading, markAttendance, deleteAttendance } = useAttendance();
  const { subjects } = useTimetable();
  const { toast } = useToast();
  
  const [isMarking, setIsMarking] = useState(false);
  const [attendanceForm, setAttendanceForm] = useState({
    subject_id: '',
    session_date: new Date().toISOString().split('T')[0],
    session_time: '',
    status: 'present' as 'present' | 'absent' | 'late',
    notes: ''
  });

  const handleMarkAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendanceForm.subject_id || !attendanceForm.session_date || !attendanceForm.session_time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const result = await markAttendance(
      attendanceForm.subject_id,
      attendanceForm.session_date,
      attendanceForm.session_time,
      attendanceForm.status,
      attendanceForm.notes || undefined
    );

    if (result.success) {
      toast({
        title: "Success",
        description: "Attendance marked successfully"
      });
      setAttendanceForm({
        subject_id: '',
        session_date: new Date().toISOString().split('T')[0],
        session_time: '',
        status: 'present',
        notes: ''
      });
      setIsMarking(false);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleDeleteAttendance = async (attendanceId: string) => {
    const result = await deleteAttendance(attendanceId);
    if (result.success) {
      toast({
        title: "Success",
        description: "Attendance record deleted"
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-success-light text-success';
      case 'late':
        return 'bg-warning/20 text-warning-foreground';
      case 'absent':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="w-4 h-4" />;
      case 'late':
        return <Clock className="w-4 h-4" />;
      case 'absent':
        return <div className="w-4 h-4 rounded-full border-2 border-current" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Attendance Tracker</h1>
          <p className="text-muted-foreground">Track and manage your class attendance</p>
        </div>

        {/* Quick Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Overall Attendance</p>
                    <p className="text-2xl font-bold text-foreground">{stats.percentage.toFixed(1)}%</p>
                  </div>
                  <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success" />
                  </div>
                </div>
                <Progress value={stats.percentage} className="mt-3" />
              </CardContent>
            </Card>

            <Card className="card-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Classes Attended</p>
                    <p className="text-2xl font-bold text-foreground">{stats.attendedSessions}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">out of {stats.totalSessions} total</p>
              </CardContent>
            </Card>

            <Card className="card-soft">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Sessions</p>
                    <p className="text-2xl font-bold text-foreground">{stats.totalSessions}</p>
                  </div>
                  <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-accent-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Mark Attendance Button */}
        <div className="mb-8">
          <Dialog open={isMarking} onOpenChange={setIsMarking}>
            <DialogTrigger asChild>
              <Button className="btn-hero">
                <Plus className="w-4 h-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark Attendance</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleMarkAttendance} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={attendanceForm.subject_id} onValueChange={(value) => setAttendanceForm(prev => ({ ...prev, subject_id: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map(subject => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={attendanceForm.session_date}
                    onChange={(e) => setAttendanceForm(prev => ({ ...prev, session_date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={attendanceForm.session_time}
                    onChange={(e) => setAttendanceForm(prev => ({ ...prev, session_time: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select value={attendanceForm.status} onValueChange={(value: 'present' | 'absent' | 'late') => setAttendanceForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={attendanceForm.notes}
                    onChange={(e) => setAttendanceForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Optional notes about this session"
                    rows={3}
                  />
                </div>
                <Button type="submit" className="w-full">Mark Attendance</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subject-wise Stats */}
          <div className="lg:col-span-2">
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Subject-wise Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.subjectBreakdown.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No attendance data yet. Start marking attendance to see your progress.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {stats?.subjectBreakdown.map((subject, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                        <div>
                          <h4 className="font-medium text-foreground">{subject.subject}</h4>
                          <p className="text-sm text-muted-foreground">
                            {subject.attended}/{subject.total} classes attended
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={cn(
                            "text-lg font-bold",
                            subject.percentage >= 75 ? "text-success" : "text-warning-foreground"
                          )}>
                            {subject.percentage.toFixed(1)}%
                          </span>
                          <div className="w-20 mt-1">
                            <Progress value={subject.percentage} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Attendance */}
          <div>
            <Card className="card-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Recent Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                {attendance.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No attendance records yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {attendance.slice(0, 10).map(record => (
                      <div key={record.id} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                        <div className="flex-1">
                          <h4 className="font-medium text-foreground text-sm">
                            {record.subjects.name}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.session_date).toLocaleDateString()} at {record.session_time}
                          </p>
                          {record.notes && (
                            <p className="text-xs text-muted-foreground mt-1 italic">
                              {record.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={cn("text-xs", getStatusColor(record.status))}>
                            <span className="flex items-center space-x-1">
                              {getStatusIcon(record.status)}
                              <span className="capitalize">{record.status}</span>
                            </span>
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAttendance(record.id)}
                            className="text-destructive hover:text-destructive p-1 h-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Attendance;