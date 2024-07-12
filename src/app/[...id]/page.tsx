import { redirect } from "next/navigation";
import { getUrlById } from "../../../actions/shortener";

export default async function Redirect({ params }: { params: { id: string } }) {
  const redirectURL = await getUrlById(params.id);

  if (redirectURL === null) {
    redirect("/");
  }

  redirect(redirectURL);

  return null;
}
