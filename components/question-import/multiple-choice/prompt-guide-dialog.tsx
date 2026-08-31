// "use client";

// import * as React from "react";
// import { Check, Clipboard, Sparkles } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/separator";
// import { Textarea } from "@/components/ui/textarea";

// import {
//   generateMultipleChoicePrompt,
//   type MultipleChoicePromptOptions,
// } from "./prompt-generator";

// interface PromptGuideDialogProps {
//   trigger?: React.ReactNode;
// }

// export function PromptGuideDialog({ trigger }: PromptGuideDialogProps) {
//   const [topic, setTopic] = React.useState("");
//   const [subject, setSubject] = React.useState("");
//   const [questionCount, setQuestionCount] = React.useState("100");
//   const [generatedPrompt, setGeneratedPrompt] = React.useState("");
//   const [copied, setCopied] = React.useState(false);

//   const count = Number(questionCount);

//   const canGenerate =
//     topic.trim().length > 0 &&
//     subject.trim().length > 0 &&
//     Number.isInteger(count) &&
//     count >= 1 &&
//     count <= 1000;

//   function handleGenerate() {
//     if (!canGenerate) {
//       return;
//     }

//     const options: MultipleChoicePromptOptions = {
//       topic,
//       subject,
//       questionCount: count,
//     };

//     setGeneratedPrompt(generateMultipleChoicePrompt(options));

//     setCopied(false);
//   }

//   async function handleCopy() {
//     if (!generatedPrompt) {
//       return;
//     }

//     await navigator.clipboard.writeText(generatedPrompt);

//     setCopied(true);

