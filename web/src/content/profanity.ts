/**
 * Battle Rap's profanity bonus: a typed bar that cusses gets a modest boost to its quality
 * (CYPHER.profanityBonus) and the PARENTAL ADVISORY! callout. Swear words only, never slurs.
 * Matched against the lowercased bar, so common censored spellings (f*ck, sh!t) count too.
 */
export const PROFANITY: readonly RegExp[] = [
  /f[u*@]+c?k/, // fuck, fucking, motherfucker, f*ck
  /sh[i1!*]+t/, // shit, bullshit, sh*t
  /b[i1!*]+tch/, // bitch
  /\bass(es|hole|holes|hat|wipe)?\b/,
  /(dumb|jack|bad|smart|kick|fat|lazy|half|broke)ass\b/,
  /\bdamn|dammit|goddamn/,
  /\bhell\b/,
  /\bdick(s|head|heads)?\b/,
  /\bcock(s|sucker|suckers)?\b/,
  /\bpuss(y|ies)\b/,
  /\bbastards?\b/,
  /\bpiss(ed|es|ing)?\b/,
  /\bcrap(py|s)?\b/,
  /\bpricks?\b/,
  /\btwats?\b/,
  /\bwank(er|ers|ing)?\b/,
  /\bbollocks\b/,
  /\bdouche(bag|bags)?\b/,
]
