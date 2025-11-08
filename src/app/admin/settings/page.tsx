"use client";

import Link from "next/link";
import {
  User,
  Mail,
  Lock,
  FileText,
  Scale,
  LogOut,
  Trash2,
  Headphones,
  ChevronRight,
  Info,
  Sun,
  Moon,
} from "lucide-react";
import {  useState } from "react";
import { useUserStore } from "@/store/useUserStore";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { AlertTriangle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import OverlayLoader from "@/components/loaders/OverlayLoader";
import { useRouter } from "next/navigation";
import { useClientStore } from "@/store/useClientStore";

const sections = [
  {
    title: "Account",
    items: [
      { icon: User, label: "Edit Profile", href: "/admin/profile/edit-profile" },
      { icon: Mail, label: "Change Email", href: "/admin/change-email" },
    ],
  },
  {
    title: "Security",
    items: [
      {
        icon: Lock,
        label: "Change Password",
        href: "/admin/change-password",
      },
      // { icon: ShieldCheck, label: "Two-Factor Authentication", href: "/2fa" },
    ],
  },
  {
    title: "Support",
    items: [
      { icon: Headphones, label: "Contact / Support", href: "/contact" },
    ],
  },
];

const legal = [
  { icon: Info, label: "About", href: "/about" },
  { icon: FileText, label: "Terms of Service", href: "/terms" },
  { icon: Scale, label: "Privacy Policy", href: "/privacy-policy" },
];

export default function SettingsPage() {

  return (
    <div className="px-3 pb-4 space-y-6">     
      {/* Settings Sections */}
      {sections.map((section) => (
        <section key={section.title}>
          <h3 className="text-base font-semibold mb-3">{section.title}</h3>
          <div className="grid gap-2">
            {section.items.map(({ icon: Icon, label, href }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center justify-between text-sm p-4 border rounded-xl  "
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Divider */}
      <hr className="my-8" />

      {/* Account Actions */}
      <section className="space-y-2">
        <DarkMode />
        <Logout />
        <DeleteAccount />
      </section>

      {/* Divider */}
      <hr className="my-8" />

      {/* Legal Sections */}
      <section>
        <h3 className="text-base font-semibold mb-3">Legal</h3>
        <div className="grid gap-2">
          {legal.map((l, idx) => {
            const Icon = l.icon;
            return (
              <Link
                key={idx}
                href={l.href}
                className="flex text-sm items-center justify-between p-4 border rounded-xl  "
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-500" />
                  <span className="font-medium">{l.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function DarkMode() {
  const {dark, setDark} = useClientStore();


  const handDarkMode = () => { 
    localStorage.setItem("theme", JSON.stringify({ dark: !dark }));
    setDark(!dark)
  };
  

  <button className="w-full text-sm flex items-center justify-between p-4 border rounded-xl  ">
    <div className="flex items-center gap-3">
      <Headphones className="w-5 h-5 text-gray-500" />
      <span className="font-medium">Contact / Support</span>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-400" />
  </button>;

  return (
    <button    
      onClick={handDarkMode}
      className="w-full flex items-center justify-between p-4 border rounded-xl  "
    >
      <div className="flex items-center gap-3">
        {dark ? (
          <Sun className="h-5 w-5 text-yellow-400" />
        ) : (
          <Moon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
        )}
        <span className="font-medium">Appearance</span>
      </div>
    </button>
  );
}

function Logout() {
  const { logout } = useUserStore();
  const [loading, setLoading] = useState(false);
  const router =useRouter();

  async function handleLogOut() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (data) {
        logout();
        router.push("/auth/login")
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  }

  return <div className="w-full">
 <button
      className="w-full text-sm flex items-center justify-between p-4 border rounded-xl  "
      onClick={handleLogOut}
    >
      <div className="flex items-center gap-3">
        <LogOut className="w-5 h-5 text-gray-500" />
        <span className="font-medium">Logout</span>
      </div>
    </button>
    <OverlayLoader loading={loading} />

  </div>;
}

function DeleteAccount() {
  const { logout, user } = useUserStore();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogOut() {
    try {
      const res = await fetch("/api/auth/logout");
      const data = await res.json();
      if (data) {
        logout();
        router.push("/auth/login")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const payload = { password, email: user.email };

      const res = await fetch("/api/agent/account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json() as { message: string, success: boolean };

      if (!data.success) {
        setError(data.message);
      } else {
        await handleLogOut();
        logout();
      }


    } catch (error) {
      console.error(error);
      setError("Try again later.")
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="w-full text-sm flex items-center justify-between p-4 border rounded-xl "
        >
          <div className="flex items-center gap-3 text-red-600">
            <Trash2 className="w-5 h-5" />
            <span className="font-medium">Delete Account</span>
          </div>
        </button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-lg font-semibold">
              Delete Account
            </AlertDialogTitle>
          </div>

          <AlertDialogDescription className="text-gray-600 text-sm">
            This action is <strong>permanent</strong>. All your data, listings,
            and account information will be permanently deleted. Please enter
            your password to confirm this action.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Password Input */}
        <div className="mt-4">
          <label
            htmlFor="password"
            className="text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2"
          />
          <div className="min-h-10">
            {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
          </div>
        </div>

        {/* Footer */}
        <AlertDialogFooter className="mt-6">
          {!loading &&
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>}
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-700 text-white hover:bg-red-800 w-full sm:w-auto"
          >
            {loading ? <Spinner /> : "Delete Account"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
