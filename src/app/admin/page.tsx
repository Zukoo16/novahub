import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/session";
import { listCourses, listHackathons, listEvents } from "@/lib/db";
import { AdminPanel } from "@/components/admin/admin-panel";

export const metadata: Metadata = {
  title: "Админка",
  description: "Управление курсами, хакатонами и мероприятиями",
};

export default async function AdminPage() {
  const user = await getSessionUser();
  if (!user) redirect("/");
  if (!user.is_admin) redirect("/about");

  return (
    <AdminPanel
      courses={listCourses()}
      hackathons={listHackathons()}
      events={listEvents()}
    />
  );
}
