import type { FlashData } from '@/types'

type FlashMessagesProps = {
  flash: FlashData
}

export function FlashMessages({ flash }: FlashMessagesProps) {
  return (
    <>
      {flash.notice && (
        <p role="status" className="rounded-md bg-green-50 p-3 text-sm text-green-800">
          {flash.notice}
        </p>
      )}
      {flash.alert && (
        <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">
          {flash.alert}
        </p>
      )}
    </>
  )
}
