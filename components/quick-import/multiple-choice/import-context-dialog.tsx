// "use client";

// import * as React from "react";
// import { Check, ChevronsUpDown, Loader2, Plus, Upload } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
// } from "@/components/ui/command";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";

// import { cn } from "@/lib/utils";

// import { useCategories } from "@/hooks/use-categories";
// import { useSubjects } from "@/hooks/use-subjects";
// import { useCreateImportContext } from "@/hooks/use-create-import-context";

// import type { MultipleChoiceImport } from "@/src/lib/validations/question-import";

// interface ImportContextDialogProps {
//   questions: MultipleChoiceImport["questions"];

//   onSuccess: (result: {
//     categoryId: string;
//     subjectId: string;
//     categorySubjectId: string;
//   }) => void;
// }

// export function ImportContextDialog({
//   questions,
//   onSuccess,
// }: ImportContextDialogProps) {
//   const [open, setOpen] = React.useState(false);

//   const questionCount = questions.length;

//   // ============================================================
//   // CATEGORY STATE
//   // ============================================================

//   const [categoryPopoverOpen, setCategoryPopoverOpen] = React.useState(false);

//   const [categoryId, setCategoryId] = React.useState("");

//   const [newCategoryMode, setNewCategoryMode] = React.useState(false);

//   const [categoryName, setCategoryName] = React.useState("");

//   // ============================================================
//   // SUBJECT STATE
//   // ============================================================

//   const [subjectPopoverOpen, setSubjectPopoverOpen] = React.useState(false);

//   const [subjectId, setSubjectId] = React.useState("");

//   const [newSubjectMode, setNewSubjectMode] = React.useState(false);

//   const [subjectName, setSubjectName] = React.useState("");

//   // ============================================================
//   // QUERIES
//   // ============================================================

//   const {
//     data: categories = [],
//     isLoading: categoriesLoading,
//     isError: categoriesError,
//   } = useCategories();

//   const {
//     data: subjects = [],
//     isLoading: subjectsLoading,
//     isFetching: subjectsFetching,
//     isError: subjectsError,
//   } = useSubjects(categoryId || undefined);

//   // ============================================================
//   // MUTATION
//   // ============================================================

//   const createImportContext = useCreateImportContext();

//   // ============================================================
//   // SELECTED VALUES
//   // ============================================================

//   const selectedCategory = categories.find(
//     (category) => category.id === categoryId,
//   );

//   const selectedSubject = subjects.find((subject) => subject.id === subjectId);

//   // ============================================================
//   // VALIDATION
//   // ============================================================

//   const trimmedCategoryName = categoryName.trim();
//   const trimmedSubjectName = subjectName.trim();

//   const hasCategory = Boolean(categoryId) || trimmedCategoryName.length > 0;

//   const hasSubject = Boolean(subjectId) || trimmedSubjectName.length > 0;

//   const canSubmit =
//     hasCategory &&
//     hasSubject &&
//     questionCount > 0 &&
//     !createImportContext.isPending;

//   // ============================================================
//   // RESET
//   // ============================================================

//   function resetForm() {
//     setCategoryPopoverOpen(false);
//     setSubjectPopoverOpen(false);

//     setCategoryId("");
//     setSubjectId("");

//     setNewCategoryMode(false);
//     setNewSubjectMode(false);

//     setCategoryName("");
//     setSubjectName("");

//     createImportContext.reset();
//   }

//   // ============================================================
//   // CATEGORY
//   // ============================================================

//   function selectExistingCategory(id: string) {
//     setCategoryId(id);

//     // Changing category invalidates the current subject selection.
//     setSubjectId("");
//     setSubjectName("");
//     setNewSubjectMode(false);

//     setNewCategoryMode(false);
//     setCategoryName("");

//     setCategoryPopoverOpen(false);
//   }

//   function selectNewCategory() {
//     setCategoryId("");
//     setCategoryName("");

//     // Existing subjects cannot be selected until the new category
//     // exists.
//     setSubjectId("");
//     setSubjectName("");
//     setNewSubjectMode(false);

//     setNewCategoryMode(true);

//     setCategoryPopoverOpen(false);
//   }

//   // ============================================================
//   // SUBJECT
//   // ============================================================

//   function selectExistingSubject(id: string) {
//     setSubjectId(id);

//     setSubjectName("");
//     setNewSubjectMode(false);

//     setSubjectPopoverOpen(false);
//   }

//   function selectNewSubject() {
//     setSubjectId("");
//     setSubjectName("");

//     setNewSubjectMode(true);

