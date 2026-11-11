import type { Metadata } from "next";
import { listCourses } from "@/lib/db";
import { CourseCatalog } from "@/components/course-catalog";

export const metadata: Metadata = {
  title: "Курсы",
  description:
    "Каталог курсов платформы: ИИ, стартапы, данные, no-code, web-разработка и кибербезопасность.",
};

export default function CoursesPage() {
  const courses = listCourses();
  return (
    <div className="bg-grid">
      <CourseCatalog courses={courses} />
    </div>
  );
}
