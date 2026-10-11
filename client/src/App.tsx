import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PolicyBrief from "./pages/PolicyBrief";
import Methodology from "./pages/Methodology";

import { Link, useLocation } from "wouter";

function Navigation() {
  const [location] = useLocation();
  
  const isActive = (path: string) => location === path;
  
  return (
    <nav aria-label="Main navigation" className="bg-white border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between min-h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center cursor-pointer py-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="font-bold text-xl text-gray-900">SDG Dashboard</span>
            </Link>
          </div>
          <div className="flex flex-wrap gap-4 sm:ml-6 sm:gap-8 pb-3 sm:pb-0">
            <Link href="/dashboard" className={`${isActive('/dashboard') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
              Dashboard
            </Link>
            <Link href="/policy-brief" className={`${isActive('/policy-brief') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
              Policy Brief
            </Link>
            <Link href="/methodology" className={`${isActive('/methodology') ? 'border-blue-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer`}>
              Methodology
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="min-w-0 mb-4 md:mb-0">
            <p className="text-sm text-gray-900 font-medium">
              Independent analytical prototype by Matin Yunusov. Not affiliated with, commissioned by, endorsed by, officially reviewed by, or operated by UNDP.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Bundled WDI snapshot: retrieved 25 January 2026; observations end in 2023 or earlier. Live refresh is separate. Not a forecast.
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Designed as a lightweight analytical prototype rather than a production monitoring system.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Tools used: Data processing and visualization supported by Manus.
            </p>
          </div>
          <a href="https://github.com/yunusovmatin/sdg-monitoring-policy-analytics-tajikistan" className="text-sm text-blue-700 underline focus-visible:outline" target="_blank" rel="noopener noreferrer">Project source on GitHub</a>
        </div>
      </div>
    </footer>
  );
}

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navigation />
      <main className="flex-grow">
        <Switch>
          <Route path={"/"} component={Home} />
          <Route path={"/dashboard"} component={Dashboard} />
          <Route path={"/policy-brief"} component={PolicyBrief} />
          <Route path={"/methodology"} component={Methodology} />
          <Route path={"/404"} component={NotFound} />
          {/* Final fallback route */}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
