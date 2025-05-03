import { Suspense } from "react";
import ScreenContainer from "@/components/screen/ScreenContainer";
import { fetchAboutAsync } from "@/lib/data/fetchAboutAsync";
import AnimationWrapper from "@/components/animations/AnimationWrapper";

export default async function Page() {
  const folderData = await fetchAboutAsync();

  return (
    <Suspense fallback={null}>
      <AnimationWrapper>
        <ScreenContainer folderData={folderData} />
      </AnimationWrapper>
    </Suspense>
  );
}
