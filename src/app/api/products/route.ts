export async function GET(request: Request) {
    // For example, fetch data from your DB here
    const products = [
        { id: 1, name: 'sony' },
        { id: 2, name: 'panasonic' }
    ];
    return new Response(JSON.stringify(products), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}