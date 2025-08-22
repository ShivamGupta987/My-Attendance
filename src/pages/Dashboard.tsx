import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  CheckCircle, 
  BarChart3,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { AppSidebar } from "@/components/AppSidebar";
import { useDashboardData } from "@/hooks/useDashboardData";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { stats, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading dashboard: {error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="flex">
        <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 lg:ml-0">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 mt-12 lg:mt-0 animate-fade-in">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, {profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || "Student"}! 👋
              </h1>
              <p className="text-muted-foreground">
                Here's your attendance overview for today
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up">
              <Card className="card-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Overall Attendance</p>
                      <p className="text-2xl font-bold text-foreground">{stats?.overallAttendance || 0}%</p>
                    </div>
                    <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <Progress value={stats?.overallAttendance || 0} className="mt-3" />
                </CardContent>
              </Card>

              <Card className="card-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Classes Today</p>
                      <p className="text-2xl font-bold text-foreground">{stats?.classesToday.total || 0}</p>
                    </div>
                    <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats?.classesToday.attended || 0} attended, {stats?.classesToday.upcoming || 0} upcoming
                  </p>
                </CardContent>
              </Card>

              <Card className="card-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">This Week</p>
                      <p className="text-2xl font-bold text-foreground">{stats?.thisWeekAttendance || 0}%</p>
                    </div>
                    <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-accent-foreground" />
                    </div>
                  </div>
                  <p className="text-xs text-success mt-2">
                    {stats?.thisWeekAttendance && stats.thisWeekAttendance > 0 ? '+' : ''}{stats?.thisWeekAttendance || 0}% this week
                  </p>
                </CardContent>
              </Card>

              <Card className="card-soft">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Target Progress</p>
                      <p className="text-2xl font-bold text-foreground">{stats?.overallAttendance || 0}%</p>
                    </div>
                    <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                      <Target className="w-6 h-6 text-warning-foreground" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {stats?.targetProgress && stats.targetProgress > 0 ? '+' : ''}{stats?.targetProgress || 0}% from target (75%)
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Attendance Calendar */}
              <div className="lg:col-span-2">
                <Card className="card-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Attendance Calendar
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-xl border-0 p-4"
                    />
                  </CardContent>
                </Card>

                {/* Subject-wise Attendance */}
                <Card className="card-soft mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-primary" />
                      Subject-wise Attendance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stats?.subjectWiseAttendance && stats.subjectWiseAttendance.length > 0 ? (
                      stats.subjectWiseAttendance.map((subject, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                          <div>
                            <h4 className="font-medium text-foreground">{subject.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {subject.attended}/{subject.total} classes
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={cn(
                              "text-lg font-bold",
                              subject.percentage >= 75 ? "text-success" : "text-warning-foreground"
                            )}>
                              {subject.percentage}%
                            </span>
                            <div className="w-20 mt-1">
                              <Progress value={subject.percentage} />
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No attendance data available. Start by adding subjects and marking attendance.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Today's Schedule */}
              <div>
                <Card className="card-soft">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {stats?.todaySchedule && stats.todaySchedule.length > 0 ? (
                      stats.todaySchedule.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-xl">
                          <div>
                            <h4 className="font-medium text-foreground text-sm">{item.subject}</h4>
                            <p className="text-xs text-muted-foreground">{item.time}</p>
                          </div>
                          <div className={cn(
                            "px-2 py-1 rounded-lg text-xs font-medium",
                            item.status === "present" || item.status === "late" 
                              ? "bg-success-light text-success" 
                              : item.status === "absent"
                              ? "bg-destructive-light text-destructive"
                              : "bg-warning/20 text-warning-foreground"
                          )}>
                            {item.status === "present" ? "Present" : 
                             item.status === "late" ? "Late" :
                             item.status === "absent" ? "Absent" : "Upcoming"}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        No classes scheduled for today.
                      </p>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="card-soft mt-6">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      className="w-full btn-soft justify-start"
                      onClick={() => navigate('/attendance')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark Today's Attendance
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start rounded-xl"
                      onClick={() => navigate('/timetable')}
                    >
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      Edit Timetable
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start rounded-xl"
                      onClick={() => navigate('/analytics')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;