//     setSubjectPopoverOpen(false);
//   }

//   // ============================================================
//   // SUBMIT
//   // ============================================================

//   // components/quick-import/multiple-choice/import-context-dialog.tsx

//   // In the handleSubmit function, modify the mutate call:

//   // components/questions/import/import-context-dialog.tsx

//   // Update the handleSubmit to use the new import endpoint

//   function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault();

//     if (!canSubmit) {
//       return;
//     }

//     createImportContext.mutate(
//       {
//         categoryId: categoryId || undefined,
//         categoryName:
//           trimmedCategoryName.length > 0 ? trimmedCategoryName : undefined,
//         subjectId: subjectId || undefined,
//         subjectName:
//           trimmedSubjectName.length > 0 ? trimmedSubjectName : undefined,
//         questions: questions,
//       },
//       {
//         onSuccess: (result) => {
//           // The result now contains import stats
//           onSuccess({
//             categoryId: result.category.id,
//             subjectId: result.subject.id,
//             categorySubjectId: result.categorySubject.id,
//             importResult: {
//               total: result.total,
//               imported: result.imported,
//               failed: result.failed,
//               status: result.status,
//               importBatchId: result.importBatchId,
//               failedItems: result.failedItems,
//             },
//           });

//           setOpen(false);
//           resetForm();
//         },
//       },
//     );
//   }

//   // ============================================================
//   // RENDER
//   // ============================================================

//   return (
//     <Dialog
//       open={open}
//       onOpenChange={(value) => {
//         if (createImportContext.isPending) {
//           return;
//         }

//         setOpen(value);

//         if (!value) {
//           resetForm();
//         }
//       }}
//     >
//       <DialogTrigger asChild>
//         <Button
//           type="button"
//           size="lg"
//           className="w-full"
//           disabled={questionCount === 0}
//         >
//           <Upload />
//           Upload {questionCount}{" "}
//           {questionCount === 1 ? "Question" : "Questions"}
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-lg">
//         <form onSubmit={handleSubmit}>
//           <DialogHeader>
//             <DialogTitle>Import Questions</DialogTitle>

//             <DialogDescription>
//               Choose where these{" "}
//               <span className="font-medium text-foreground">
//                 {questionCount} {questionCount === 1 ? "question" : "questions"}
//               </span>{" "}
//               will be added.
//             </DialogDescription>
//           </DialogHeader>

//           <div className="grid gap-6 py-6">
//             {/* ==================================================
//                 CATEGORY
//             ================================================== */}

//             <div className="grid gap-2">
//               <Label htmlFor="category">Category</Label>

//               {newCategoryMode ? (
//                 <div className="flex gap-2">
//                   <Input
//                     id="category"
//                     value={categoryName}
//                     onChange={(event) => setCategoryName(event.target.value)}
//                     placeholder="Enter category name"
//                     autoFocus
//                     disabled={createImportContext.isPending}
//                   />

//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       setNewCategoryMode(false);
//                       setCategoryName("");
//                     }}
//                     disabled={createImportContext.isPending}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               ) : (
//                 <Popover
//                   open={categoryPopoverOpen}
//                   onOpenChange={setCategoryPopoverOpen}
//                 >
//                   <PopoverTrigger asChild>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       role="combobox"
//                       aria-expanded={categoryPopoverOpen}
//                       className="w-full justify-between font-normal"
//                       disabled={createImportContext.isPending}
//                     >
//                       {selectedCategory?.name ?? "Select a category..."}

//                       <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
//                     </Button>
//                   </PopoverTrigger>

//                   <PopoverContent
//                     align="start"
//                     className="w-(--radix-popover-trigger-width) p-0"
//                   >
//                     <Command>
//                       <CommandInput placeholder="Search categories..." />

//                       <CommandList>
//                         <CommandEmpty>No category found.</CommandEmpty>

//                         {categoriesError ? (
//                           <div className="px-3 py-6 text-center text-sm text-destructive">
//                             Failed to load categories.
//                           </div>
//                         ) : categoriesLoading ? (
//                           <div className="flex items-center justify-center py-6">
//                             <Loader2 className="size-4 animate-spin" />
//                           </div>
//                         ) : (
//                           <>
//                             <CommandGroup heading="Existing categories">
//                               {categories.map((category) => (
//                                 <CommandItem
//                                   key={category.id}
//                                   value={category.name}
//                                   onSelect={() =>
//                                     selectExistingCategory(category.id)
//                                   }
//                                 >
//                                   <Check
//                                     className={cn(
//                                       "mr-2 size-4",
//                                       categoryId === category.id
//                                         ? "opacity-100"
//                                         : "opacity-0",
//                                     )}
//                                   />

