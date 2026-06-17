import CreateEventForm from "@/components/dashboard/create-event-form";
import { getActiveRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CreateEventPage() {
  const role = await getActiveRole();
  if (role !== "club") {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <CreateEventForm />
    </div>
  );
}