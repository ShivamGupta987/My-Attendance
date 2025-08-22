import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Users, TrendingUp, Target, BookOpen, Calendar, BarChart3, CheckCircle, Github, HelpCircle, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/components/ui/theme-provider";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const stats = [
    { icon: Users, label: "Total Users", value: "4000+", color: "bg-primary" },
    { icon: TrendingUp, label: "Trust Score", value: "98.5%", color: "bg-success" },
    { icon: Target, label: "Accuracy", value: "99.2%", color: "bg-accent-dark" }
  ];

  const features = [
    {
      icon: Calendar,
      title: "Create Timetable",
      description: "Set up your weekly schedule by adding all subjects and their time slots with one click",
      step: "1"
    },
    {
      icon: CheckCircle,
      title: "Mark Attendance",
      description: "Select dates and mark present/absent for each subject with our quick toggle",
      step: "2"
    },
    {
      icon: BarChart3,
      title: "Check Percentage",
      description: "Visit dashboard, select date range, and get attendance percentage breakdown by subjects",
      step: "3"
    }
  ];

  const faqs = [
    {
      question: "How do I track my 75% attendance requirement?",
      answer: "Our dashboard automatically calculates your attendance percentage in real-time. You'll get visual indicators and alerts when you're close to the 75% threshold."
    },
    {
      question: "Can I edit my timetable after creating it?",
      answer: "Yes! You can easily add, remove, or modify subjects and time slots in the Timetable section. Changes are saved automatically."
    },
    {
      question: "Is my attendance data secure?",
      answer: "Absolutely. All your data is encrypted and stored securely. We follow industry-standard security practices to protect your information."
    },
    {
      question: "Can I use this offline?",
      answer: "Yes! MyAttendance works as a Progressive Web App (PWA), allowing you to mark attendance even when offline. Data syncs when you're back online."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">MyAttendance</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-lg"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            {isAuthenticated ? (
              <Button className="rounded-xl" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <Button variant="outline" className="rounded-xl" asChild>
                <Link to="/auth">Login</Link>
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Track Your Attendance,<br />
            <span className="bg-gradient-primary bg-clip-text text-transparent">Stay on Track!</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Never fall short of your 75% criteria again with our intuitive tracking system designed for students. 
            Monitor your attendance, manage your timetable, and achieve your academic goals effortlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="btn-hero text-lg" asChild>
              <Link to="/auth">Get Started Free</Link>
            </Button>
            <Button variant="outline" className="rounded-xl text-lg px-6 py-3" asChild>
              <Link to="/demo">View Demo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <Card key={index} className="card-soft text-center hover:scale-105 transition-transform duration-200">
              <CardContent className="p-6">
                <div className={`w-16 h-16 ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">How to Use</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get started in just three simple steps and take control of your attendance tracking
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-float group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-accent-foreground">
                  {feature.step}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about MyAttendance
            </p>
          </div>
          
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-2xl px-6 bg-card shadow-soft">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-6">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0" />
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">MyAttendance</span>
              </div>
              <p className="text-muted-foreground leading-relaxed max-w-md">
                Revolutionizing attendance tracking for students and educators. Transform 
                tedious manual processes into seamless digital experiences.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Live Demo</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Support</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-4 h-4" />
                    GitHub Repository
                  </a>
                </li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">Report Issues</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center">
            <p className="text-muted-foreground">
              © 2025 MyAttendance. Made with ❤️ for students everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;