//                                   {category.name}
//                                 </CommandItem>
//                               ))}
//                             </CommandGroup>

//                             <CommandGroup>
//                               <CommandItem
//                                 value="create-new-category"
//                                 onSelect={selectNewCategory}
//                               >
//                                 <Plus className="mr-2 size-4" />
//                                 Create new category
//                               </CommandItem>
//                             </CommandGroup>
//                           </>
//                         )}
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//               )}

//               <p className="text-xs text-muted-foreground">
//                 Choose an existing category or create a new one.
//               </p>
//             </div>

//             {/* ==================================================
//                 SUBJECT
//             ================================================== */}

//             <div className="grid gap-2">
//               <Label htmlFor="subject">Subject</Label>

//               {newSubjectMode ? (
//                 <div className="flex gap-2">
//                   <Input
//                     id="subject"
//                     value={subjectName}
//                     onChange={(event) => setSubjectName(event.target.value)}
//                     placeholder="Enter subject name"
//                     autoFocus
//                     disabled={createImportContext.isPending}
//                   />

//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => {
//                       setNewSubjectMode(false);
//                       setSubjectName("");
//                     }}
//                     disabled={createImportContext.isPending}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               ) : (
//                 <Popover
//                   open={subjectPopoverOpen}
//                   onOpenChange={setSubjectPopoverOpen}
//                 >
//                   <PopoverTrigger asChild>
//                     <Button
//                       type="button"
//                       variant="outline"
//                       role="combobox"
//                       aria-expanded={subjectPopoverOpen}
//                       disabled={
//                         !categoryId ||
//                         subjectsLoading ||
//                         subjectsFetching ||
//                         createImportContext.isPending
//                       }
//                       className="w-full justify-between font-normal"
//                     >
//                       {!categoryId ? (
//                         "Select a category first..."
//                       ) : subjectsLoading || subjectsFetching ? (
//                         <span className="flex items-center gap-2 text-muted-foreground">
//                           <Loader2 className="size-4 animate-spin" />
//                           Loading subjects...
//                         </span>
//                       ) : (
//                         (selectedSubject?.name ?? "Select a subject...")
//                       )}

//                       <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
//                     </Button>
//                   </PopoverTrigger>

//                   <PopoverContent
//                     align="start"
//                     className="w-(--radix-popover-trigger-width) p-0"
//                   >
//                     <Command>
//                       <CommandInput placeholder="Search subjects..." />

//                       <CommandList>
//                         <CommandEmpty>No subject found.</CommandEmpty>

//                         {subjectsError ? (
//                           <div className="px-3 py-6 text-center text-sm text-destructive">
//                             Failed to load subjects.
//                           </div>
//                         ) : (
//                           <>
//                             <CommandGroup heading="Subjects">
//                               {subjects.map((subject) => (
//                                 <CommandItem
//                                   key={subject.id}
//                                   value={subject.name}
//                                   onSelect={() =>
//                                     selectExistingSubject(subject.id)
//                                   }
//                                 >
//                                   <Check
//                                     className={cn(
//                                       "mr-2 size-4",
//                                       subjectId === subject.id
//                                         ? "opacity-100"
//                                         : "opacity-0",
//                                     )}
//                                   />

//                                   {subject.name}
//                                 </CommandItem>
//                               ))}
//                             </CommandGroup>

//                             <CommandGroup>
//                               <CommandItem
//                                 value="create-new-subject"
//                                 onSelect={selectNewSubject}
//                               >
//                                 <Plus className="mr-2 size-4" />
//                                 Create new subject
//                               </CommandItem>
//                             </CommandGroup>
//                           </>
//                         )}
//                       </CommandList>
//                     </Command>
//                   </PopoverContent>
//                 </Popover>
//               )}

//               <p className="text-xs text-muted-foreground">
//                 Subjects are shown for the selected category.
//               </p>
//             </div>

//             {/* ==================================================
//                 SUMMARY
//             ================================================== */}

//             <div className="rounded-lg border bg-muted/30 p-3">
//               <div className="space-y-1 text-xs">
//                 <p className="font-medium text-foreground">
//                   Import destination
//                 </p>

//                 <p className="text-muted-foreground">
//                   Category:{" "}
//                   <span className="text-foreground">
//                     {selectedCategory?.name ||
//                       (trimmedCategoryName
//                         ? trimmedCategoryName
//                         : "Not selected")}
//                   </span>
//                 </p>

