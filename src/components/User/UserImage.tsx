import React from 'react'
import Image from 'next/image'
import { FaUserSecret } from "react-icons/fa"

interface UserImageProps {
  url: string | null | undefined;
  width?: number;
  height?: number;
  username?: string;
}

export const UserImage: React.FC<UserImageProps> = ({url, width=50, height=50, username="user"}) => {
  return (
    url ? <Image src={url} width={width} height={height} alt={`${username}'s avatar`} /> : <FaUserSecret size={32} />
  )
}
