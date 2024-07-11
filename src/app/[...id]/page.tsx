import { redirect } from "next/navigation";
import { getUrlById } from "~/actions/shortener";

export default async function Redirect({ params }: { params: { id: string } }) {
  const redirectURL = await getUrlById(params.id);
  if (redirectURL === null) {
    redirect("/");
  }

  console.log(redirectURL);

  redirect(redirectURL.redirectURL);

  return null;
}
