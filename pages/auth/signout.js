import { signOut } from 'next-auth/react'

export default function SignOut() {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
      <button
        className='w-full max-w-[200px] mx-auto bg-red-500 text-white px-3 py-1 rounded hover:bg-red-400'
        onClick={() => signOut({ callbackUrl: '/' })}
      >
        Sign out
      </button>
    </div>
  )
}
