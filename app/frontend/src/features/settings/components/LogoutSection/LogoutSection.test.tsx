/** @vitest-environment jsdom */
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import LogoutSection from './index.tsx'

const mutate = vi.fn()

vi.mock('@/api/routes/auth', () => {
  return {
    useLogoutMutation: () => ({ mutate, isPending: false }),
  }
})

const navigate = vi.fn()

vi.mock('@tanstack/react-router', () => {
  return {
    useNavigate: () => navigate,
  }
})

vi.mock('../ConfirmDialog', () => {
  return {
    default: ({ isOpen, onConfirm, onCancel }: any) => (
      <div>
        {isOpen ? (
          <div>
            <span>確認</span>
            <button onClick={onConfirm}>ログアウトする</button>
            <button onClick={onCancel}>キャンセル</button>
          </div>
        ) : null}
      </div>
    ),
  }
})

describe('LogoutSection', () => {
  it('opens dialog and triggers logout', () => {
    render(<LogoutSection />)

    fireEvent.click(screen.getByRole('button', { name: 'ログアウト' }))
    expect(screen.getByText('確認')).toBeTruthy()

    fireEvent.click(screen.getByText('ログアウトする'))
    expect(mutate).toHaveBeenCalled()
  })
})