//     window.setTimeout(() => {
//       setCopied(false);
//     }, 2000);
//   }

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         {trigger ?? (
//           <Button variant="outline" size="sm" className="gap-2">
//             <Sparkles className="size-4" />
//             Prompt Guide
//           </Button>
//         )}
//       </DialogTrigger>

//       <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden">
//         <DialogHeader>
//           <DialogTitle>Multiple Choice Prompt Guide</DialogTitle>

//           <DialogDescription>
//             Tell us what you want to generate. NoweLAX will build a
//             research-focused prompt you can give to an external AI.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="grid min-h-0 gap-6 overflow-y-auto py-2">
//           <div className="grid gap-4">
//             <div className="grid gap-2">
//               <Label htmlFor="prompt-topic">Topic / Category</Label>

//               <Input
//                 id="prompt-topic"
//                 value={topic}
//                 onChange={(event) => setTopic(event.target.value)}
//                 placeholder="e.g. Agriculture"
//               />

//               <p className="text-xs text-muted-foreground">
//                 The broader field or category.
//               </p>
//             </div>

//             <div className="grid gap-2">
//               <Label htmlFor="prompt-subject">Subject</Label>

//               <Input
//                 id="prompt-subject"
//                 value={subject}
//                 onChange={(event) => setSubject(event.target.value)}
//                 placeholder="e.g. Crop Science"
//               />

//               <p className="text-xs text-muted-foreground">
//                 Be as specific as possible. This becomes the primary scope of
//                 the generated questions.
//               </p>
//             </div>

//             <div className="grid gap-2">
//               <Label htmlFor="prompt-count">Number of Questions</Label>

//               <Input
//                 id="prompt-count"
//                 type="number"
//                 min={1}
//                 max={1000}
//                 value={questionCount}
//                 onChange={(event) => setQuestionCount(event.target.value)}
//               />

//               <p className="text-xs text-muted-foreground">
//                 Maximum 1,000 questions per generation.
//               </p>
//             </div>

//             <Button
//               type="button"
//               onClick={handleGenerate}
//               disabled={!canGenerate}
//               className="gap-2"
//             >
//               <Sparkles className="size-4" />
//               Generate Prompt
//             </Button>
//           </div>

//           {generatedPrompt && (
//             <>
//               <Separator />

//               <div className="grid gap-3">
//                 <div className="flex items-center justify-between gap-3">
//                   <div>
//                     <h3 className="text-sm font-medium">Generated Prompt</h3>

//                     <p className="text-xs text-muted-foreground">
//                       Copy this prompt into your external AI tool.
//                     </p>
//                   </div>

//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={handleCopy}
//                     className="gap-2"
//                   >
//                     {copied ? (
//                       <Check className="size-4" />
//                     ) : (
//                       <Clipboard className="size-4" />
//                     )}

//                     {copied ? "Copied" : "Copy"}
//                   </Button>
//                 </div>

//                 <Textarea
//                   value={generatedPrompt}
//                   readOnly
//                   className="min-h-80 resize-y font-mono text-xs leading-5"
//                 />
//               </div>
//             </>
//           )}
//         </div>

//         <DialogFooter>
//           <p className="mr-auto text-xs text-muted-foreground">
//             The external AI is responsible for performing the research and
//             following the generated instructions.
//           </p>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
// components/question-import/multiple-choice/prompt-guide-dialog.tsx

"use client";

import * as React from "react";
import {
  Check,
  Clipboard,
  Plus,
  Sparkles,
  ChevronsUpDown,
  Loader2,
  X,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import {
  generateMultipleChoicePrompt,
  type MultipleChoicePromptOptions,
} from "./prompt-generator";

import { useCategories } from "@/hooks/use-categories";
import { useSubjects } from "@/hooks/use-subjects";

interface PromptGuideDialogProps {
  trigger?: React.ReactNode;
}

// Helper function to truncate text
function truncateText(text: string, maxLength: number = 35): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function PromptGuideDialog({ trigger }: PromptGuideDialogProps) {
  // ============================================================
  // FORM STATE
  // ============================================================

  const [topic, setTopic] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [questionCount, setQuestionCount] = React.useState("100");
  const [generatedPrompt, setGeneratedPrompt] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  // ============================================================
  // CATEGORY STATE
  // ============================================================

  const [categoryPopoverOpen, setCategoryPopoverOpen] = React.useState(false);
  const [categoryId, setCategoryId] = React.useState("");
  const [newCategoryMode, setNewCategoryMode] = React.useState(false);
  const [categoryName, setCategoryName] = React.useState("");

  // ============================================================
  // SUBJECT STATE
  // ============================================================

  const [subjectPopoverOpen, setSubjectPopoverOpen] = React.useState(false);
  const [subjectId, setSubjectId] = React.useState("");
  const [newSubjectMode, setNewSubjectMode] = React.useState(false);
  const [subjectName, setSubjectName] = React.useState("");

  // ============================================================
  // QUERIES
  // ============================================================

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useCategories();

  const {
    data: subjects = [],
    isLoading: subjectsLoading,
    isFetching: subjectsFetching,
    isError: subjectsError,
  } = useSubjects(categoryId || undefined);

  // ============================================================
  // SELECTED VALUES
  // ============================================================

  const selectedCategory = categories.find(
    (category) => category.id === categoryId,
  );

  const selectedSubject = subjects.find((subject) => subject.id === subjectId);

  // ============================================================
  // VALIDATION
  // ============================================================

  const trimmedCategoryName = categoryName.trim();
  const trimmedSubjectName = subjectName.trim();

  const hasCategory = Boolean(categoryId) || trimmedCategoryName.length > 0;
  const hasSubject = Boolean(subjectId) || trimmedSubjectName.length > 0;

  const count = Number(questionCount);

  const canGenerate =
    hasCategory &&
    hasSubject &&
    Number.isInteger(count) &&
    count >= 1 &&
    count <= 1000;

  // ============================================================
  // CATEGORY HANDLERS
  // ============================================================

  function selectExistingCategory(id: string) {
    setCategoryId(id);
    setCategoryName("");
    setNewCategoryMode(false);
    setCategoryPopoverOpen(false);

    // Reset subject when category changes
    setSubjectId("");
    setSubjectName("");
    setNewSubjectMode(false);
  }

  function selectNewCategory() {
    setCategoryId("");
    setCategoryName("");
    setNewCategoryMode(true);
    setCategoryPopoverOpen(false);

    // Reset subject when creating new category
    setSubjectId("");
    setSubjectName("");
    setNewSubjectMode(false);
  }

  function cancelNewCategory() {
    setNewCategoryMode(false);
    setCategoryName("");
  }

  // ============================================================
  // SUBJECT HANDLERS
  // ============================================================

  function selectExistingSubject(id: string) {
    setSubjectId(id);
    setSubjectName("");
    setNewSubjectMode(false);
    setSubjectPopoverOpen(false);
  }

  function selectNewSubject() {
    setSubjectId("");
    setSubjectName("");
    setNewSubjectMode(true);
    setSubjectPopoverOpen(false);
  }

  function cancelNewSubject() {
    setNewSubjectMode(false);
    setSubjectName("");
  }

  // ============================================================
  // PROMPT GENERATION
  // ============================================================

  function handleGenerate() {
    if (!canGenerate) {
      return;
    }

    // Use the selected/created category and subject names
    const topicName = selectedCategory?.name || trimmedCategoryName;
    const subjectName = selectedSubject?.name || trimmedSubjectName;

    const options: MultipleChoicePromptOptions = {
      topic: topicName,
      subject: subjectName,
      questionCount: count,
    };

    setGeneratedPrompt(generateMultipleChoicePrompt(options));
    setCopied(false);
  }

  // ============================================================
  // COPY HANDLER
  // ============================================================

  async function handleCopy() {
    if (!generatedPrompt) {
      return;
    }

    await navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  // ============================================================
  // DIALOG RESET
  // ============================================================

  function resetForm() {
    setCategoryId("");
    setCategoryName("");
    setNewCategoryMode(false);
    setSubjectId("");
    setSubjectName("");
    setNewSubjectMode(false);
    setGeneratedPrompt("");
    setCopied(false);
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="outline" size="sm" className="gap-2">
            <Sparkles className="size-4" />
            Prompt Guide
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] w-[95vw] max-w-3xl overflow-hidden p-0">
        <ScrollArea className="h-[90vh]">
          <div className="p-6 pb-0">
            <DialogHeader className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Sparkles className="size-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <DialogTitle className="text-xl">
                    Multiple Choice Prompt Guide
                  </DialogTitle>
                  <DialogDescription className="text-sm">
                    Select or create a category and subject, then generate a
                    research-focused prompt.
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* ================================================== */}
              {/* CATEGORY SELECTION */}
              {/* ================================================== */}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="category" className="text-sm font-medium">
                    Topic / Category
                  </Label>
                  {selectedCategory && !newCategoryMode && (
                    <Badge variant="secondary" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>

                {newCategoryMode ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="category"
                        value={categoryName}
                        onChange={(event) =>
                          setCategoryName(event.target.value)
                        }
                        placeholder="Enter new category name..."
                        autoFocus
                        className="pr-8"
                      />
                      {categoryName && (
                        <button
                          type="button"
                          onClick={() => setCategoryName("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelNewCategory}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Popover
                    open={categoryPopoverOpen}
                    onOpenChange={setCategoryPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryPopoverOpen}
                        className="w-full justify-between overflow-hidden font-normal hover:bg-accent/50"
                      >
                        <span className="min-w-0 flex-1 truncate text-left">
                          {selectedCategory?.name ? (
                            <span className="flex items-center gap-2">
                              <span className="size-2 shrink-0 rounded-full bg-primary" />
                              <span className="truncate">
                                {truncateText(selectedCategory.name, 40)}
                              </span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Select a category...
                            </span>
                          )}
                        </span>
                        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      align="start"
                      className="w-[--radix-popover-trigger-width] p-0"
                      style={{ minWidth: "200px" }}
                    >
                      <Command>
                        <CommandInput placeholder="Search categories..." />
                        <CommandList>
                          <CommandEmpty>No category found.</CommandEmpty>

                          {categoriesError ? (
                            <div className="px-3 py-6 text-center text-sm text-destructive">
                              Failed to load categories.
                            </div>
                          ) : categoriesLoading ? (
                            <div className="flex items-center justify-center py-6">
                              <Loader2 className="size-4 animate-spin" />
                            </div>
                          ) : (
                            <>
                              <CommandGroup heading="Existing categories">
                                {categories.map((category) => (
                                  <CommandItem
                                    key={category.id}
                                    value={category.name}
                                    onSelect={() =>
                                      selectExistingCategory(category.id)
                                    }
                                    className="flex items-center gap-2 capitalize mt-2"
                                  >
                                    <Check
                                      className={cn(
                                        "size-4 shrink-0",
                                        categoryId === category.id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <span className="flex-1 truncate">
                                      {category.name}
                                    </span>
                                    {categoryId === category.id && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-auto shrink-0 text-xs"
                                      >
                                        Selected
                                      </Badge>
                                    )}
                                  </CommandItem>
                                ))}
                              </CommandGroup>

                              <CommandGroup>
                                <CommandItem
                                  value="create-new-category"
                                  onSelect={selectNewCategory}
                                  className="gap-2 text-primary"
                                >
                                  <Plus className="size-4" />
                                  Create new category
                                </CommandItem>
                              </CommandGroup>
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}

                <p className="text-xs text-muted-foreground">
                  {newCategoryMode
                    ? "Enter a name for the new category."
                    : "Choose an existing category or create a new one."}
                </p>
              </div>

              {/* ================================================== */}
              {/* SUBJECT SELECTION */}
              {/* ================================================== */}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </Label>
                  {selectedSubject && !newSubjectMode && (
                    <Badge variant="secondary" className="text-xs">
                      Selected
                    </Badge>
                  )}
                </div>

                {newSubjectMode ? (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Input
                        id="subject"
                        value={subjectName}
                        onChange={(event) => setSubjectName(event.target.value)}
                        placeholder="Enter new subject name..."
                        autoFocus
                        className="pr-8"
                      />
                      {subjectName && (
                        <button
                          type="button"
                          onClick={() => setSubjectName("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={cancelNewSubject}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Popover
                    open={subjectPopoverOpen}
                    onOpenChange={setSubjectPopoverOpen}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        role="combobox"
                        aria-expanded={subjectPopoverOpen}
                        disabled={!categoryId && !newCategoryMode}
                        className="w-full justify-between overflow-hidden font-normal hover:bg-accent/50"
                      >
                        <span className="min-w-0 flex-1 truncate text-left">
                          {!categoryId && !newCategoryMode ? (
                            <span className="text-muted-foreground">
                              Select a category first...
                            </span>
                          ) : subjectsLoading || subjectsFetching ? (
                            <span className="flex items-center gap-2 text-muted-foreground">
                              <Loader2 className="size-4 animate-spin" />
                              Loading subjects...
                            </span>
                          ) : selectedSubject?.name ? (
                            <span className="flex items-center gap-2">
                              <span className="size-2 shrink-0 rounded-full bg-primary" />
                              <span className="truncate">
                                {truncateText(selectedSubject.name, 40)}
                              </span>
                            </span>
                          ) : (
                            <span className="text-muted-foreground">
                              Select a subject...
                            </span>
                          )}
                        </span>
                        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>

                    <PopoverContent
                      align="start"
                      className="w-[--radix-popover-trigger-width] p-0"
                      style={{ minWidth: "200px" }}
                    >
                      <Command>
                        <CommandInput placeholder="Search subjects..." />
                        <CommandList>
                          <CommandEmpty>No subject found.</CommandEmpty>

                          {subjectsError ? (
                            <div className="px-3 py-6 text-center text-sm text-destructive">
                              Failed to load subjects.
                            </div>
                          ) : (
                            <>
                              <CommandGroup heading="Existing subjects">
                                {subjects.map((subject) => (
                                  <CommandItem
                                    key={subject.id}
                                    value={subject.name}
                                    onSelect={() =>
                                      selectExistingSubject(subject.id)
                                    }
                                    className="flex items-center gap-2 capitalize mt-2 "
                                  >
                                    <Check
                                      className={cn(
                                        "size-4 shrink-0",
                                        subjectId === subject.id
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    <span className="flex-1 truncate">
                                      {subject.name}
                                    </span>
                                    {subjectId === subject.id && (
                                      <Badge
                                        variant="secondary"
                                        className="ml-auto shrink-0 text-xs"
                                      >
                                        Selected
                                      </Badge>
                                    )}
                                  </CommandItem>
                                ))}
                              </CommandGroup>

                              <CommandGroup>
                                <CommandItem
                                  value="create-new-subject"
                                  onSelect={selectNewSubject}
                                  className="gap-2 text-primary"
                                >
                                  <Plus className="size-4" />
                                  Create new subject
                                </CommandItem>
                              </CommandGroup>
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                )}

                <p className="text-xs text-muted-foreground">
                  {newSubjectMode
                    ? "Enter a name for the new subject."
                    : categoryId || newCategoryMode
                      ? "Choose an existing subject or create a new one."
                      : "Please select a category first."}
                </p>
              </div>

              {/* ================================================== */}
              {/* SELECTION SUMMARY */}
              {/* ================================================== */}

              {(selectedCategory || trimmedCategoryName) &&
                (selectedSubject || trimmedSubjectName) && (
                  <div className="rounded-lg border bg-muted/30 p-3">
                    <p className="text-xs font-medium text-foreground">
                      Selected Context
                    </p>
                    <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      <p className="truncate">
                        Category:{" "}
                        <span className="font-medium text-foreground">
                          {selectedCategory?.name || trimmedCategoryName}
                        </span>
                      </p>
                      <p className="truncate">
                        Subject:{" "}
                        <span className="font-medium text-foreground">
                          {selectedSubject?.name || trimmedSubjectName}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

              {/* ================================================== */}
              {/* QUESTION COUNT */}
              {/* ================================================== */}

              <div className="space-y-2">
                <Label htmlFor="prompt-count" className="text-sm font-medium">
                  Number of Questions
                </Label>
                <Input
                  id="prompt-count"
                  type="number"
                  min={1}
                  max={1000}
                  value={questionCount}
                  onChange={(event) => setQuestionCount(event.target.value)}
                  className="max-w-50"
                />
                <p className="text-xs text-muted-foreground">
                  Maximum 1,000 questions per generation.
                </p>
              </div>

              {/* ================================================== */}
              {/* GENERATE BUTTON */}
              {/* ================================================== */}

              <Button
                type="button"
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="h-11 w-full gap-2"
              >
                <Sparkles className="size-4" />
                Generate Prompt
              </Button>
            </div>
          </div>

          {/* ================================================== */}
          {/* GENERATED PROMPT SECTION - Outside the form area */}
          {/* ================================================== */}

          {generatedPrompt && (
            <div className="mt-6 border-t pt-6">
              <div className="space-y-3 px-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold">Generated Prompt</h3>
                    <p className="text-xs text-muted-foreground">
                      Copy this prompt into your external AI tool.
                    </p>
                  </div>

                  <Button
                    type="button"
                    onClick={handleCopy}
                    className={cn(
                      "gap-2 shrink-0",
                      copied ? "bg-green-600 hover:bg-green-700" : "",
                    )}
                  >
                    {copied ? (
                      <>
                        <Check className="size-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="size-4" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
                </div>

                <div className="relative rounded-lg border bg-muted/30 max-w-sm">
                  <Textarea
                    value={generatedPrompt}
                    readOnly
                    className="max-h-40"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="sticky bottom-0 bg-background/95 px-6 py-4 backdrop-blur supports-backdrop-filter:bg-background/60">
            <p className="mr-auto text-xs text-muted-foreground">
              The external AI is responsible for performing the research and
              following the generated instructions.
            </p>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
