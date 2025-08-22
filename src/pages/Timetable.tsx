import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Edit, Trash2, BookOpen, ArrowLeft } from 'lucide-react';
import { useTimetable } from '@/hooks/useTimetable';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const daysOfWeek = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const Timetable = () => {
  const { timetable, subjects, loading, createSubject, addTimetableEntry, deleteTimetableEntry, deleteSubject } = useTimetable();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    addingSubject: false,
    addingClass: false,
    deletingSubject: false,
    deletingClass: false
  });
  const [subjectForm, setSubjectForm] = useState({
    name: '',
    code: '',
    instructor: ''
  });
  const [classForm, setClassForm] = useState({
    subject_id: '',
    day_of_week: '',
    start_time: '',
    end_time: '',
    room: ''
  });

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectForm.name) {
      toast({
        title: "Error",
        description: "Subject name is required",
        variant: "destructive"
      });
      return;
    }

    setLoadingStates(prev => ({ ...prev, addingSubject: true }));

    const result = await createSubject({
      name: subjectForm.name,
      code: subjectForm.code || null,
      instructor: subjectForm.instructor || null
    });

    setLoadingStates(prev => ({ ...prev, addingSubject: false }));

    if (result.success) {
      toast({
        title: "Success",
        description: "Subject added successfully"
      });
      setSubjectForm({ name: '', code: '', instructor: '' });
      setIsAddingSubject(false);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm.subject_id || !classForm.day_of_week || !classForm.start_time || !classForm.end_time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoadingStates(prev => ({ ...prev, addingClass: true }));

    const result = await addTimetableEntry({
      subject_id: classForm.subject_id,
      day_of_week: parseInt(classForm.day_of_week),
      start_time: classForm.start_time,
      end_time: classForm.end_time,
      room: classForm.room || null
    });

    setLoadingStates(prev => ({ ...prev, addingClass: false }));

    if (result.success) {
      toast({
        title: "Success",
        description: "Class added to timetable"
      });
      setClassForm({ subject_id: '', day_of_week: '', start_time: '', end_time: '', room: '' });
      setIsAddingClass(false);
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleDeleteClass = async (classId: string) => {
    setLoadingStates(prev => ({ ...prev, deletingClass: true }));
    
    const result = await deleteTimetableEntry(classId);
    
    setLoadingStates(prev => ({ ...prev, deletingClass: false }));
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Class removed from timetable"
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    setLoadingStates(prev => ({ ...prev, deletingSubject: true }));
    
    const result = await deleteSubject(subjectId);
    
    setLoadingStates(prev => ({ ...prev, deletingSubject: false }));
    
    if (result.success) {
      toast({
        title: "Success",
        description: "Subject and all related classes removed successfully"
      });
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive"
      });
    }
  };

  const groupedTimetable = daysOfWeek.map(day => ({
    day,
    dayIndex: daysOfWeek.indexOf(day),
    classes: timetable.filter(entry => entry.day_of_week === daysOfWeek.indexOf(day))
      .sort((a, b) => a.start_time.localeCompare(b.start_time))
  }));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="loading-pulse"></div>
          <p className="text-muted-foreground">Loading your timetable...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Timetable Management</h1>
            <p className="text-muted-foreground">Manage your subjects and class schedule</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="rounded-xl flex items-center"
          >
            <ArrowLeft className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Back to Dashboard</span>
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Dialog open={isAddingSubject} onOpenChange={setIsAddingSubject}>
            <DialogTrigger asChild>
              <Button className="btn-hero">
                <BookOpen className="w-4 h-4 mr-2" />
                Add Subject
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSubject} className="space-y-4">
                <div>
                  <Label htmlFor="subjectName">Subject Name *</Label>
                  <Input
                    id="subjectName"
                    value={subjectForm.name}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Mathematics"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subjectCode">Subject Code</Label>
                  <Input
                    id="subjectCode"
                    value={subjectForm.code}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. MATH101"
                  />
                </div>
                <div>
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={subjectForm.instructor}
                    onChange={(e) => setSubjectForm(prev => ({ ...prev, instructor: e.target.value }))}
                    placeholder="e.g. Dr. Smith"
                  />
                </div>
                 <Button type="submit" className="w-full" disabled={loadingStates.addingSubject}>
                   {loadingStates.addingSubject ? (
                     <>
                       <div className="loading-spinner mr-2"></div>
                       Adding...
                     </>
                   ) : (
                     "Add Subject"
                   )}
                 </Button>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingClass} onOpenChange={setIsAddingClass}>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-xl">
                <Plus className="w-4 h-4 mr-2" />
                Add Class
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Class to Timetable</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddClass} className="space-y-4">
                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={classForm.subject_id} onValueChange={(value) => setClassForm(prev => ({ ...prev, subject_id: value }))}>
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
                  <Label htmlFor="day">Day *</Label>
                  <Select value={classForm.day_of_week} onValueChange={(value) => setClassForm(prev => ({ ...prev, day_of_week: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day, index) => (
                        <SelectItem key={day} value={index.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={classForm.start_time}
                      onChange={(e) => setClassForm(prev => ({ ...prev, start_time: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={classForm.end_time}
                      onChange={(e) => setClassForm(prev => ({ ...prev, end_time: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="room">Room</Label>
                  <Input
                    id="room"
                    value={classForm.room}
                    onChange={(e) => setClassForm(prev => ({ ...prev, room: e.target.value }))}
                    placeholder="e.g. Room 101"
                  />
                </div>
                 <Button type="submit" className="w-full" disabled={loadingStates.addingClass}>
                   {loadingStates.addingClass ? (
                     <>
                       <div className="loading-spinner mr-2"></div>
                       Adding...
                     </>
                   ) : (
                     "Add Class"
                   )}
                 </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Subjects List */}
        <Card className="card-soft mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Your Subjects
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subjects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No subjects added yet. Add your first subject to get started.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.map(subject => (
                  <Card key={subject.id} className="p-4 border border-border">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{subject.name}</h4>
                          {subject.code && <Badge variant="secondary" className="mt-1">{subject.code}</Badge>}
                          {subject.instructor && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Instructor: {subject.instructor}
                            </p>
                          )}
                        </div>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              disabled={loadingStates.deletingSubject}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Subject</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{subject.name}"? This will also remove all related classes from your timetable. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteSubject(subject.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete Subject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Timetable */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Weekly Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timetable.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No classes scheduled yet. Add your first class to see your timetable.
              </p>
            ) : (
              <div className="space-y-6">
                {groupedTimetable.map(({ day, classes }) => (
                  <div key={day} className="space-y-3">
                    <h3 className="text-lg font-semibold text-foreground">{day}</h3>
                    {classes.length === 0 ? (
                      <p className="text-sm text-muted-foreground ml-4">No classes scheduled</p>
                    ) : (
                      <div className="space-y-2">
                        {classes.map(classItem => (
                          <div key={classItem.id} className="flex items-center justify-between p-4 bg-muted rounded-xl">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2 text-primary">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                  {classItem.start_time} - {classItem.end_time}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-foreground">
                                  {classItem.subjects.name}
                                </h4>
                                {classItem.room && (
                                  <p className="text-sm text-muted-foreground">
                                    Room: {classItem.room}
                                  </p>
                                )}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteClass(classItem.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timetable;