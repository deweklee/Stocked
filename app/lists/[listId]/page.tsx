import ListPage from "./ListPage";

export default async function Page({ params }: { params: { listId: string } }) {
  const { listId } = await params;
  return <ListPage listId={listId} />;
}
