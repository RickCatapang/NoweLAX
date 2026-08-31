// "use client";

// import * as React from "react";

// import { Check, ChevronsUpDown, Plus } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";

// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";

// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import type { MultipleChoiceImport } from "@/src/lib/validations/question-import";

// import { cn } from "@/lib/utils";
// import {
//   createImportCategory,
//   createImportSubject,
//   ensureCategorySubject,
//   getImportCategories,
//   getImportSubjects,
// } from "@/src/lib/actions/question-import/destination";
// import { importMultipleChoiceQuestions } from "@/src/lib/actions/question-import/multiple-choice-import";

// type Category = {
//   id: string;
//   name: string;
// };

// type Subject = {
//   id: string;
//   name: string;
// };

// interface ImportDestinationDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   questions: MultipleChoiceImport;
//   onSuccess: () => void;
// }

// export function ImportDestinationDialog({
//   open,
//   onOpenChange,
//   questions,
//   onSuccess,
// }: ImportDestinationDialogProps) {
//   const [categories, setCategories] = React.useState<Category[]>([]);
//   const [subjects, setSubjects] = React.useState<Subject[]>([]);

//   const [categoryId, setCategoryId] = React.useState("");
//   const [subjectId, setSubjectId] = React.useState("");

//   const [categoryOpen, setCategoryOpen] = React.useState(false);
//   const [subjectOpen, setSubjectOpen] = React.useState(false);

//   const [creatingCategory, setCreatingCategory] = React.useState(false);
//   const [creatingSubject, setCreatingSubject] = React.useState(false);

//   const [newCategory, setNewCategory] = React.useState("");
//   const [newSubject, setNewSubject] = React.useState("");

//   const [loading, setLoading] = React.useState(false);
//   const [message, setMessage] = React.useState<string | null>(null);

//   React.useEffect(() => {
//     if (!open) return;

//     async function load() {
//       const [loadedCategories, loadedSubjects] = await Promise.all([
//         getImportCategories(),
//         getImportSubjects(),
//       ]);

//       setCategories(loadedCategories);
//       setSubjects(loadedSubjects);

//       setMessage(null);
//     }

//     load();
//   }, [open]);

//   const selectedCategory = categories.find(
//     (category) => category.id === categoryId,
//   );

//   const selectedSubject = subjects.find((subject) => subject.id === subjectId);

//   async function handleCreateCategory() {
//     const result = await createImportCategory(newCategory);

//     if (!result.success) {
//       setMessage(result.message);
//       return;
//     }

//     setCategories((current) => [...current, result.category]);
//     setCategoryId(result.category.id);

//     setNewCategory("");
//     setCreatingCategory(false);
//     setMessage(null);
//   }

//   async function handleCreateSubject() {
//     const result = await createImportSubject(newSubject);

//     if (!result.success) {
//       setMessage(result.message);
//       return;
//     }

//     setSubjects((current) => [...current, result.subject]);
//     setSubjectId(result.subject.id);

//     setNewSubject("");
//     setCreatingSubject(false);
//     setMessage(null);
//   }

//   async function handleImport() {
//     if (!categoryId || !subjectId) {
//       setMessage("Please select both a category and subject.");
//       return;
//     }

//     setLoading(true);
//     setMessage(null);

//     try {
//       await ensureCategorySubject(categoryId, subjectId);

//       const result = await importMultipleChoiceQuestions(questions, {
//         categoryId,
//         subjectId,
//       });

//       if (!result.success) {
//         setMessage(result.message);
//         return;
//       }

//       onOpenChange(false);
//       onSuccess();
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-lg">
//         <DialogHeader>
//           <DialogTitle>Import Questions</DialogTitle>

//           <DialogDescription>
//             Choose where these {questions.questions.length} questions should be
//             stored in your question bank.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-5 py-2">
//           {/* Category */}
//           <div className="space-y-2">
//             <Label>Category</Label>

//             {!creatingCategory ? (
//               <div className="flex gap-2">
//                 <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       role="combobox"
//                       aria-expanded={categoryOpen}
//                       className="w-full justify-between"
//                     >
//                       {selectedCategory
//                         ? selectedCategory.name
//                         : "Select category..."}

//                       <ChevronsUpDown className="size-4 opacity-50" />
//                     </Button>
//                   </PopoverTrigger>

//                   <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
//                     <Command>
//                       <CommandInput placeholder="Search category..." />

//                       <CommandList>
//                         <CommandEmpty>No category found.</CommandEmpty>

//                         <CommandGroup>
//                           {categories.map((category) => (
//                             <CommandItem
//                               key={category.id}
//                               value={category.name}
//                               onSelect={() => {
//                                 setCategoryId(category.id);
//                                 setCategoryOpen(false);
//                               }}
//                             >
//                               {category.name}

//                               <Check
//                                 className={cn(
//                                   "ml-auto size-4",
//                                   categoryId === category.id
//                                     ? "opacity-100"
//                                     : "opacity-0",
//                                 )}
//                               />
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="icon"
//                   onClick={() => setCreatingCategory(true)}
//                   title="Create category"
//                 >
//                   <Plus />
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 <Input
//                   value={newCategory}
//                   onChange={(event) => setNewCategory(event.target.value)}
//                   placeholder="e.g. agriculturists licensure examination"
//                 />

