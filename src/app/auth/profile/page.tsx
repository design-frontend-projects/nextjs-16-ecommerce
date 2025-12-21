import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export default function ProfilePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
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
