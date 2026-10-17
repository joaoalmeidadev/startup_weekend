import type { ReactNode } from 'react'
import { vi, type Mock } from 'vitest'

// Shared state for vi.mock('@inertiajs/react', () => inertiaMock) in page tests
export const page: { url: string; props: Record<string, unknown> } = { url: '/', props: {} }
export const router: { visit: Mock; delete: Mock; reload: Mock } = {
  visit: vi.fn(),
  delete: vi.fn(),
  reload: vi.fn(),
}

export const inertiaMock: Record<string, unknown> = {
  Head: () => null,
  Link: ({ href, children, ...rest }: { href: string; children: ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
  router,
  usePage: () => page,
}
