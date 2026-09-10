import Forbidden from "@/app/forbidden";

export const metadata = {
  title: "403 Access Denied - ATS Victim",
  description: "You do not have permission to access this resource.",
};

export default function ForbiddenPage() {
  return <Forbidden />;
}
