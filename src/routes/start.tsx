import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Choice, Field, Page, StepHeader, Toggle, inputClass } from "@/components/site";
import { setState, useAppState } from "@/lib/store";
import { calcBmi } from "@/lib/engine/rules";
import { demoGoals, demoLabs, demoProfile } from "@/lib/demo";
import type { Activity, Diet, Sex, Sun } from "@/lib/engine/types";

export const Route = createFileRoute("/start")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { title: "Your profile — Vita Nova Life" },
      {
        name: "description",
        content:
          "Age, body, activity, daylight and diet. Coarse buckets only — enough context to weight your lab results.",
      },
      { property: "og:title", content: "Your profile — Vita Nova Life" },
      {
        property: "og:description",
        content: "The context we use to weight your lab results. No account needed.",
      },
    ],
  }),
  component: StartPage,
});

function StartPage() {
  const { profile } = useAppState();
  const navigate = useNavigate();
  const bmi = calcBmi(profile);
  const set = (patch: Partial<typeof profile>) => setState({ profile: { ...profile, ...patch } });
  const setFlag = (key: keyof typeof profile.flags, value: boolean) =>
    setState({ profile: { ...profile, flags: { ...profile.flags, [key]: value } } });

  const ready =
    profile.age !== null && profile.sex !== null && profile.activity && profile.sun && profile.diet;

  return (
    <Page>
      <div className="container-page max-w-3xl py-12">
        <StepHeader
          step="Step 1 of 3"
          title="A little context"
          intro="Coarse buckets are enough. We use this to decide which out-of-range value matters most for you — nothing else."
        />

        <button
          type="button"
          onClick={() => {
            setState({ profile: demoProfile, goals: demoGoals, labs: demoLabs });
          }}
          className="mb-8 rounded-full border border-border px-4 py-2 text-xs hover:border-primary/50"
        >
          Fill with a demo person
        </button>

        <div className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Age">
              <input
                type="number"
                className={inputClass}
                value={profile.age ?? ""}
                onChange={(e) => set({ age: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
            <Field label="Height (cm)">
              <input
                type="number"
                className={inputClass}
                value={profile.heightCm ?? ""}
                onChange={(e) => set({ heightCm: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
            <Field label="Weight (kg)" hint={bmi ? `BMI ${bmi}` : undefined}>
              <input
                type="number"
                className={inputClass}
                value={profile.weightKg ?? ""}
                onChange={(e) => set({ weightKg: e.target.value ? Number(e.target.value) : null })}
              />
            </Field>
          </div>

          <Group title="Sex">
            {(
              [
                ["female", "Female"],
                ["male", "Male"],
                ["other", "Other / prefer not to say"],
              ] as [Sex, string][]
            ).map(([v, l]) => (
              <Choice key={v} label={l} selected={profile.sex === v} onClick={() => set({ sex: v })} />
            ))}
          </Group>

          <Group title="Activity">
            {(
              [
                ["sedentary", "Sedentary", "Mostly sitting"],
                ["some", "Some movement", "Walks, occasional training"],
                ["regular", "Trains regularly", "Structured, most weeks"],
              ] as [Activity, string, string][]
            ).map(([v, l, h]) => (
              <Choice
                key={v}
                label={l}
                hint={h}
                selected={profile.activity === v}
                onClick={() => set({ activity: v })}
              />
            ))}
          </Group>

          <Group title="Daylight and sun">
            {(
              [
                ["little", "Little", "Indoors most days"],
                ["medium", "Medium", "Outside now and then"],
                ["lots", "Lots", "Outdoors daily"],
              ] as [Sun, string, string][]
            ).map(([v, l, h]) => (
              <Choice
                key={v}
                label={l}
                hint={h}
                selected={profile.sun === v}
                onClick={() => set({ sun: v })}
              />
            ))}
          </Group>

          <Group title="Diet">
            {(
              [
                ["typical", "Typical mixed diet", ""],
                ["littleMeat", "Little or no meat", ""],
                ["ultraProcessed", "Lots of ultra-processed food", ""],
                ["lowProtein", "Low protein", ""],
              ] as [Diet, string, string][]
            ).map(([v, l]) => (
              <Choice
                key={v}
                label={l}
                selected={profile.diet === v}
                onClick={() => set({ diet: v })}
              />
            ))}
          </Group>

          <div className="grid gap-4 sm:grid-cols-2">
            <Group title="Where you live">
              <Choice
                label="Northern Europe"
                selected={profile.region === "northernEurope"}
                onClick={() => set({ region: "northernEurope" })}
              />
              <Choice
                label="Somewhere else"
                selected={profile.region === "other"}
                onClick={() => set({ region: "other" })}
              />
            </Group>
            <Group title="Season right now">
              <Choice
                label="Dark half of the year"
                selected={profile.season === "winter"}
                onClick={() => set({ season: "winter" })}
              />
              <Choice
                label="Light half of the year"
                selected={profile.season === "summer"}
                onClick={() => set({ season: "summer" })}
              />
            </Group>
          </div>

          <div>
            <h2 className="text-2xl">Health flags</h2>
            <p className="mt-1 mb-3 text-sm text-muted-foreground">
              Yes or no only. These can stop a suggestion from being shown at all.
            </p>
            <div className="space-y-2">
              <Toggle
                label="Pregnant or breastfeeding"
                value={profile.flags.pregnantOrBreastfeeding}
                onChange={(v) => setFlag("pregnantOrBreastfeeding", v)}
              />
              <Toggle
                label="Known kidney disease"
                value={profile.flags.kidneyDisease}
                onChange={(v) => setFlag("kidneyDisease", v)}
              />
              <Toggle
                label="Known liver disease"
                value={profile.flags.liverDisease}
                onChange={(v) => setFlag("liverDisease", v)}
              />
              <Toggle
                label="Diabetes"
                value={profile.flags.diabetes}
                onChange={(v) => setFlag("diabetes", v)}
              />
              <Toggle
                label="Iron treatment or absorption issues"
                value={profile.flags.ironTreatment}
                onChange={(v) => setFlag("ironTreatment", v)}
              />
              <Toggle
                label="Blood thinners"
                value={profile.flags.bloodThinners}
                onChange={(v) => setFlag("bloodThinners", v)}
              />
              <Toggle
                label="Severe distress or thoughts of suicide"
                value={profile.flags.severeDistress}
                onChange={(v) => setFlag("severeDistress", v)}
              />
            </div>
            {profile.flags.severeDistress ? (
              <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/5 p-5">
                <h3 className="text-xl text-destructive">Please talk to someone today</h3>
                <p className="mt-2 text-sm">
                  We will not generate a lifestyle program for this. Contact your local emergency
                  number, your doctor, or a crisis line:
                </p>
                <ul className="mt-3 space-y-1 text-sm">
                  <li>Emergency (EU): 112</li>
                  <li>Norway — Mental Helse: 116 123</li>
                  <li>UK — Samaritans: 116 123</li>
                  <li>US — 988 Suicide &amp; Crisis Lifeline: 988</li>
                  <li>International directory: findahelpline.com</li>
                </ul>
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              disabled={!ready || profile.flags.severeDistress}
              onClick={() => navigate({ to: "/goals" })}
              className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground disabled:opacity-40"
            >
              Continue to goals
            </button>
            {!ready ? (
              <span className="text-xs text-muted-foreground">Fill the fields above to continue.</span>
            ) : null}
          </div>
        </div>
      </div>
    </Page>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-3 text-2xl">{title}</h2>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </div>
  );
}
