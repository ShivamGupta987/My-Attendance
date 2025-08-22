import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, User, Hash, GraduationCap, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Auth = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    branch: "",
    email: "",
    password: ""
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const { login, signup, isAuthenticated } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const branches = [
    // Engineering
    "Computer Science Engineering",
    "Information Technology",
    "Electronics and Communication",
    "Electrical Engineering",
    "Mechanical Engineering", 
    "Civil Engineering",
    "Chemical Engineering",
    "Aerospace Engineering",
    "Automobile Engineering",
    "Biotechnology Engineering",
    "Environmental Engineering",
    "Mining Engineering",
    "Petroleum Engineering",
    "Production Engineering",
    
    // Medical
    "MBBS",
    "BDS (Bachelor of Dental Surgery)",
    "BAMS (Bachelor of Ayurvedic Medicine)",
    "BHMS (Bachelor of Homeopathic Medicine)",
    "B.Pharmacy",
    "D.Pharmacy",
    "B.Sc Nursing",
    "BPT (Bachelor of Physiotherapy)",
    "B.Sc Medical Laboratory Technology",
    "BMLT (Bachelor of Medical Lab Technology)",
    
    // 11th & 12th Grade
    "Class 11 - Science (PCM)",
    "Class 11 - Science (PCB)",
    "Class 11 - Commerce",
    "Class 11 - Arts/Humanities",
    "Class 12 - Science (PCM)",
    "Class 12 - Science (PCB)",
    "Class 12 - Commerce",
    "Class 12 - Arts/Humanities",
    
    // Other Professional Courses
    "B.Tech (Other)",
    "B.Sc (General)",
    "BCA (Bachelor of Computer Applications)",
    "BBA (Bachelor of Business Administration)",
    "B.Com (Bachelor of Commerce)",
    "BA (Bachelor of Arts)",
    "LLB (Bachelor of Law)",
    "B.Ed (Bachelor of Education)",
    "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLoginChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.rollNumber || !formData.branch || !formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const result = await signup({
      fullName: formData.fullName,
      rollNumber: formData.rollNumber,
      branch: formData.branch,
      email: formData.email,
      password: formData.password
    });
    
    if (result.success) {
      toast({
        title: "Success!",
        description: "Account created successfully",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Error",
        description: result.error || "Signup failed",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const result = await login({
      email: loginData.email,
      password: loginData.password
    });
    
    if (result.success) {
      toast({
        title: "Welcome back!",
        description: "Successfully logged in",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Error",
        description: result.error || "Login failed",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-6 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">MyAttendance</span>
          </Link>
        </div>

        <Card className="card-soft shadow-float">
          <CardHeader className="text-center pb-4">
            <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground">Student Portal</CardTitle>
            <p className="text-muted-foreground">Enter your details to get started</p>
          </CardHeader>
          
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted rounded-xl p-1">
                <TabsTrigger value="signup" className="rounded-lg font-medium">Create Account</TabsTrigger>
                <TabsTrigger value="login" className="rounded-lg font-medium">Login</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-sm font-medium text-foreground">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="fullName"
                        placeholder="e.g. Kaushalendra"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="pl-10 rounded-xl border-border focus:border-primary"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rollNumber" className="text-sm font-medium text-foreground">Roll Number</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="rollNumber"
                        placeholder="e.g. 230110038"
                        value={formData.rollNumber}
                        onChange={(e) => handleInputChange("rollNumber", e.target.value)}
                        className="pl-10 rounded-xl border-border focus:border-primary"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                    <div className="space-y-2">
                      <Label htmlFor="branch" className="text-sm font-medium text-foreground">Select Branch</Label>
                      <Select value={formData.branch} onValueChange={(value) => handleInputChange("branch", value)} disabled={isLoading}>
                        <SelectTrigger className="rounded-xl border-border focus:border-primary">
                          <SelectValue placeholder="Select your branch" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {branches.map((branch) => (
                            <SelectItem key={branch} value={branch} className="rounded-lg">
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="e.g. your.email@example.com"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="pl-10 rounded-xl border-border focus:border-primary"
                          disabled={isLoading}
                        />
                      </div>
                    </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="pl-10 pr-10 rounded-xl border-border focus:border-primary"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full btn-hero mt-6" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="loginEmail" className="text-sm font-medium text-foreground">Email</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="loginEmail"
                        type="email"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) => handleLoginChange("email", e.target.value)}
                        className="pl-10 rounded-xl border-border focus:border-primary"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="loginPassword" className="text-sm font-medium text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="loginPassword"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) => handleLoginChange("password", e.target.value)}
                        className="pl-10 pr-10 rounded-xl border-border focus:border-primary"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <a href="#" className="text-sm text-primary hover:text-primary-light transition-colors">
                      Forgot password?
                    </a>
                  </div>

                  <Button type="submit" className="w-full btn-hero mt-6" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button variant="outline" className="rounded-xl">
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.64 12.3c0-.79-.07-1.54-.19-2.27h-11.3v4.29h6.47c-.28 1.49-1.13 2.75-2.4 3.6v2.98h3.87c2.27-2.09 3.58-5.17 3.58-8.6z"/>
                    <path d="M12.15 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-2.98c-1.07.72-2.44 1.15-4.06 1.15-3.12 0-5.76-2.11-6.71-4.94h-4v3.08c1.97 3.92 6.02 6.6 10.71 6.6z"/>
                  </svg>
                  Microsoft
                </Button>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {activeTab === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button 
                onClick={() => setActiveTab(activeTab === "login" ? "signup" : "login")}
                className="text-primary hover:text-primary-light transition-colors font-medium"
                disabled={isLoading}
              >
                {activeTab === "login" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;