//                 <p className="text-muted-foreground">
//                   Subject:{" "}
//                   <span className="text-foreground">
//                     {selectedSubject?.name ||
//                       (trimmedSubjectName
//                         ? trimmedSubjectName
//                         : "Not selected")}
//                   </span>
//                 </p>

//                 <p className="pt-1 text-muted-foreground">
//                   {questionCount}{" "}
//                   {questionCount === 1 ? "question" : "questions"} will be
//                   imported.
//                 </p>
//               </div>
//             </div>

//             {/* ==================================================
//                 ERROR
//             ================================================== */}

//             {createImportContext.isError && (
//               <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
//                 <p className="text-xs text-destructive">
//                   {createImportContext.error.message}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* ====================================================
//               FOOTER
//           ==================================================== */}

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => setOpen(false)}
//               disabled={createImportContext.isPending}
//             >
//               Cancel
//             </Button>

//             <Button type="submit" disabled={!canSubmit}>
//               {createImportContext.isPending ? (
//                 <>
//                   <Loader2 className="size-4 animate-spin" />
//                   Preparing...
//                 </>
//               ) : (
//                 <>
//                   <Upload />
//                   Continue Import
//                 </>
//               )}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }
// components/quick-import/multiple-choice/import-context-dialog.tsx

"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Loader2, Plus, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { cn } from "@/lib/utils";

import { useCategories } from "@/hooks/use-categories";
import { useSubjects } from "@/hooks/use-subjects";
import { useCreateImportContext } from "@/hooks/use-create-import-context";

import type { MultipleChoiceImport } from "@/src/lib/validations/question-import";

// Define the result type
interface ImportResult {
  categoryId: string;
  subjectId: string;
  categorySubjectId: string;
  importStats: {
    total: number;
    imported: number;
    failed: number;
    status: string;
    importBatchId: string;
    failedItems?: Array<{ row: number; error: string }>;
  };
}

interface ImportContextDialogProps {
  questions: MultipleChoiceImport["questions"];
  onSuccess: (result: ImportResult) => void;
}

