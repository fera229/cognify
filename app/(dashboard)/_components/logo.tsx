import Image from 'next/image';
import React from 'react';

export const Logo = () => {
  return <Image height={130} width={130} src="/logo.svg" alt="logo" />;
};
