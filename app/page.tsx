// import PlayButton from "@/components/root-components/play-button";
// import StandingOverview from "@/components/root-components/standing-overview";
// import AnimatedLogo from "@/components/ui/animated-logo";
// import { AuroraText } from "@/components/ui/aurora-text";
// import { Card } from "@/components/ui/card";

// export default function Home() {
//   return (
//     <>
//       <main className="min-h-svh flex flex-col items-center pt-0 sm:pt-22 gap-2 pb-20">
//         <Card className="w-full max-w-4xl sm:hidden flex justify-between rounded-t-none gap-1 pb-5 pt-1">
//           <div className="w-full flex-between flex-row-reverse px-2 h-18">
//             <AnimatedLogo />
//             <div>
//               <h3 className="text-2xl font-bold  mt-2">
//                 Good <AuroraText className="">Day! </AuroraText> 🐥
//               </h3>
//             </div>
//           </div>
//           <div className="p-2 pt-0">
//             <PlayButton />
//           </div>
//         </Card>
//         <div className="max-w-4xl w-full flex flex-col pt-1 gap-4 px-2">
//           <StandingOverview />
//           <Card className="bg-card/40 h-screen">
//             {/* <QuestionnaireSkipExample /> */}
//           </Card>
//         </div>
//       </main>
//     </>
//   );
// }
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/dashboard");
  }

  redirect("/get-started");
}
