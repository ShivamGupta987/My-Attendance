import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Subject {
  id: string;
  name: string;
  code: string | null;
  instructor: string | null;
}

interface AttendanceRecord {
  id: string;
  subject_id: string;
  session_date: string;
  session_time: string;
  status: string;
  notes: string | null;
  subjects: Subject;
}

interface AttendanceStats {
  totalSessions: number;
  attendedSessions: number;
  percentage: number;
  subjectBreakdown: Array<{
    subject: string;
    attended: number;
    total: number;
    percentage: number;
  }>;
}

export const useAttendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [stats, setStats] = useState<AttendanceStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAttendance();
      fetchStats();
    }
  }, [user]);

  const fetchAttendance = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
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
        .eq('user_id', user.id)
        .order('session_date', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!user) return;

    try {
      const { data: attendanceData, error } = await supabase
        .from('attendance')
        .select(`
          status,
          subjects (
            name
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const totalSessions = attendanceData?.length || 0;
      const attendedSessions = attendanceData?.filter(record => 
        record.status === 'present' || record.status === 'late'
      ).length || 0;

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

      const subjectBreakdown = Array.from(subjectMap.entries()).map(([subject, stats]) => ({
        subject,
        attended: stats.attended,
        total: stats.total,
        percentage: stats.total > 0 ? (stats.attended / stats.total) * 100 : 0
      }));

      setStats({
        totalSessions,
        attendedSessions,
        percentage: totalSessions > 0 ? (attendedSessions / totalSessions) * 100 : 0,
        subjectBreakdown
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const markAttendance = async (
    subjectId: string,
    sessionDate: string,
    sessionTime: string,
    status: 'present' | 'absent' | 'late',
    notes?: string
  ) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('attendance')
        .upsert({
          user_id: user.id,
          subject_id: subjectId,
          session_date: sessionDate,
          session_time: sessionTime,
          status,
          notes: notes || null
        });

      if (error) throw error;

      await fetchAttendance();
      await fetchStats();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteAttendance = async (attendanceId: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', attendanceId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchAttendance();
      await fetchStats();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    attendance,
    stats,
    loading,
    markAttendance,
    deleteAttendance,
    refetch: () => {
      fetchAttendance();
      fetchStats();
    }
  };
};