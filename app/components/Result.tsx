"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Edit2, Save, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ResultProps {
  content: string;
  summary: string;
  notes: string;
  url: string;
  onReturn: () => void;
  onSaveSummary: (newSummary: string) => void;
  onSaveNotes: (newNotes: string) => void;
}

const generateExportContent = (url: string, summary: string, notes: string) => {
  const timestamp = new Date().toISOString().split("T")[0];
  return `# Article Notes - ${timestamp}

## Source
${url}

## Summary
${summary}

## Personal Notes
${notes}
`;
};

export default function Result({ 
  content, 
  summary, 
  notes,
  url,
  onReturn, 
  onSaveSummary,
  onSaveNotes 
}: ResultProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedSummary, setEditedSummary] = useState(summary);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [editedNotes, setEditedNotes] = useState(notes);

  const handleSave = () => {
    onSaveSummary(editedSummary);
    setIsEditing(false);
  };

  const handleSaveNotes = () => {
    onSaveNotes(editedNotes);
    setIsEditingNotes(false);
  };

  const handleExport = () => {
    const exportContent = generateExportContent(url, summary, notes);
    const blob = new Blob([exportContent], { type: "text/markdown" });
    const downloadUrl = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `article-notes-${new Date().toISOString().split("T")[0]}.md`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(downloadUrl);
    document.body.removeChild(a);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button 
            onClick={onReturn} 
            variant="outline"
            size="sm"
            className="w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Search
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            size="sm"
            className="w-fit"
          >
            <Download className="mr-2 h-4 w-4" />
            Export Notes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="article" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="article">Original Article</TabsTrigger>
            <TabsTrigger value="summary">Summary & Notes</TabsTrigger>
          </TabsList>
          <TabsContent value="article" className="mt-4">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </TabsContent>
          <TabsContent value="summary" className="mt-4 space-y-8">
            {/* Summary Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Summary</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                >
                  {isEditing ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="min-h-[200px] font-mono"
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{summary}</ReactMarkdown>
                </div>
              )}
            </div>

            <Separator />

            {/* Notes Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Personal Notes</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => isEditingNotes ? handleSaveNotes() : setIsEditingNotes(true)}
                >
                  {isEditingNotes ? (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  ) : (
                    <>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </>
                  )}
                </Button>
              </div>
              {isEditingNotes ? (
                <Textarea
                  value={editedNotes}
                  onChange={(e) => setEditedNotes(e.target.value)}
                  placeholder="Write your thoughts here..."
                  className="min-h-[200px] font-mono"
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none">
                  {notes ? (
                    <ReactMarkdown>{notes}</ReactMarkdown>
                  ) : (
                    <p className="text-muted-foreground">No notes yet. Click edit to add your thoughts.</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 