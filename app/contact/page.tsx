import { ContactPage, contactMetadata } from '@/components/site/contact-page'

export const metadata = contactMetadata('ja')

export default function Page() {
  return <ContactPage lang="ja" />
}
