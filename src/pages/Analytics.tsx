import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { useTimetable } from '@/hooks/useTimetable';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const Analytics = () => {
  const { attendance, stats, loading } = useAttendance();
  const { subjects } = useTimetable();
  const { toast } = useToast();
  
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0]
  });
  const [selectedSubject, setSelectedSubject] = useState('all');

  const filteredAttendance = useMemo(() => {
    return attendance.filter(record => {
      const recordDate = new Date(record.session_date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      const dateInRange = recordDate >= startDate && recordDate <= endDate;
      const subjectMatch = selectedSubject === 'all' || record.subject_id === selectedSubject;
      
      return dateInRange && subjectMatch;
    });
  }, [attendance, dateRange, selectedSubject]);

  const analyticsData = useMemo(() => {
    const totalSessions = filteredAttendance.length;
    const presentSessions = filteredAttendance.filter(r => r.status === 'present').length;
    const lateSessions = filteredAttendance.filter(r => r.status === 'late').length;
    const absentSessions = filteredAttendance.filter(r => r.status === 'absent').length;
    const attendedSessions = presentSessions + lateSessions;
    
    // Weekly breakdown
    const weeklyData = new Map();
    filteredAttendance.forEach(record => {
      const date = new Date(record.session_date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, { total: 0, attended: 0 });
      }
      
      const week = weeklyData.get(weekKey);
      week.total++;
      if (record.status === 'present' || record.status === 'late') {
        week.attended++;
      }
    });

    // Monthly breakdown
    const monthlyData = new Map();
    filteredAttendance.forEach(record => {
      const date = new Date(record.session_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      if (!monthlyData.has(monthKey)) {
        monthlyData.set(monthKey, { total: 0, attended: 0 });
      }
      
      const month = monthlyData.get(monthKey);
      month.total++;
      if (record.status === 'present' || record.status === 'late') {
        month.attended++;
      }
    });

    // Subject breakdown
    const subjectData = new Map();
    filteredAttendance.forEach(record => {
      const subjectName = record.subjects.name;
      
      if (!subjectData.has(subjectName)) {
        subjectData.set(subjectName, { total: 0, present: 0, late: 0, absent: 0 });
      }
      
      const subject = subjectData.get(subjectName);
      subject.total++;
      subject[record.status]++;
    });

    return {
      summary: {
        totalSessions,
        presentSessions,
        lateSessions,
        absentSessions,
        attendedSessions,
        percentage: totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0
      },
      weekly: Array.from(weeklyData.entries()).map(([week, data]) => ({
        week,
        ...data,
        percentage: data.total > 0 ? (data.attended / data.total) * 100 : 0
      })),
      monthly: Array.from(monthlyData.entries()).map(([month, data]) => ({
        month,
        ...data,
        percentage: data.total > 0 ? (data.attended / data.total) * 100 : 0
      })),
      subjects: Array.from(subjectData.entries()).map(([name, data]) => ({
        name,
        ...data,
        percentage: data.total > 0 ? ((data.present + data.late) / data.total) * 100 : 0
      }))
    };
  }, [filteredAttendance]);

  const exportToCSV = () => {
    const headers = ['Date', 'Time', 'Subject', 'Status', 'Notes'];
    const rows = filteredAttendance.map(record => [
      record.session_date,
      record.session_time,
      record.subjects.name,
      record.status,
      record.notes || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance-report-${dateRange.start}-to-${dateRange.end}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export Complete",
      description: "Attendance report has been downloaded"
    });
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
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics & Reports</h1>
          <p className="text-muted-foreground">Detailed insights into your attendance patterns</p>
        </div>

        {/* Filters */}
        <Card className="card-soft mb-8">
          <CardHeader>
            <CardTitle>Filters & Export</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-48">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="flex-1 min-w-48">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
              <div className="flex-1 min-w-48">
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={exportToCSV} className="btn-hero">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Overall Rate</p>
                  <p className="text-2xl font-bold text-foreground">
                    {analyticsData.summary.percentage.toFixed(1)}%
                  </p>
                </div>
                <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-success" />
                </div>
              </div>
              <Progress value={analyticsData.summary.percentage} className="mt-3" />
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Present</p>
                  <p className="text-2xl font-bold text-success">
                    {analyticsData.summary.presentSessions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {analyticsData.summary.totalSessions > 0 
                  ? ((analyticsData.summary.presentSessions / analyticsData.summary.totalSessions) * 100).toFixed(1)
                  : 0}% of total sessions
              </p>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Late</p>
                  <p className="text-2xl font-bold text-warning-foreground">
                    {analyticsData.summary.lateSessions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning-foreground" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {analyticsData.summary.totalSessions > 0 
                  ? ((analyticsData.summary.lateSessions / analyticsData.summary.totalSessions) * 100).toFixed(1)
                  : 0}% of total sessions
              </p>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Absent</p>
                  <p className="text-2xl font-bold text-destructive">
                    {analyticsData.summary.absentSessions}
                  </p>
                </div>
                <div className="w-12 h-12 bg-destructive/20 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {analyticsData.summary.totalSessions > 0 
                  ? ((analyticsData.summary.absentSessions / analyticsData.summary.totalSessions) * 100).toFixed(1)
                  : 0}% of total sessions
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subject Performance */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Subject Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.subjects.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No data available for the selected period
                </p>
              ) : (
                <div className="space-y-4">
                  {analyticsData.subjects.map((subject, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-foreground">{subject.name}</h4>
                        <span className={cn(
                          "font-bold",
                          subject.percentage >= 75 ? "text-success" : "text-warning-foreground"
                        )}>
                          {subject.percentage.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={subject.percentage} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Present: {subject.present} | Late: {subject.late} | Absent: {subject.absent}</span>
                        <span>Total: {subject.total}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Monthly Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsData.monthly.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No monthly data available
                </p>
              ) : (
                <div className="space-y-4">
                  {analyticsData.monthly.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                      <div>
                        <h4 className="font-medium text-foreground">
                          {new Date(month.month + '-01').toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long' 
                          })}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {month.attended}/{month.total} classes attended
                        </p>
                      </div>
                      <div className="text-right">
                        <span className={cn(
                          "text-lg font-bold",
                          month.percentage >= 75 ? "text-success" : "text-warning-foreground"
                        )}>
                          {month.percentage.toFixed(1)}%
                        </span>
                        <div className="w-20 mt-1">
                          <Progress value={month.percentage} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Weekly Performance */}
        {analyticsData.weekly.length > 0 && (
          <Card className="card-soft mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Weekly Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analyticsData.weekly.map((week, index) => (
                  <div key={index} className="p-4 bg-muted rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-medium text-foreground">
                        Week of {new Date(week.week).toLocaleDateString()}
                      </h4>
                      <span className={cn(
                        "font-bold",
                        week.percentage >= 75 ? "text-success" : "text-warning-foreground"
                      )}>
                        {week.percentage.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={week.percentage} className="mb-2" />
                    <p className="text-xs text-muted-foreground">
                      {week.attended}/{week.total} classes attended
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Analytics;