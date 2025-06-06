export const getViFriendlyErrorMessage = (status?: number): string => {
  switch (status) {
    case 400:
      return "Hmm, something about that didn’t come through clearly. Let’s try that again together.";
    case 401:
      return "You’re not signed in right now. Let’s log in so we can pick up where you left off.";
    case 403:
      return "This space isn’t open to you just now. Let’s take a different path.";
    case 404:
      return "We looked, but we couldn’t find what you were looking for. Maybe it’s moved or no longer exists.";
    case 405:
      return "That’s not something we can do here. Let’s try another approach.";
    case 408:
      return "This is taking longer than usual. Let’s pause and try again in a moment.";
    case 409:
      return "There’s already something here like that. Want to try a new version?";
    case 410:
      return "This content isn’t here anymore. Let’s look ahead instead.";
    case 418:
      return "This wasn’t meant to happen—but now we’re both curious. ☕";
    case 429:
      return "You’ve done a lot just now. Let’s take a short breather before trying again.";
    case 500:
      return "Something went wrong on our end. We’re already working on it! Thanks for your patience.";
    case 501:
      return "This part of the journey isn’t ready just yet. But it’s on our path.";
    case 502:
      return "We’re having a hard time connecting right now. Let’s try again in a bit.";
    case 503:
      return "We’re making some updates behind the scenes. Things will be back soon.";
    case 504:
      return "That took longer than expected. Let’s give it another try in a moment.";
    case 507:
      return "Our space is a bit full right now. We’ll tidy up and try again shortly.";
    default:
      return "Something unexpected happened. Let’s try that again gently.";
  }
};
