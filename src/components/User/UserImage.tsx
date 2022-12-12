import React from 'react'
import Image from 'next/image'

export const UserImage: React.FC<{url: string | null | undefined}> = ({url}) => {
  return (
    url ? <Image src={url} width={50} height={50} alt="user picture" /> : <div></div>
  )
}
