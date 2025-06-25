import Layout from "@/components/Layout";
export default function Forbidden() {
  return (
    <Layout>
        <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold text-red-500">403 | Forbidden</h1>
        </div>
    </Layout>
  );
}
