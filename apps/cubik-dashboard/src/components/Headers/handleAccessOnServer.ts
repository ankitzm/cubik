'use server';

import { cookies } from 'next/headers';
import { DEFAULT_COOKIE_OPTIONS } from '@/constants/cookies';

export const handleAccessOnServer = (eventId: string) => {
  try {
    const cookiesStore = cookies();
    if (
      cookiesStore.get('access-scope') &&
      cookiesStore.get('access-scope')?.value === eventId
    ) {
      return true;
    }
    if (cookiesStore.get('access-scope')) {
      cookiesStore.delete('access-scope');
    }
    cookiesStore.set('access-scope', eventId, DEFAULT_COOKIE_OPTIONS);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const handleThemeOnServer = (eventId: string) => {
  try {
    const cookiesStore = cookies();
    cookiesStore.set('theme', eventId, {
      expires: new Date(Date.now() + 3600000),
      secure: true,
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
