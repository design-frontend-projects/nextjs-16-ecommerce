export interface IAppProps {}

export default async function ProductDetailsPage({ params }: any) {
  const slug = await params;
  const [id, username] = slug.slug;

  return (
    <div>
      <h1>product details page</h1>
      <p>
        param is: {id} and username: {username}
      </p>
    </div>
  );
}
