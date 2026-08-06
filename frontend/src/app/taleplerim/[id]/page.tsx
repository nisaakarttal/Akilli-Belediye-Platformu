import { redirect } from "next/navigation";

export default async function EskiTalepDetayYonlendirmesi({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/panel/taleplerim/${id}`);
}
