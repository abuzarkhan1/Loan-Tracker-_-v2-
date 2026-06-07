import React, { useState } from "react";
import { User as UserIcon, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import { useAuth } from "../../hooks/useAuth";
import { authApi } from "../../api/auth.api";
import { ROUTES } from "../../config/routes.config";

export const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Name and Email are mandatory fields.");
      return;
    }

    setIsUpdating(true);
    setError(null);
    setSuccess(false);

    try {
      const updatedUser = await authApi.updateMe({ name: name.trim(), email: email.trim() });
      
      // Update globally inside store session
      if (updateProfile) {
        updateProfile(updatedUser);
      }
      
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to update profile details.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header back nav */}
      <Link to={ROUTES.SETTINGS} className="flex items-center gap-1 text-xs font-medium text-appPrimary hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to Settings Hub
      </Link>

      <div>
        <h1 className="flex items-center gap-2 text-xl font-semibold text-appText">
          <UserIcon className="h-5 w-5 text-appPrimary" />
          Profile Details
        </h1>
        <p className="text-sm text-appMuted">
          Modify your full name or primary contact email address.
        </p>
      </div>

      <Card variant="bordered">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">
              Full Name
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Abuzar Khan"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">
              Email Address
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. abuzar@domain.com"
              required
            />
          </div>

          {success && (
            <p className="flex animate-fadeIn items-center gap-1 rounded-lg border border-appSuccess/25 bg-appSuccess/10 p-2.5 text-xs font-semibold text-appSuccess">
              <CheckCircle className="h-4 w-4 shrink-0 text-appSuccess" />
              Profile updated successfully!
            </p>
          )}

          {error && (
            <p className="flex items-center gap-1 rounded-lg border border-appDanger/20 bg-appDanger/10 p-2.5 text-xs font-semibold text-appDanger">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Link to={ROUTES.SETTINGS}>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              variant="primary"
              isLoading={isUpdating}
              disabled={name === user?.name && email === user?.email}
              className="px-6 font-medium"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile;