export function ImportContextDialog({
  questions,
  onSuccess,
}: ImportContextDialogProps) {
  const [open, setOpen] = React.useState(false);

  const questionCount = questions.length;

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
  // MUTATION
  // ============================================================

  const createImportContext = useCreateImportContext();

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

  const canSubmit =
    hasCategory &&
    hasSubject &&
    questionCount > 0 &&
    !createImportContext.isPending;

  // ============================================================
  // RESET
  // ============================================================

  function resetForm() {
    setCategoryPopoverOpen(false);
    setSubjectPopoverOpen(false);

    setCategoryId("");
    setSubjectId("");

    setNewCategoryMode(false);
    setNewSubjectMode(false);

    setCategoryName("");
    setSubjectName("");

    createImportContext.reset();
  }

  // ============================================================
  // CATEGORY
  // ============================================================

  function selectExistingCategory(id: string) {
    setCategoryId(id);

    // Changing category invalidates the current subject selection.
    setSubjectId("");
    setSubjectName("");
    setNewSubjectMode(false);

    setNewCategoryMode(false);
    setCategoryName("");

    setCategoryPopoverOpen(false);
  }

  function selectNewCategory() {
    setCategoryId("");
    setCategoryName("");

    // Existing subjects cannot be selected until the new category
    // exists.
    setSubjectId("");
    setSubjectName("");
    setNewSubjectMode(false);

    setNewCategoryMode(true);

    setCategoryPopoverOpen(false);
  }

  // ============================================================
  // SUBJECT
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

  // ============================================================
  // SUBMIT
  // ============================================================

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    createImportContext.mutate(
      {
        categoryId: categoryId || undefined,
        categoryName:
          trimmedCategoryName.length > 0 ? trimmedCategoryName : undefined,
        subjectId: subjectId || undefined,
        subjectName:
          trimmedSubjectName.length > 0 ? trimmedSubjectName : undefined,
        questions: questions,
      },
      {
        onSuccess: (result) => {
          // The result now contains import stats
          onSuccess({
            categoryId: result.category.id,
            subjectId: result.subject.id,
            categorySubjectId: result.categorySubject.id,
            importStats: {
              total: result.total,
              imported: result.imported,
              failed: result.failed,
              status: result.status,
              importBatchId: result.importBatchId,
              failedItems: result.failedItems,
            },
          });

          setOpen(false);
          resetForm();
        },
      },
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (createImportContext.isPending) {
          return;
        }

        setOpen(value);

        if (!value) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={questionCount === 0}
        >
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
              Choose where these{" "}
              <span className="font-medium text-foreground">
                {questionCount} {questionCount === 1 ? "question" : "questions"}
              </span>{" "}
              will be added.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-6">
            {/* ==================================================
                CATEGORY
            ================================================== */}

            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>

              {newCategoryMode ? (
                <div className="flex gap-2">
                  <Input
                    id="category"
                    value={categoryName}
                    onChange={(event) => setCategoryName(event.target.value)}
                    placeholder="Enter category name"
                    autoFocus
                    disabled={createImportContext.isPending}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNewCategoryMode(false);
                      setCategoryName("");
                    }}
                    disabled={createImportContext.isPending}
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
                      className="w-full justify-between font-normal"
                      disabled={createImportContext.isPending}
                    >
                      {selectedCategory?.name ?? "Select a category..."}

                      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="w-(--radix-popover-trigger-width) p-0"
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
                                  className="capitalize mt-2"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 size-4",
                                      categoryId === category.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />

                                  {category.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>

                            <CommandGroup>
                              <CommandItem
                                value="create-new-category"
                                onSelect={selectNewCategory}
                              >
                                <Plus className="mr-2 size-4" />
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
                Choose an existing category or create a new one.
              </p>
            </div>

            {/* ==================================================
                SUBJECT
            ================================================== */}

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>

              {newSubjectMode ? (
                <div className="flex gap-2">
                  <Input
                    id="subject"
                    value={subjectName}
                    onChange={(event) => setSubjectName(event.target.value)}
                    placeholder="Enter subject name"
                    autoFocus
                    disabled={createImportContext.isPending}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setNewSubjectMode(false);
                      setSubjectName("");
                    }}
                    disabled={createImportContext.isPending}
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
                      disabled={
                        !categoryId ||
                        subjectsLoading ||
                        subjectsFetching ||
                        createImportContext.isPending
                      }
                      className="w-full justify-between font-normal"
                    >
                      {!categoryId ? (
                        "Select a category first..."
                      ) : subjectsLoading || subjectsFetching ? (
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Loader2 className="size-4 animate-spin" />
                          Loading subjects...
                        </span>
                      ) : (
                        (selectedSubject?.name ?? "Select a subject...")
                      )}

                      <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>

                  <PopoverContent
                    align="start"
                    className="w-(--radix-popover-trigger-width) p-0"
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
                            <CommandGroup heading="Subjects">
                              {subjects.map((subject) => (
                                <CommandItem
                                  key={subject.id}
                                  value={subject.name}
                                  onSelect={() =>
                                    selectExistingSubject(subject.id)
                                  }
                                  className="capitalize mt-2"
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 size-4",
                                      subjectId === subject.id
                                        ? "opacity-100"
                                        : "opacity-0",
                                    )}
                                  />

                                  {subject.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>

                            <CommandGroup>
                              <CommandItem
                                value="create-new-subject"
                                onSelect={selectNewSubject}
                              >
                                <Plus className="mr-2 size-4" />
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
                Subjects are shown for the selected category.
              </p>
            </div>

            {/* ==================================================
                SUMMARY
            ================================================== */}

            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="space-y-1 text-xs">
                <p className="font-medium text-foreground">
                  Import destination
                </p>

                <p className="text-muted-foreground">
                  Category:{" "}
                  <span className="text-foreground">
                    {selectedCategory?.name ||
                      (trimmedCategoryName
                        ? trimmedCategoryName
                        : "Not selected")}
                  </span>
                </p>

                <p className="text-muted-foreground">
                  Subject:{" "}
                  <span className="text-foreground">
                    {selectedSubject?.name ||
                      (trimmedSubjectName
                        ? trimmedSubjectName
                        : "Not selected")}
                  </span>
                </p>

                <p className="pt-1 text-muted-foreground">
                  {questionCount}{" "}
                  {questionCount === 1 ? "question" : "questions"} will be
                  imported.
                </p>
              </div>
            </div>

            {/* ==================================================
                ERROR
            ================================================== */}

            {createImportContext.isError && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-xs text-destructive">
                  {createImportContext.error.message}
                </p>
              </div>
            )}
          </div>

          {/* ====================================================
              FOOTER
          ==================================================== */}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={createImportContext.isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={!canSubmit}>
              {createImportContext.isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Preparing...
                </>
              ) : (
                <>
                  <Upload />
                  Continue Import
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
