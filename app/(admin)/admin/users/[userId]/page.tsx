import { useRouter } from "next/navigation";

interface UserDetailProps {
  params: {
    userId: string;
  };
}

export default function AdminUserDetail({ params }: UserDetailProps) {
  const { userId } = params;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">User Detail: {userId}</h1>
      {/* More detailed user information will go here */}
      <p>This is where detailed information about the user will be displayed.</p>
    </div>
  );
}