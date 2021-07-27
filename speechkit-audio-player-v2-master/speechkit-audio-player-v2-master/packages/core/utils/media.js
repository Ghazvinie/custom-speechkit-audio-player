export const canPlayType = mimeType => Boolean(
  (new Audio()).canPlayType(mimeType),
)
