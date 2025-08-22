import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Mail, 
  Send, 
  Github, 
  Heart, 
  Star,
  Users,
  Target,
  Shield,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const About = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  
  const [feedbackForm, setFeedbackForm] = useState({
    name: profile?.full_name || '',
    email: user?.email || '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.message) {
      toast({
        title: "Error",
        description: "Please enter your feedback message",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id || null,
          name: feedbackForm.name || null,
          email: feedbackForm.email || null,
          message: feedbackForm.message
        });

      if (error) throw error;

      toast({
        title: "Feedback Sent!",
        description: "Thank you for your feedback. We appreciate your input!"
      });

      setFeedbackForm(prev => ({ ...prev, message: '' }));
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to send feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Smart Tracking",
      description: "Effortlessly track your attendance with our intuitive interface"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is protected with enterprise-grade security"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Analytics",
      description: "Get instant insights into your attendance patterns"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Student-Focused",
      description: "Built specifically for students by understanding their needs"
    }
  ];

  const techStack = [
    "React", "TypeScript", "Tailwind CSS", "Supabase", 
    "PostgreSQL", "Row Level Security", "Real-time Updates"
  ];

  return (
    <div className="min-h-screen bg-gradient-hero p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">MyAttendance</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive attendance tracking solution designed specifically for students 
            to monitor, analyze, and improve their academic attendance patterns.
          </p>
        </div>

        {/* App Description */}
        <Card className="card-soft mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              About the Application
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              MyAttendance is a modern, user-friendly attendance tracking system that helps students 
              stay on top of their academic commitments. Built with cutting-edge technology and 
              designed with students in mind, it provides comprehensive tools for managing class 
              schedules, tracking attendance, and analyzing academic performance.
            </p>
            <p className="text-muted-foreground">
              Whether you're trying to maintain the minimum attendance requirement, improve your 
              academic discipline, or simply stay organized, MyAttendance provides the insights 
              and tools you need to succeed.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="card-soft mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Key Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-muted rounded-xl">
                  <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center text-primary">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tech Stack */}
        <Card className="card-soft mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Github className="w-5 h-5 text-primary" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Built with modern, reliable technologies to ensure the best user experience:
            </p>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, index) => (
                <Badge key={index} variant="secondary" className="px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* App Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-soft text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-success-light rounded-xl flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-success" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">Secure</h3>
              <p className="text-sm text-muted-foreground">Enterprise-grade security with Supabase</p>
            </CardContent>
          </Card>

          <Card className="card-soft text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">Fast</h3>
              <p className="text-sm text-muted-foreground">Real-time updates and instant sync</p>
            </CardContent>
          </Card>

          <Card className="card-soft text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                <Heart className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-1">Student-First</h3>
              <p className="text-sm text-muted-foreground">Designed for student success</p>
            </CardContent>
          </Card>
        </div>

        {/* Contact & Feedback */}
        <Card className="card-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Feedback & Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Get in Touch</h3>
                <p className="text-muted-foreground">
                  We'd love to hear from you! Whether you have questions, suggestions, 
                  or just want to share your experience with MyAttendance, don't hesitate to reach out.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>support@myattendance.app</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Github className="w-4 h-4" />
                    <span>github.com/myattendance</span>
                  </div>
                </div>
              </div>

              {/* Feedback Form */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Send Feedback</h3>
                <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={feedbackForm.message}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Share your thoughts, suggestions, or report issues..."
                      rows={4}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full btn-hero" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Feedback
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t border-border">
          <p className="text-muted-foreground">
            Made with <Heart className="w-4 h-4 inline text-red-500" /> for students everywhere
          </p>
          <p className="text-sm text-muted-foreground mt-2">
             Built with Supabase & React
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;