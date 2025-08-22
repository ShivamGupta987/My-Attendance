import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Subject {
  id: string;
  name: string;
  code: string | null;
  instructor: string | null;
}

interface TimetableEntry {
  id: string;
  subject_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  room: string | null;
  subjects: Subject;
}

export const useTimetable = () => {
  const { user } = useAuth();
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTimetable();
      fetchSubjects();
    }
  }, [user]);

  const fetchTimetable = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
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
        .order('day_of_week')
        .order('start_time');

      if (error) throw error;
      setTimetable(data || []);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const createSubject = async (subject: Omit<Subject, 'id'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('subjects')
        .insert({
          user_id: user.id,
          name: subject.name,
          code: subject.code,
          instructor: subject.instructor
        });

      if (error) throw error;

      await fetchSubjects();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchSubjects();
      await fetchTimetable();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteSubject = async (id: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchSubjects();
      await fetchTimetable();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const addTimetableEntry = async (entry: Omit<TimetableEntry, 'id' | 'subjects'>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('timetable')
        .insert({
          user_id: user.id,
          subject_id: entry.subject_id,
          day_of_week: entry.day_of_week,
          start_time: entry.start_time,
          end_time: entry.end_time,
          room: entry.room
        });

      if (error) throw error;

      await fetchTimetable();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateTimetableEntry = async (id: string, updates: Partial<TimetableEntry>) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('timetable')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchTimetable();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteTimetableEntry = async (id: string) => {
    if (!user) return { success: false, error: 'User not authenticated' };

    try {
      const { error } = await supabase
        .from('timetable')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchTimetable();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  return {
    timetable,
    subjects,
    loading,
    createSubject,
    updateSubject,
    deleteSubject,
    addTimetableEntry,
    updateTimetableEntry,
    deleteTimetableEntry,
    refetch: () => {
      fetchTimetable();
      fetchSubjects();
    }
  };
};