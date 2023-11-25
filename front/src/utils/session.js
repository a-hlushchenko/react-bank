export const SESSION_KEY = "sessionAuth";

export const saveSession = (session) => {
  try {
    window.session = session;

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    window.session = null;
  }
};

export const loadSession = () => {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY));

    if (session) {
      window.session = session;
      return session;
    } else {
      window.session = null;
      return null;
    }
  } catch (e) {
    window.session = null;
    return null;
  }
};

export const getTokenSession = () => {
  try {
    const session = getSession();

    return session ? session.token : null;
  } catch (e) {
    return null;
  }
};

export const getSession = () => {
  try {
    const session =
      JSON.parse(localStorage.getItem(SESSION_KEY)) || window.session;

    return session || null;
  } catch (e) {
    return null;
  }
};
