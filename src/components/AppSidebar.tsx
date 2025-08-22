import { useState, useEffect } from "react";
import { 
  Home, 
  Calendar as CalendarIcon, 
  CheckCircle, 
  BarChart3, 
  Info, 
  User, 
  BookOpen,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const AppSidebar = ({ isOpen, onToggle }: AppSidebarProps) => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      });
    }
  };

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/dashboard" },
    { id: "timetable", label: "Timetable", icon: CalendarIcon, path: "/timetable" },
    { id: "attendance", label: "Attendance", icon: CheckCircle, path: "/attendance" },
    { id: "analytics", label: "Analytics", icon: BarChart3, path: "/analytics" },
    { id: "about", label: "About", icon: Info, path: "/about" }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      onToggle(); // Close sidebar on mobile after navigation
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="bg-card shadow-soft rounded-xl w-12 h-12 md:w-10 md:h-10"
        >
          {isOpen ? <X className="h-5 w-5 md:h-4 md:w-4" /> : <Menu className="h-5 w-5 md:h-4 md:w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:relative lg:translate-x-0 transition-all duration-300 ease-in-out z-40",
        "w-64 h-screen bg-card border-r border-border shadow-soft",
        "lg:w-64 sm:w-72", // Responsive width
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">MyAttendance</span>
          </div>

          {/* Profile Card */}
          <Card className="mb-6 bg-gradient-primary text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold">{profile?.full_name || user?.email || "Student"}</h3>
                  <p className="text-white/80 text-sm">Roll: {profile?.roll_number || "N/A"}</p>
                  <p className="text-white/80 text-sm">{profile?.branch || "N/A"}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigation(item.path)}
                  className={cn(
                    "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200",
                    isActive 
                      ? "bg-primary text-white shadow-soft" 
                      : "text-muted-foreground hover:bg-primary-light hover:text-primary"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-6 left-6 right-6">
            <Button 
              onClick={handleLogout}
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span className="font-medium">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={onToggle}
        />
      )}
    </>
  );
};