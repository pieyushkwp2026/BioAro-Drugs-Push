import { redirect } from "next/navigation";
import { BIOARO_LABS_URL } from "@/data/navigation";

export default function LabsPage() {
  redirect(BIOARO_LABS_URL);
}