//                 <div className="flex gap-2">
//                   <Button
//                     type="button"
//                     size="sm"
//                     onClick={handleCreateCategory}
//                   >
//                     Create Category
//                   </Button>

//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setCreatingCategory(false);
//                       setNewCategory("");
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Subject */}
//           <div className="space-y-2">
//             <Label>Subject</Label>

//             {!creatingSubject ? (
//               <div className="flex gap-2">
//                 <Popover open={subjectOpen} onOpenChange={setSubjectOpen}>
//                   <PopoverTrigger asChild>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       role="combobox"
//                       aria-expanded={subjectOpen}
//                       className="w-full justify-between"
//                     >
//                       {selectedSubject
//                         ? selectedSubject.name
//                         : "Select subject..."}

//                       <ChevronsUpDown className="size-4 opacity-50" />
//                     </Button>
//                   </PopoverTrigger>

//                   <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
//                     <Command>
//                       <CommandInput placeholder="Search subject..." />

//                       <CommandList>
//                         <CommandEmpty>No subject found.</CommandEmpty>

//                         <CommandGroup>
//                           {subjects.map((subject) => (
//                             <CommandItem
//                               key={subject.id}
//                               value={subject.name}
//                               onSelect={() => {
//                                 setSubjectId(subject.id);
//                                 setSubjectOpen(false);
//                               }}
//                             >
//                               {subject.name}

//                               <Check
//                                 className={cn(
//                                   "ml-auto size-4",
//                                   subjectId === subject.id
//                                     ? "opacity-100"
//                                     : "opacity-0",
//                                 )}
//                               />
//                             </CommandItem>
//                           ))}
//                         </CommandGroup>
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>

//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="icon"
//                   onClick={() => setCreatingSubject(true)}
//                   title="Create subject"
//                 >
//                   <Plus />
//                 </Button>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 <Input
//                   value={newSubject}
//                   onChange={(event) => setNewSubject(event.target.value)}
//                   placeholder="e.g. crop science"
//                 />

//                 <div className="flex gap-2">
//                   <Button type="button" size="sm" onClick={handleCreateSubject}>
//                     Create Subject
//                   </Button>

//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => {
//                       setCreatingSubject(false);
//                       setNewSubject("");
//                     }}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             )}
//           </div>

//           {message && <p className="text-sm text-destructive">{message}</p>}
//         </div>

//         <DialogFooter>
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => onOpenChange(false)}
//             disabled={loading}
//           >
//             Cancel
//           </Button>

//           <Button
//             type="button"
//             onClick={handleImport}
//             disabled={loading || !categoryId || !subjectId}
//           >
//             {loading
//               ? "Importing..."
//               : `Import ${questions.questions.length} ${
//                   questions.questions.length === 1 ? "Question" : "Questions"
//                 }`}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import * as React from "react";
import { Upload } from "lucide-react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface ImportQuestionsDialogProps {
  questionCount: number;
}

export function ImportQuestionsDialog({
  questionCount,
}: ImportQuestionsDialogProps) {
  const [open, setOpen] = React.useState(false);

  const [categoryId, setCategoryId] = React.useState("");
  const [subjectId, setSubjectId] = React.useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // PART 1 ONLY:
    // We are not submitting to the server yet.
    //
    // Server-side import will be added in the next part.

    console.log({
      categoryId,
      subjectId,
      questionCount,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" size="lg" className="w-full">
          <Upload />
          Upload {questionCount}{" "}
          {questionCount === 1 ? "Question" : "Questions"}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Import Questions</DialogTitle>

            <DialogDescription>
              Choose the category and subject where these{" "}
              {questionCount === 1 ? "question will" : "questions will"} be
              added to your question bank.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-6">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>

              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>

                <SelectContent>
                  {/* Temporary UI data.
                      Database data comes in the next part. */}

                  <SelectItem value="sample-category-1">
                    Agriculturists Licensure Examination
                  </SelectItem>

                  <SelectItem value="sample-category-2">
                    Civil Service Examination
                  </SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                Select an existing category.
              </p>
            </div>

            {/* Subject */}
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>

              <Select
                value={subjectId}
                onValueChange={setSubjectId}
                disabled={!categoryId}
              >
                <SelectTrigger id="subject" className="w-full">
                  <SelectValue
                    placeholder={
                      categoryId
                        ? "Select a subject"
                        : "Select a category first"
                    }
                  />
                </SelectTrigger>

                <SelectContent>
                  {/* Temporary UI data.
                      Database data comes in the next part. */}

                  <SelectItem value="sample-subject-1">Crop Science</SelectItem>

                  <SelectItem value="sample-subject-2">
                    Animal Science
                  </SelectItem>

                  <SelectItem value="sample-subject-3">
                    Agricultural Economics
                  </SelectItem>
                </SelectContent>
              </Select>

              <p className="text-xs text-muted-foreground">
                The subject will belong to the selected category.
              </p>
            </div>

            <Separator />

            {/* Import summary */}
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  Questions to import
                </span>

                <span className="text-sm font-semibold">{questionCount}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!categoryId || !subjectId}>
              <Upload />
              Confirm Import
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
