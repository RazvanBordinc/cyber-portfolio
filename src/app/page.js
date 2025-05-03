import ScreenContainer from "@/components/screen/ScreenContainer";
import { fetchAboutAsync } from "@/lib/data/fetchAboutAsync";

export default async function Page() {
  const folderData = await fetchAboutAsync();

  return <ScreenContainer folderData={folderData} />;
}
