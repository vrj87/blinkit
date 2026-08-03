import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { DemoUserClient } from "@/components/DemoUserClient";
import { getDemoProfile } from "@/lib/demo-users";

export const dynamic = "force-dynamic";

export default async function DemoUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: { orderBy: { createdAt: "desc" }, take: 12 },
      nudges: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  if (!user) notFound();

  const profile = getDemoProfile(user.id);

  return (
    <DemoUserClient
      user={{
        ...user,
        personaLabel: profile?.personaLabel,
        addressTitle: profile?.addressTitle,
        addressSub: profile?.addressSub,
        orders: user.orders.map((o) => ({
          ...o,
          createdAt: o.createdAt.toISOString(),
        })),
      }}
    />
  );
}
