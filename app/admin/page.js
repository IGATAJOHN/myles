import AdminLoginForm from "@/components/AdminLoginForm";
import { isAdminAuthenticated } from "@/lib/admin";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin Login | Myles Luxe"
};

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const authenticated = await isAdminAuthenticated();

  if (authenticated) {
    redirect("/admin/orders");
  }

  return (
    <main>
      <section className="page-hero">
        <div className="container page-panel admin-login-shell">
          <div className="eyebrow">Admin Access</div>
          <h1>Sign in to manage orders</h1>
          <p>Use the admin password configured in your environment to view live Myles Luxe orders.</p>
          <AdminLoginForm />
        </div>
      </section>
    </main>
  );
}
