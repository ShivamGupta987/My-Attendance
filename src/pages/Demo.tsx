import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Target, TrendingUp, BookOpen, Users, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock demo data
const mockStats = {
  overallAttendance: 82.4,
  totalSessions: 145,
  attendedSessions: 119,
  classesToday: 3,
  attendedToday: 2,
  weeklyAttendance: 85.7,
  targetProgress: 7.4, // 82.4% - 75% target
  monthlyTrend: '+3.2%'
};

const mockSubjects = [
  { id: '1', name: 'Mathematics', code: 'MATH101', attendance: 88.5, sessions: 28, attended: 25 },
  { id: '2', name: 'Physics', code: 'PHYS201', attendance: 75.0, sessions: 24, attended: 18 },
  { id: '3', name: 'Chemistry', code: 'CHEM301', attendance: 90.3, sessions: 31, attended: 28 },
  { id: '4', name: 'Computer Science', code: 'CS101', attendance: 85.7, sessions: 35, attended: 30 }
];

const mockTodayClasses = [
  { id: '1', subject: 'Mathematics', time: '09:00 - 10:30', room: 'Room 101', status: 'attended' },
  { id: '2', subject: 'Physics', time: '11:00 - 12:30', room: 'Lab 2', status: 'attended' },
  { id: '3', subject: 'Computer Science', time: '14:00 - 15:30', room: 'Computer Lab', status: 'upcoming' }
];

const Demo = () => {
  return (
    <div className="min-h-screen bg-gradient-hero p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Demo Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-foreground">Demo Dashboard</h1>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Demo Mode
              </Badge>
            </div>
            <p className="text-muted-foreground">
              This is a read-only demo showing sample attendance data. Sign up to track your real attendance!
            </p>
          </div>
          <Button variant="outline" className="rounded-xl" asChild>
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="card-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Overall Attendance</p>
                  <p className="text-2xl font-bold text-foreground">{mockStats.overallAttendance}%</p>
                  <p className="text-xs text-muted-foreground">
                    {mockStats.attendedSessions}/{mockStats.totalSessions} sessions
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Target className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={mockStats.overallAttendance} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Classes Today</p>
                  <p className="text-2xl font-bold text-foreground">{mockStats.attendedToday}/{mockStats.classesToday}</p>
                  <p className="text-xs text-success">On track</p>
                </div>
                <div className="h-12 w-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-foreground">{mockStats.weeklyAttendance}%</p>
                  <p className="text-xs text-success">{mockStats.monthlyTrend} from last week</p>
                </div>
                <div className="h-12 w-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Target Progress</p>
                  <p className="text-2xl font-bold text-success">+{mockStats.targetProgress}%</p>
                  <p className="text-xs text-muted-foreground">Above 75% target</p>
                </div>
                <div className="h-12 w-12 bg-success/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Classes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Today's Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTodayClasses.map((classItem) => (
                <div key={classItem.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                  <div className="space-y-1">
                    <h4 className="font-medium text-foreground">{classItem.subject}</h4>
                    <p className="text-sm text-muted-foreground">{classItem.time}</p>
                    <p className="text-sm text-muted-foreground">{classItem.room}</p>
                  </div>
                  <Badge 
                    variant={classItem.status === 'attended' ? 'default' : 'secondary'}
                    className={classItem.status === 'attended' ? 'bg-success text-success-foreground' : ''}
                  >
                    {classItem.status === 'attended' ? 'Attended' : 'Upcoming'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Subject-wise Breakdown */}
          <Card className="card-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Subject-wise Attendance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockSubjects.map((subject) => (
                <div key={subject.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-foreground">{subject.name}</h4>
                      <p className="text-sm text-muted-foreground">{subject.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">{subject.attendance}%</p>
                      <p className="text-xs text-muted-foreground">
                        {subject.attended}/{subject.sessions}
                      </p>
                    </div>
                  </div>
                  <Progress value={subject.attendance} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <Card className="card-soft text-center">
          <CardContent className="p-8">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Ready to Track Your Real Attendance?</h3>
              <p className="text-muted-foreground">
                Sign up now to start tracking your actual attendance data and stay on top of your academic goals.
              </p>
              <Button className="btn-hero" asChild>
                <Link to="/auth">Get Started Free</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Demo;