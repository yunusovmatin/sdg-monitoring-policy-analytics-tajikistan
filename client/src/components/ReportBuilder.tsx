import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileText, GripVertical, Plus, Trash2, Download, Share2, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

interface ReportSection {
  id: string;
  title: string;
  type: "chart" | "text" | "table" | "kpi";
  content: string;
}

export default function ReportBuilder() {
  const [sections, setSections] = useState<ReportSection[]>([
    { id: "1", title: "Executive Summary", type: "text", content: "Summary of key findings..." },
    { id: "2", title: "Poverty Trends", type: "chart", content: "Poverty Headcount Ratio Chart" },
    { id: "3", title: "Key Indicators Table", type: "table", content: "Comparison of 17 indicators" }
  ]);
  
  const [availableWidgets] = useState([
    { id: "w1", title: "GDP Growth Chart", type: "chart" },
    { id: "w2", title: "Unemployment Stats", type: "kpi" },
    { id: "w3", title: "Regional Map", type: "chart" },
    { id: "w4", title: "Policy Recommendations", type: "text" }
  ]);

  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const addSection = (widget: { title: string; type: string }) => {
    const newSection: ReportSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: widget.title,
      type: widget.type as any,
      content: `${widget.title} content placeholder`
    };
    setSections([...sections, newSection]);
    toast.success(`Added ${widget.title} to report`);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === sections.length - 1)
    ) return;

    const newSections = [...sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    setSections(newSections);
  };

  const generatePDF = () => {
    toast.success("Generating PDF report...");
    setTimeout(() => {
      toast.success("Report downloaded successfully!");
    }, 1500);
  };

  const handleShare = () => {
    // Generate a unique ID based on the current configuration
    const uniqueId = Math.random().toString(36).substring(2, 15);
    const url = `${window.location.origin}/report/${uniqueId}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url);
    toast.success("Report link copied to clipboard!");
  };

  const submitFeedback = () => {
    if (!feedback.trim()) return;
    toast.success("Thank you for your suggestion!");
    setFeedback("");
    setShowFeedback(false);
  };

  return (
    <div className="space-y-8">
      <Card className="p-6 bg-white shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Custom Report Builder</h3>
              <p className="text-sm text-gray-500">Drag and drop widgets to create a custom PDF report</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleShare} variant="outline" disabled={sections.length === 0}>
              <Share2 className="w-4 h-4 mr-2" />
              Share Report
            </Button>
            <Button onClick={generatePDF} className="bg-blue-600 hover:bg-blue-700" disabled={sections.length === 0}>
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </div>

        {shareUrl && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div>
              <p className="text-sm font-medium text-green-800">Report ready to share!</p>
              <p className="text-xs text-green-600 mt-1">{shareUrl}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => {
              navigator.clipboard.writeText(shareUrl);
              toast.success("Link copied!");
            }} className="text-green-700 hover:text-green-800 hover:bg-green-100">
              Copy Link
            </Button>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-8">
          {/* Available Widgets */}
          <div className="md:col-span-1 space-y-4">
            <h4 className="font-medium text-gray-700 mb-2">Available Widgets</h4>
            <div className="space-y-2">
              {availableWidgets.map((widget) => (
                <div 
                  key={widget.id}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between group hover:border-blue-300 transition-colors cursor-pointer"
                  onClick={() => addSection(widget)}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      widget.type === 'chart' ? 'bg-blue-500' : 
                      widget.type === 'text' ? 'bg-green-500' : 
                      widget.type === 'table' ? 'bg-orange-500' : 'bg-purple-500'
                    }`} />
                    <span className="text-sm font-medium text-gray-700">{widget.title}</span>
                  </div>
                  <Plus className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h5 className="text-sm font-bold text-blue-800 mb-1">Pro Tip</h5>
              <p className="text-xs text-blue-600">
                You can add charts directly from the Dashboard by clicking the "Add to Report" button on any visualization.
              </p>
            </div>

            {/* Feedback Widget */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              {!showFeedback ? (
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-gray-500 hover:text-blue-600"
                  onClick={() => setShowFeedback(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Suggest a new widget
                </Button>
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Suggest a Widget</h5>
                  <Textarea 
                    placeholder="What data would you like to see?" 
                    className="text-sm mb-2 h-20 bg-white"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowFeedback(false)}
                      className="h-7 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={submitFeedback}
                      className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                      disabled={!feedback.trim()}
                    >
                      <Send className="w-3 h-3 mr-1" />
                      Send
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Report Canvas */}
          <div className="md:col-span-2 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-6 min-h-[400px]">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium text-gray-700">Report Structure</h4>
              <span className="text-xs text-gray-500">{sections.length} sections</span>
            </div>

            {sections.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 py-12">
                <FileText className="w-12 h-12 mb-3 opacity-20" />
                <p>Your report is empty</p>
                <p className="text-sm">Add widgets from the left panel</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sections.map((section, index) => (
                  <div 
                    key={section.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center gap-4 group"
                  >
                    <div className="flex flex-col gap-1 text-gray-300">
                      <button 
                        onClick={() => moveSection(index, "up")}
                        disabled={index === 0}
                        className="hover:text-gray-600 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <GripVertical className="w-4 h-4 cursor-grab active:cursor-grabbing" />
                      <button 
                        onClick={() => moveSection(index, "down")}
                        disabled={index === sections.length - 1}
                        className="hover:text-gray-600 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          section.type === 'chart' ? 'bg-blue-100 text-blue-700' : 
                          section.type === 'text' ? 'bg-green-100 text-green-700' : 
                          section.type === 'table' ? 'bg-orange-100 text-orange-700' : 'bg-purple-100 text-purple-700'
                        }`}>
                          {section.type.toUpperCase()}
                        </span>
                        <h5 className="font-medium text-gray-900">{section.title}</h5>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{section.content}</p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSection(section.id)}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
