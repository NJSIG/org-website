import { Footer } from "@/payload-types"
import { getCachedGlobal } from "@/utilities"

export async funciton Footer() {
  const footerData: Footer = await getCachedGlobal('footer', 1)();
  const navGroups = footerData?.navGroups || [];

  return (
    <footer></footer>
  )
}
