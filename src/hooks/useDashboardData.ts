import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DashboardStats {
  overallAttendance: number;
  classesToday: {
    total: number;
    attended: number;
    upcoming: number;
  };
  thisWeekAttendance: number;
  targetProgress: number;
  subjectWiseAttendance: Array<{
    name: string;
    attended: number;
    total: number;
    percentage: number;
  }>;
  todaySchedule: Array<{
    subject: string;
    time: string;
    status: 'present' | 'absent' | 'late' | 'upcoming';
    session_date: string;
  }>;
}

export const useDashboardData = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const today = new Date().toISOString().split('T')[0];
      const dayOfWeek = new Date().getDay();
      
      // Get start of week (Monday)
      const startOfWeek = new Date();
      const diff = startOfWeek.getDate() - startOfWeek.getDay() + (startOfWeek.getDay() === 0 ? -6 : 1);
      startOfWeek.setDate(diff);
      const weekStart = startOfWeek.toISOString().split('T')[0];
      
      // Get end of week (Sunday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      const weekEnd = endOfWeek.toISOString().split('T')[0];

      // Fetch all attendance records
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select(`
          *,
          subjects (
            id,
            name,
            code,
            instructor
          )
        `)
        .eq('user_id', user.id);

      if (attendanceError) throw attendanceError;

      // Fetch today's timetable
      const { data: timetableData, error: timetableError } = await supabase
        .from('timetable')
        .select(`
          *,
          subjects (
            id,
            name,
            code,
            instructor
          )
        `)
        .eq('user_id', user.id)
        .eq('day_of_week', dayOfWeek);

      if (timetableError) throw timetableError;

      // Calculate overall attendance
      const totalSessions = attendanceData?.length || 0;
      const attendedSessions = attendanceData?.filter(record => 
        record.status === 'present' || record.status === 'late'
      ).length || 0;
      const overallAttendance = totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0;

      // Calculate this week's attendance
      const weekAttendance = attendanceData?.filter(record => 
        record.session_date >= weekStart && record.session_date <= weekEnd
      ) || [];
      const weekAttended = weekAttendance.filter(record => 
        record.status === 'present' || record.status === 'late'
      ).length;
      const thisWeekAttendance = weekAttendance.length > 0 ? Math.round((weekAttended / weekAttendance.length) * 100) : 0;

      // Calculate target progress (assuming 75% target)
      const targetPercentage = 75;
      const targetProgress = overallAttendance - targetPercentage;

      // Calculate subject-wise attendance
      const subjectMap = new Map();
      attendanceData?.forEach(record => {
        const subjectName = record.subjects?.name || 'Unknown';
        if (!subjectMap.has(subjectName)) {
          subjectMap.set(subjectName, { total: 0, attended: 0 });
        }
        const stats = subjectMap.get(subjectName);
        stats.total++;
        if (record.status === 'present' || record.status === 'late') {
          stats.attended++;
        }
      });

      const subjectWiseAttendance = Array.from(subjectMap.entries()).map(([subject, stats]) => ({
        name: subject,
        attended: stats.attended,
        total: stats.total,
        percentage: stats.total > 0 ? Math.round((stats.attended / stats.total) * 100) : 0
      }));

      // Get today's attendance records
      const todayAttendance = attendanceData?.filter(record => 
        record.session_date === today
      ) || [];

      // Calculate classes today
      const todayTimetable = timetableData || [];
      const attendedToday = todayAttendance.filter(record => 
        record.status === 'present' || record.status === 'late'
      ).length;
      const upcomingToday = Math.max(0, todayTimetable.length - todayAttendance.length);

      const classesToday = {
        total: todayTimetable.length,
        attended: attendedToday,
        upcoming: upcomingToday
      };

      // Build today's schedule
      const todaySchedule = todayTimetable.map(timetableEntry => {
        const attendanceRecord = todayAttendance.find(attendance => 
          attendance.subject_id === timetableEntry.subject_id
        );
        
        return {
          subject: timetableEntry.subjects?.name || 'Unknown',
          time: `${timetableEntry.start_time} - ${timetableEntry.end_time}`,
          status: attendanceRecord ? attendanceRecord.status as 'present' | 'absent' | 'late' | 'upcoming' : 'upcoming',
          session_date: today
        };
      });

      setStats({
        overallAttendance,
        classesToday,
        thisWeekAttendance,
        targetProgress,
        subjectWiseAttendance,
        todaySchedule
      });

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  return {
    stats,
    loading,
    error,
    refetch: fetchDashboardData
  };
};