function nextUrl(raw) {
  if (typeof raw !== "string" || !raw.startsWith("/")) {
    return "/";
  }

  try {
    var baseUrl = new URL("https://local.invalid/");
    var targetUrl = new URL(raw, baseUrl);

    if (targetUrl.origin !== baseUrl.origin) {
      return "/";
    }

    return targetUrl.pathname + targetUrl.search + targetUrl.hash;
  } catch (err) {
    return "/";
  }
}

module.exports = { nextUrl };
