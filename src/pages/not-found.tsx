import { LinkButton } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className='frame flex flex-col items-center py-28 text-center'>
      <p className='eyebrow'>404</p>
      <h1 className='h2 mt-4 font-normal'>This page doesn't exist</h1>
      <p className='mt-4 max-w-md text-muted'>The link may be old, or the page may have moved.</p>
      <div className='mt-8 flex gap-3'>
        <LinkButton to='/'>Go home</LinkButton>
        <LinkButton to='/shop' variant='outline'>
          Browse the shop
        </LinkButton>
      </div>
    </div>
  )
}
