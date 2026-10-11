import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { BarChart3, FileText, BookOpen, TrendingUp } from "lucide-react";

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">


      {/* Hero Section */}
      <section className="container py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              SDG Monitoring Dashboard for <span className="text-blue-600">Tajikistan</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Independent analytical prototype designed to explore SDG trends and programming trade-offs using UNDP-aligned frameworks. Monitor Sustainable Development Goals indicators, benchmark against regional peers, and discuss hypothetical scenarios to 2030.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Explore Dashboard
              </Button>
              <Button
                onClick={() => navigate("/policy-brief")}
                variant="outline"
                size="lg"
              >
                <FileText className="w-5 h-5 mr-2" />
                Read Policy Brief
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">17</div>
              <p className="text-gray-600 font-medium">Key Indicators</p>
              <p className="text-sm text-gray-500 mt-1">Tracked across 6 countries</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">24</div>
              <p className="text-gray-600 font-medium">Years of Data</p>
              <p className="text-sm text-gray-500 mt-1">2000–2023 envelope; coverage varies</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">6</div>
              <p className="text-gray-600 font-medium">Countries</p>
              <p className="text-sm text-gray-500 mt-1">Tajikistan plus five peers</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="text-3xl font-bold text-blue-600 mb-2">4</div>
              <p className="text-gray-600 font-medium">Core SDGs</p>
              <p className="text-sm text-gray-500 mt-1">Poverty, Work, Inequality, Climate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white border-t border-gray-200">
        <div className="container py-20">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Comprehensive Analysis Tools
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-transparent border border-blue-100">
              <BarChart3 className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">Interactive Dashboard</h4>
              <p className="text-gray-600">
                Explore trends, benchmark countries, and inspect hypothetical arithmetic scenarios with interactive charts and filters.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-transparent border border-blue-100">
              <FileText className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">Policy Brief</h4>
              <p className="text-gray-600">
                UNDP-style analysis with key findings, implications for programming, and qualified programming hypotheses.
              </p>
            </div>
            <div className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-transparent border border-blue-100">
              <BookOpen className="w-8 h-8 text-blue-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">Methodology</h4>
              <p className="text-gray-600">
                Transparent documentation of data sources, definitions, limitations, and analytical approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Explore?</h3>
          <p className="text-lg mb-8 opacity-90">
            Dive into the interactive dashboard to analyze development trends in Tajikistan.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Go to Dashboard
          </Button>
        </div>
      </section>


    </div>
  );
}
