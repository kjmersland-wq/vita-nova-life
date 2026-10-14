<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules

- All clinical logic lives in `src/lib/engine/` (`markers.ts` thresholds, `rules.ts` scoring/actions, `program.ts` weeks) — kept deterministic and separate so thresholds can be edited without touching UI.
- App state is a single localStorage-backed store in `src/lib/store.ts` (`useSyncExternalStore`) — no backend in v1, health data stays on-device.
- Language lives in the URL: all pages sit under `src/routes/{-$lang}/` (optional /no, /pl prefix); link with `LangLink`/`useLangNavigate` from `src/lib/i18n.tsx`, texts as per-file `{en,no,pl}` dictionaries, engine functions take a `lang` param — keeps URLs shareable and translations next to their UI.
- Social metadata and public-only share URLs live in `src/lib/social.ts`; the shared footer renders platform links via `SocialShare` — keeps translations consistent and prevents sharing on-device health data.
