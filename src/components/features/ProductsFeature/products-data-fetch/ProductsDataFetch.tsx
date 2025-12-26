import supabaseClient from '@/config/supabaseClientInit';

export default async function ProductsDataFetch() {
  const products = await supabaseClient.from('products').select('*');
  console.log(products);

  return (
    <div>
      <h1>Products Data Fetch</h1>
    </div>
  );
}
