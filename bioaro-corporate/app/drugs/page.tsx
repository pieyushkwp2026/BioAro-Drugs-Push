import { redirect } from "next/navigation";
import { BIOARO_DRUGS_URL } from "@/data/navigation";

export default function DrugsPage() {
  redirect(BIOARO_DRUGS_URL);
}
