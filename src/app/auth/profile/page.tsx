import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen items-start justify-center p-2">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is your profile page.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Hello, User!</p>
        </CardContent>
      </Card>
    </div>
  );
}
